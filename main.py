from fastapi import FastAPI, Query
from pydantic import BaseModel
from datetime import datetime, timezone
from pymongo.mongo_client import MongoClient
from pymongo.server_api import ServerApi
import requests
from fastapi.middleware.cors import CORSMiddleware
import os
from dotenv import load_dotenv

# Load env vars from .env in development
load_dotenv()

# -------------------------------
# INIT
# -------------------------------

app = FastAPI()

# Allow frontend (update for production if needed)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["https://greensph.vercel.app", "http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# -------------------------------
# ENV VARS
# -------------------------------

MONGO_URI = os.getenv("MONGODB_URI")
NEWS_API_KEY = os.getenv("NEWS_API_KEY")

# MongoDB setup
client = MongoClient(MONGO_URI, server_api=ServerApi("1"))
db = client["GreenSphere"]
users_collection = db["users"]

# -------------------------------
# MODELS
# -------------------------------

class TrackerData(BaseModel):
    user_id: str
    action: str
    category: str
    points: int

class ForumPost(BaseModel):
    user_id: str
    title: str
    content: str

class UserSignUp(BaseModel):
    username: str
    email: str
    password: str

# -------------------------------
# HELPERS
# -------------------------------

def calculate_level(points: int) -> str:
    if points >= 500:
        return "Eco Master"
    elif points >= 200:
        return "Green Hero"
    elif points >= 50:
        return "Eco Starter"
    return "Newbie"

tips_data = {
    "transportation": ["Carpool when possible", "Use public transport", "Bike more often"],
    "energy": ["Switch to LED bulbs", "Unplug unused devices", "Use energy-efficient appliances"],
    "diet": ["Eat less red meat", "Buy local produce", "Avoid food waste"],
    "waste": ["Recycle regularly", "Use reusable bags", "Avoid single-use plastics"]
}

# -------------------------------
# ROUTES
# -------------------------------
@app.post("/signup")
async def signup(user: UserSignUp):
    # Check if email is already registered
    existing_user = users_collection.find_one({"email": user.email})
    if existing_user:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Email already registered")

    # Save user to database (without hashing passwords for simplicity)
    user_data = {
        "username": user.username,
        "email": user.email,
        "password": user.password,  # Storing password in plaintext (not recommended for production)
        "created_at": datetime.now(timezone.utc),
    }
    users_collection.insert_one(user_data)
    return {"msg": "User successfully created"}

@app.get("/users")
async def get_users():
    users = list(users_collection.find())
    for user in users:
        user["_id"] = str(user["_id"])  # Convert ObjectId to string
    return users

@app.get("/")
def read_root():
    return {"message": "Welcome to The GreenSphere API 🌱"}

@app.get("/tips")
def get_tips(category: str = Query(...)):
    return {"category": category, "tips": tips_data.get(category, [])}

@app.post("/tracker/log")
def log_action(data: TrackerData):
    data_dict = data.model_dump()
    data_dict["date"] = datetime.now(timezone.utc)
    db.tracker.insert_one(data_dict)
    return {"msg": "Action logged"}

@app.get("/tracker/user/{user_id}")
def get_user_tracker(user_id: str):
    actions = list(db.tracker.find({"user_id": user_id}))
    for action in actions:
        action["_id"] = str(action["_id"])
    return actions

@app.get("/tracker/user/{user_id}/summary")
def user_summary(user_id: str):
    actions = db.tracker.find({"user_id": user_id})
    total_points = sum(a["points"] for a in actions)
    level = calculate_level(total_points)
    return {"total_points": total_points, "level": level}

@app.get("/news")
def get_eco_news():
    url = "https://newsapi.org/v2/everything"
    params = {
        "q": "climate change OR sustainability",
        "apiKey": NEWS_API_KEY,
        "pageSize": 5
    }
    response = requests.get(url, params=params)
    return response.json()

@app.post("/forum/post")
def create_post(post: ForumPost):
    post_dict = post.model_dump()
    post_dict["timestamp"] = datetime.now(timezone.utc)
    db.forum.insert_one(post_dict)
    return {"msg": "Post created"}

@app.get("/forum/posts")
def get_posts():
    posts = list(db.forum.find().sort("timestamp", -1))
    for post in posts:
        post["_id"] = str(post["_id"])
    return posts
