import requests
import json
from datetime import datetime, timedelta
import re

class ActionsModule:
    def __init__(self):
        self.weather_api_key = None  # Add your OpenWeatherMap API key if needed
    
    def detect_action(self, message):
        """Detect if message contains an action request"""
        message_lower = message.lower()
        
        if any(word in message_lower for word in ['weather', 'temperature', 'forecast']):
            return 'weather'
        elif any(word in message_lower for word in ['remind', 'reminder', 'remember']):
            return 'reminder'
        elif any(word in message_lower for word in ['open', 'website', 'browse']):
            return 'open_website'
        elif any(word in message_lower for word in ['time', 'current time']):
            return 'current_time'
        
        return None
    
    def execute_action(self, action_type, message, user_preferred_name):
        """Execute the detected action"""
        if action_type == 'weather':
            return self.get_weather(message, user_preferred_name)
        elif action_type == 'reminder':
            return self.set_reminder(message, user_preferred_name)
        elif action_type == 'open_website':
            return self.open_website(message, user_preferred_name)
        elif action_type == 'current_time':
            return self.get_current_time(user_preferred_name)
        
        return None
    
    def get_weather(self, message, user_name):
        """Get weather information (placeholder implementation)"""
        # This would integrate with a weather API like OpenWeatherMap
        return {
            'type': 'weather',
            'response': f"Sorry {user_name}, weather service is currently unavailable. Please check your favorite weather app for current conditions.",
            'data': None
        }
    
    def set_reminder(self, message, user_name):
        """Set a reminder (placeholder implementation)"""
        # Extract time and task from message
        return {
            'type': 'reminder',
            'response': f"Okay {user_name}, I've noted your reminder. In a full implementation, this would set an actual reminder for you!",
            'data': {'message': message}
        }
    
    def open_website(self, message, user_name):
        """Extract website URL from message"""
        # Simple URL extraction
        urls = re.findall(r'https?://[^\s]+', message)
        if urls:
            return {
                'type': 'open_website',
                'response': f"{user_name}, I found this website in your message. In a real app, I would open it for you!",
                'data': {'url': urls[0]}
            }
        else:
            return {
                'type': 'open_website',
                'response': f"{user_name}, I couldn't find a valid URL in your message. Please include a full website address starting with http:// or https://",
                'data': None
            }
    
    def get_current_time(self, user_name):
        """Get current time"""
        current_time = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
        return {
            'type': 'current_time',
            'response': f"{user_name}, the current time is {current_time}",
            'data': {'time': current_time}
        }

# Global instance
actions_module = ActionsModule()