import os
import time
import requests
import feedparser
import datetime
from typing import Optional
from google import genai
from dotenv import load_dotenv
from schemas import ArticleList

load_dotenv()

NEWS_API_KEY = os.getenv("NEWS_API_KEY")
# Initialize the client. The key is picked up from GEMINI_API_KEY env var
client = genai.Client()

def fetch_raw_news(target_date: Optional[datetime.date] = None) -> list:
    if target_date is None:
        target_date = datetime.date.today()
        
    rss_feeds = {
        "National": "https://www.thehindu.com/news/national/feeder/default.rss",
        "International": "https://www.thehindu.com/news/international/feeder/default.rss",
        "Business": "https://www.thehindu.com/business/feeder/default.rss",
        "Markets": "https://www.thehindu.com/business/markets/feeder/default.rss",
        "Technology": "https://www.thehindu.com/sci-tech/technology/feeder/default.rss",
        "Science": "https://www.thehindu.com/sci-tech/science/feeder/default.rss",
        "Health": "https://www.thehindu.com/sci-tech/health/feeder/default.rss",
        "Environment": "https://www.thehindu.com/sci-tech/energy-and-environment/feeder/default.rss",
        "Sports": "https://www.thehindu.com/sport/feeder/default.rss",
        "States": "https://www.thehindu.com/news/states/feeder/default.rss",
        "Cities": "https://www.thehindu.com/news/cities/feeder/default.rss"
    }
    
    all_articles = []
    
    for category, url in rss_feeds.items():
        feed = feedparser.parse(url)
        # Extract the top 6 entries from each feed that match target_date or are very fresh (within 1 day of target_date)
        added_for_category = 0
        for entry in feed.entries:
            # Parse the published date
            pub_date = None
            if hasattr(entry, 'published_parsed') and entry.published_parsed:
                try:
                    pub_date = datetime.date(*entry.published_parsed[:3])
                except Exception:
                    pass
            
            # Keep articles that are exactly on target_date, or 1 day prior (very fresh)
            is_fresh = False
            if pub_date is None:
                # If no date is available, default to keeping it
                is_fresh = True
            else:
                delta = target_date - pub_date
                # Within 0 to 1 days (same day or yesterday)
                if datetime.timedelta(days=0) <= delta <= datetime.timedelta(days=1):
                    is_fresh = True
            
            if is_fresh:
                article = {
                    "title": entry.title,
                    "link": entry.link,
                    "description": entry.description,
                    "category": category
                }
                all_articles.append(article)
                added_for_category += 1
                if added_for_category >= 6:
                    break
            
    return all_articles

def process_news_with_gemini(raw_news_data: list) -> ArticleList:
    all_processed_articles = []
    # Process in batches of 15 to stay well within Gemini's 8K output token limit
    batch_size = 15
    
    for i in range(0, len(raw_news_data), batch_size):
        batch = raw_news_data[i:i + batch_size]
        
        prompt = f"""You are an expert MBA news editor for Sraman Briefcase. Summarize these articles. You MUST assign each article to exactly one of the following categories: 'Commerce', 'National', 'International', 'Regional', 'Business', 'Technology', 'Politics', 'Sports', 'Health', 'Science', 'Environment', or 'Geopolitics'. Do NOT invent new categories.
        
        CRITICAL: You MUST process EVERY SINGLE article provided in the input. If the input contains {len(batch)} articles, you MUST output exactly {len(batch)} summaries. Do not group them together. Do not skip any.
        
        Raw news data:
        {batch}
        """
        
        try:
            response = client.models.generate_content(
                model='gemini-2.5-flash',
                contents=prompt,
                config={
                    'response_mime_type': 'application/json',
                    'response_schema': ArticleList
                }
            )
            if response.parsed and hasattr(response.parsed, 'articles'):
                all_processed_articles.extend(response.parsed.articles)
        except Exception as e:
            print(f"Error processing batch starting at index {i}: {e}")
            
        # Sleep to avoid hitting rate limits
        time.sleep(3)
            
    return ArticleList(articles=all_processed_articles)

def get_definition(word: str) -> str:
    prompt = f"""You are Sraman Briefcase, an elite MBA tutor and AI business strategist. 
    Analyze the word or phrase: "{word}"
    
    Provide a response strictly structured exactly in the following format (do NOT use markdown headers or bold subtitles, keep it clean, highly professional, and concise):
    
    Part of Speech: [Noun, Verb, Adjective, etc.]
    Meaning: [A clear, comprehensive definition restricted to a maximum of 2 lines/sentences]
    Usage Example: [A highly relevant business or professional usage example of the word/phrase]
    """
    try:
        response = client.models.generate_content(
            model='gemini-2.5-flash',
            contents=prompt,
        )
        return response.text
    except Exception as e:
        return f"Error generating definition: {e}"

def get_translation(word: str, language: str) -> str:
    prompt = f"""You are an elite, highly accurate language translator. 
    Translate the following word/phrase into {language}: "{word}"
    
    Provide only the precise translation followed by a very brief grammatical or contextual note in English if helpful. Limit to 1-2 sentences.
    """
    try:
        response = client.models.generate_content(
            model='gemini-2.5-flash',
            contents=prompt,
        )
        return response.text
    except Exception as e:
        return f"Error generating translation: {e}"
