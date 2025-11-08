import os
from datetime import timedelta
from dotenv import load_dotenv  # ✅ import this

# ✅ Load .env file before reading environment variables
load_dotenv()

class Config:
    # MongoDB Configuration
    MONGO_URI = os.getenv('MONGO_URI', 'mongodb://localhost:27017/ai_assistant')
    
    # Gemini API Configuration
    GEMINI_API_KEY = os.getenv('GEMINI_API_KEY', 'your-gemini-api-key-here')
    
    # Web Search API (Using SerpAPI as example)
    SERPAPI_KEY = os.getenv('SERPAPI_KEY', 'your-serpapi-key-here')
    
    # JWT Configuration
    JWT_SECRET_KEY = os.getenv('JWT_SECRET_KEY', 'your-secret-key-here')
    JWT_ACCESS_TOKEN_EXPIRES = timedelta(hours=24)
    
    # Flask Configuration
    SECRET_KEY = os.getenv('SECRET_KEY', 'your-flask-secret-key')
    
    # CORS Configuration
    CORS_ORIGINS = ['http://localhost:3000']
