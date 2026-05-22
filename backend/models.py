from sqlalchemy import Column, Integer, String, Text, Date
from database import Base

class NewsArticle(Base):
    __tablename__ = "news_articles"

    id = Column(Integer, primary_key=True, index=True)
    published_date = Column(Date, index=True)
    category = Column(String, index=True)
    headline = Column(String)
    description = Column(Text)
    source_url = Column(String)
