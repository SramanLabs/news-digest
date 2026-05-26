import os
import logging
from pymongo import MongoClient
from dotenv import load_dotenv

logger = logging.getLogger(__name__)

load_dotenv()

MONGODB_URL = os.getenv("MONGODB_URL", "mongodb://localhost:27017")
MONGODB_DB_NAME = os.getenv("MONGODB_DB_NAME", "news_digest")

# Gracious placeholder check
if "<username>" in MONGODB_URL:
    logger.warning("⚠️ MONGODB_URL placeholder detected. Falling back to local MongoDB 'mongodb://localhost:27017' for safety. Please configure your Atlas URI in backend/.env")
    MONGODB_URL = "mongodb://localhost:27017"

client = MongoClient(MONGODB_URL, serverSelectionTimeoutMS=5000)
db = client[MONGODB_DB_NAME]

try:
    # Quick connectivity check to verify server is reachable
    client.server_info()
    logger.info(f"🔌 Successfully connected to MongoDB database: '{MONGODB_DB_NAME}'")
except Exception as e:
    logger.error(f"❌ Failed to connect to MongoDB at {MONGODB_URL}: {e}")
    logger.error("Please make sure your local MongoDB server is running or your remote Atlas URI in backend/.env is correct.")

def get_db():
    try:
        yield db
    finally:
        pass
