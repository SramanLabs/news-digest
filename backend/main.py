import logging
import datetime
from typing import Optional
from contextlib import asynccontextmanager
from fastapi import FastAPI, Depends, BackgroundTasks
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from apscheduler.schedulers.background import BackgroundScheduler

import models, schemas, services
from database import engine, get_db, SessionLocal

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Create tables
models.Base.metadata.create_all(bind=engine)

scheduler = BackgroundScheduler()

@asynccontextmanager
async def lifespan(app: FastAPI):
    scheduler.add_job(fetch_and_store_news, 'cron', hour=0, minute=1)
    scheduler.start()
    yield
    scheduler.shutdown()

app = FastAPI(title="Sraman's News Digest API", lifespan=lifespan)

# CORS Configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

def fetch_and_store_news(target_date: Optional[datetime.date] = None):
    if target_date is None:
        target_date = datetime.date.today()
    logger.info(f"Starting news fetch pipeline for {target_date}...")
    try:
        # Fetch raw news
        raw_news = services.fetch_raw_news(target_date)
        
        # Process with Gemini
        processed_data = services.process_news_with_gemini(raw_news)
        
        db = SessionLocal()
        try:
            for article in processed_data.articles:
                db_article = models.NewsArticle(
                    published_date=target_date,
                    category=article.category,
                    headline=article.headline,
                    description=article.description,
                    source_url=article.source_url
                )
                db.add(db_article)
            db.commit()
            logger.info(f"Successfully stored {len(processed_data.articles)} articles for {target_date}.")
        except Exception as db_e:
            db.rollback()
            logger.error(f"Database error: {db_e}")
        finally:
            db.close()
            
    except Exception as e:
        logger.error(f"Error in news fetch pipeline: {e}")



@app.get("/api/news", response_model=schemas.NewsResponse)
def get_news(
    date: Optional[datetime.date] = None, 
    category: Optional[str] = None, 
    skip: int = 0,
    limit: int = 20,
    db: Session = Depends(get_db)
):
    query = db.query(models.NewsArticle)
    
    if date:
        query = query.filter(models.NewsArticle.published_date == date)
    if category:
        query = query.filter(models.NewsArticle.category.ilike(category))
        
    query = query.order_by(models.NewsArticle.id.desc())
    articles = query.offset(skip).limit(limit).all()
    return schemas.NewsResponse(articles=articles)

@app.post("/api/news/trigger-fetch")
def trigger_fetch(background_tasks: BackgroundTasks, date: Optional[datetime.date] = None):
    background_tasks.add_task(fetch_and_store_news, date)
    return {"message": f"News fetch pipeline triggered in the background for {date or 'today'}"}

@app.post("/api/assistant/define")
def assistant_define(word: str):
    definition = services.get_definition(word)
    return {"result": definition}

@app.post("/api/assistant/translate")
def assistant_translate(word: str, language: str):
    translation = services.get_translation(word, language)
    return {"result": translation}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
