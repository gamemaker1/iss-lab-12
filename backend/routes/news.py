#news.py missing

from fastapi import APIRouter
from bson import ObjectId

router = APIRouter()

async def get_news_collection():
    from db import init_db
    return init_db()["news_collection"]

@router.get("/")
async def get_news(source: str = None):
    collection = await get_news_collection()
    query = {}
    if source and source != "all":
        query["source"] = source
        
    news_items = []
    async for item in collection.find(query):
        item["_id"] = str(item["_id"])
        news_items.append(item)
    return news_items

@router.get("/{news_id}")
async def get_news_item(news_id: str):
    collection = await get_news_collection()
    item = await collection.find_one({"_id": ObjectId(news_id)})
    if item:
        item["_id"] = str(item["_id"])
        return item
    return {"error": "News item not found"}