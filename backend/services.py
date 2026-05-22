import os
import requests
from google import genai
from dotenv import load_dotenv
from schemas import ArticleList

load_dotenv()

NEWS_API_KEY = os.getenv("NEWS_API_KEY")
# Initialize the client. The key is picked up from GEMINI_API_KEY env var
client = genai.Client()

def fetch_raw_news() -> dict:
    url = f"https://gnews.io/api/v4/top-headlines?category=general&apikey={NEWS_API_KEY}&lang=en"
    response = requests.get(url)
    response.raise_for_status()
    return response.json()

def process_news_with_gemini(raw_news_data: dict) -> ArticleList:
    prompt = f"""Act as an expert MBA news editor for Sraman Briefcase. Extract the top facts from the raw news, categorize them (e.g., National, Commerce, International), and write crisp, analytical summaries tailored for CAT aspirants.
    
    Raw news data:
    {raw_news_data}
    """
    
    response = client.models.generate_content(
        model='gemini-2.5-flash',
        contents=prompt,
        config={
            'response_mime_type': 'application/json',
            'response_schema': ArticleList
        }
    )
    
    return response.parsed
