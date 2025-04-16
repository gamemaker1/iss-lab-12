from motor.motor_asyncio import AsyncIOMotorClient
import os

def init_db():
    MONGO_URI = os.getenv("MONGO_URL", "mongodb://localhost:27017")
    client = AsyncIOMotorClient(MONGO_URI)
    db = client["testdb"]
    return {
        "items_collection": db["items"],
        "users_collection": db["users"],
        "news_collection": db["news"],                 #added news
        "quiz_collection": db["quiz_attempts"]         #added quiz
    }
    # Question for chocolate: How can we implement nosql syntax in mysql ???