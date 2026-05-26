from pydantic import BaseModel
from typing import List, Optional
from datetime import date

# Pydantic schemas for Gemini Structured Outputs
class ProcessedArticle(BaseModel):
    headline: str
    description: str
    category: str
    source_url: str

class ArticleList(BaseModel):
    articles: List[ProcessedArticle]

# Pydantic schemas for API response
class NewsArticleBase(BaseModel):
    headline: str
    description: str
    category: str
    source_url: str

class NewsArticleResponse(NewsArticleBase):
    id: str
    published_date: date

    class Config:
        from_attributes = True

class NewsResponse(BaseModel):
    articles: List[NewsArticleResponse]

# Pydantic schemas for User Stats
class TrackTimeRequest(BaseModel):
    email: str
    active_seconds: int

class UserStatsResponse(BaseModel):
    email: str
    streak_days: int
    today_reading_seconds: int
    last_active_date: str

class MarkReadRequest(BaseModel):
    email: str
    article_id: str
