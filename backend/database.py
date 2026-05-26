import os
import logging
from pymongo import MongoClient
from dotenv import load_dotenv

logger = logging.getLogger(__name__)

load_dotenv()

MONGODB_URL = os.getenv("MONGODB_URL")
MONGODB_DB_NAME = os.getenv("MONGODB_DB_NAME", "news_digest")

if not MONGODB_URL:
    raise ValueError("MONGODB_URL environment variable is missing. Please configure your Atlas URI in backend/.env")
if "<username>" in MONGODB_URL:
    raise ValueError("MONGODB_URL contains a placeholder '<username>'. Please configure your actual Atlas URI in backend/.env")

client = MongoClient(MONGODB_URL, serverSelectionTimeoutMS=5000)
db = client[MONGODB_DB_NAME]

try:
    # Quick connectivity check to verify server is reachable
    client.server_info()
    logger.info(f"🔌 Successfully connected to MongoDB database: '{MONGODB_DB_NAME}'")
    
    # Create indexes for performance optimization
    db.news_articles.create_index([("published_date", -1)])
    db.news_articles.create_index([("category", 1)])
    logger.info("⚡ Database indexes verified and active on news_articles collection")
except Exception as e:
    logger.error(f"❌ Failed to connect to MongoDB at {MONGODB_URL}: {e}")
    logger.error("Please make sure your local MongoDB server is running or your remote Atlas URI in backend/.env is correct.")

def get_db():
    try:
        yield db
    finally:
        pass
