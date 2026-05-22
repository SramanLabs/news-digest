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
    id: int
    published_date: date

    class Config:
        from_attributes = True

class NewsResponse(BaseModel):
    articles: List[NewsArticleResponse]
