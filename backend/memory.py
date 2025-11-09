# memory.py - Complete version
from pymongo import MongoClient
from bson import ObjectId
from datetime import datetime
import config

class MemoryManager:
    def __init__(self):
        self.client = MongoClient(config.Config.MONGO_URI)
        self.db = self.client.ai_assistant
        self.users = self.db.users
        self.conversations = self.db.conversations
    
    def create_user(self, username, email, password_hash, preferred_name, chatbot_name):
        """Create a new user in database"""
        user_data = {
            'username': username,
            'email': email,
            'password': password_hash,
            'preferred_name': preferred_name,
            'chatbot_name': chatbot_name,
            'theme_preference': 'light',
            'voice_enabled': True,
            'created_at': datetime.utcnow()
        }
        result = self.users.insert_one(user_data)
        return str(result.inserted_id)
    
    def get_user_by_username(self, username):
        """Get user by username"""
        return self.users.find_one({'username': username})
    
    def get_user_by_email(self, email):
        """Get user by email"""
        return self.users.find_one({'email': email})
    
    def get_user_by_id(self, user_id):
        """Get user by ID"""
        return self.users.find_one({'_id': ObjectId(user_id)})
    
    def update_user_preferences(self, user_id, preferences):
        """Update user preferences"""
        self.users.update_one(
            {'_id': ObjectId(user_id)},
            {'$set': preferences}
        )
    
    def save_conversation(self, user_id, messages):
        """Save or update conversation history"""
        # Find existing conversation for today
        today = datetime.utcnow().date()
        start_of_day = datetime(today.year, today.month, today.day)
        
        existing = self.conversations.find_one({
            'user_id': ObjectId(user_id),
            'last_updated': {'$gte': start_of_day}
        })
        
        if existing:
            # Update existing conversation
            self.conversations.update_one(
                {'_id': existing['_id']},
                {'$set': {
                    'messages': messages,
                    'last_updated': datetime.utcnow()
                }}
            )
        else:
            # Create new conversation
            self.conversations.insert_one({
                'user_id': ObjectId(user_id),
                'messages': messages,
                'last_updated': datetime.utcnow()
            })
    
    def get_conversation_history(self, user_id, limit=10):
        """Get recent conversation history"""
        conversations = self.conversations.find({
            'user_id': ObjectId(user_id)
        }).sort('last_updated', -1).limit(limit)
        
        # Combine messages from recent conversations
        all_messages = []
        for conv in conversations:
            all_messages.extend(conv['messages'])
        
        return all_messages[-20:]  # Return last 20 messages
    
    def clear_conversation_history(self, user_id):
        """Clear user's conversation history"""
        self.conversations.delete_many({'user_id': ObjectId(user_id)})