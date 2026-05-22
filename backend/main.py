import logging
import datetime
from typing import Optional
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

app = FastAPI(title="Sraman Briefcase MBA News Digest API")

# CORS Configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

def fetch_and_store_news():
    logger.info("Starting daily news fetch pipeline...")
    try:
        # Fetch raw news
        raw_news = services.fetch_raw_news()
        
        # Process with Gemini
        processed_data = services.process_news_with_gemini(raw_news)
        
        # Store in database
        today = datetime.date.today()
        
        db = SessionLocal()
        try:
            for article in processed_data.articles:
                db_article = models.NewsArticle(
                    published_date=today,
                    category=article.category,
                    headline=article.headline,
                    description=article.description,
                    source_url=article.source_url
                )
                db.add(db_article)
            db.commit()
            logger.info(f"Successfully stored {len(processed_data.articles)} articles for {today}.")
        except Exception as db_e:
            db.rollback()
            logger.error(f"Database error: {db_e}")
        finally:
            db.close()
            
    except Exception as e:
        logger.error(f"Error in news fetch pipeline: {e}")

# Scheduler Configuration
scheduler = BackgroundScheduler()
scheduler.add_job(fetch_and_store_news, 'cron', hour=0, minute=1)
scheduler.start()

@app.on_event("shutdown")
def shutdown_event():
    scheduler.shutdown()

@app.get("/api/news", response_model=schemas.NewsResponse)
def get_news(
    date: Optional[datetime.date] = None, 
    category: Optional[str] = None, 
    db: Session = Depends(get_db)
):
    query = db.query(models.NewsArticle)
    
    if date:
        query = query.filter(models.NewsArticle.published_date == date)
    if category:
        query = query.filter(models.NewsArticle.category == category)
        
    articles = query.all()
    return schemas.NewsResponse(articles=articles)

@app.post("/api/news/trigger-fetch")
def trigger_fetch(background_tasks: BackgroundTasks):
    background_tasks.add_task(fetch_and_store_news)
    return {"message": "News fetch pipeline triggered in the background"}
