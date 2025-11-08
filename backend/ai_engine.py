# ai_engine.py - With fallback responses
import google.generativeai as genai
import config
from memory import MemoryManager
import time
import random

class AIEngine:
    def __init__(self):
        self.memory_manager = MemoryManager()
        self.last_request_time = 0
        self.request_delay = 2  # 2 seconds between requests to avoid rate limits
        
        # Configure Gemini API only if key is available
        api_key = config.Config.GEMINI_API_KEY
        if api_key and api_key != 'your-gemini-api-key-here':
            try:
                genai.configure(api_key=api_key)
                # Use a free-tier friendly model
                self.model = genai.GenerativeModel("models/gemini-2.5-flash")
                self.api_available = True
                print("✅ Gemini API configured successfully")
            except Exception as e:
                print(f"❌ Gemini API configuration failed: {e}")
                self.api_available = False
        else:
            print("❌ No Gemini API key found, using fallback mode")
            self.api_available = False

    def generate_response(self, user_id, user_message, conversation_history=None):
        """Generate AI response with fallback to rule-based responses"""
        try:
            # Rate limiting
            current_time = time.time()
            if current_time - self.last_request_time < self.request_delay:
                time.sleep(self.request_delay)
            self.last_request_time = current_time

            user = self.memory_manager.get_user_by_id(user_id)
            if not user:
                return "I'm sorry, I couldn't find your user information."

            preferred_name = user.get("preferred_name", "User")
            chatbot_name = user.get("chatbot_name", "AI Assistant")

            # Try Gemini API first if available
            if self.api_available:
                try:
                    return self._generate_gemini_response(
                        preferred_name, chatbot_name, user_message, conversation_history
                    )
                except Exception as e:
                    print(f"Gemini API error, using fallback: {e}")
                    self.api_available = False  # Disable API after first error

            # Fallback to rule-based responses
            return self._generate_fallback_response(
                preferred_name, chatbot_name, user_message
            )

        except Exception as e:
            return f"Hello {preferred_name}! I'm here to help. (System temporarily using simple responses)"

    def _generate_gemini_response(self, preferred_name, chatbot_name, user_message, conversation_history):
        """Generate response using Gemini API"""
        context = self._build_context(preferred_name, chatbot_name, conversation_history or [])
        prompt = f"{context}\n\nUser: {user_message}\n{chatbot_name}:"
        
        response = self.model.generate_content(prompt)
        return self._clean_response(response.text, chatbot_name)

    def _generate_fallback_response(self, preferred_name, chatbot_name, user_message):
        """Generate intelligent fallback responses without API"""
        message_lower = user_message.lower()
        
        # Greeting responses
        if any(word in message_lower for word in ['hello', 'hi', 'hey', 'hola']):
            greetings = [
                f"Hello {preferred_name}! Great to see you today!",
                f"Hi {preferred_name}! How can I assist you?",
                f"Hey {preferred_name}! What can I help you with?"
            ]
            return random.choice(greetings)
        
        # Question responses
        elif '?' in user_message:
            if 'how are you' in message_lower:
                return f"I'm doing well, thank you for asking {preferred_name}! How are you today?"
            elif 'your name' in message_lower:
                return f"My name is {chatbot_name}, your personal AI assistant!"
            elif 'time' in message_lower:
                from datetime import datetime
                current_time = datetime.now().strftime("%I:%M %p")
                return f"The current time is {current_time}, {preferred_name}."
            else:
                responses = [
                    f"That's an interesting question, {preferred_name}. While I'm currently operating in basic mode, I'd be happy to help you think through this.",
                    f"I appreciate your question, {preferred_name}. Let me suggest researching this topic online for the most current information.",
                    f"Great question, {preferred_name}! This would be a perfect topic to explore further when full AI capabilities are available."
                ]
                return random.choice(responses)
        
        # Weather queries
        elif any(word in message_lower for word in ['weather', 'temperature', 'forecast']):
            return f"I'd love to check the weather for you {preferred_name}, but I'm currently in basic mode. You might want to check a weather app or website for the most accurate forecast!"
        
        # Search queries
        elif any(word in message_lower for word in ['what is', 'who is', 'tell me about']):
            return f"That sounds like something worth researching, {preferred_name}! While I'm in basic mode, I'd recommend searching online for the most up-to-date information about that topic."
        
        # Default friendly response
        else:
            responses = [
                f"Thanks for sharing that, {preferred_name}! I'm here to chat with you.",
                f"I understand, {preferred_name}. What else would you like to talk about?",
                f"Interesting point, {preferred_name}! I'm currently operating in basic mode but still happy to converse with you.",
                f"Got it, {preferred_name}! Is there anything specific you'd like help with today?"
            ]
            return random.choice(responses)

    def _build_context(self, preferred_name, chatbot_name, history):
        """Build context for the AI with conversation history"""
        context = f"""You are {chatbot_name}, a helpful AI assistant. 
The user's name is {preferred_name}. Always address them by name when appropriate.
Be friendly, helpful, and engaging.

Previous conversation context:"""

        if history:
            for msg in history[-6:]:
                role = "User" if msg["role"] == "user" else chatbot_name
                context += f"\n{role}: {msg['content']}"
        else:
            context += "\nNo previous conversation."

        context += f"\n\nInstructions: Respond naturally as {chatbot_name}. Keep responses clear and helpful."
        return context

    def _clean_response(self, response, chatbot_name):
        """Clean and format the AI response"""
        if response.startswith(f"{chatbot_name}:"):
            response = response[len(f"{chatbot_name}:"):].strip()
        return response.replace("**", "").strip()

    def is_knowledge_query(self, message):
        """Detect if message is a knowledge-based query"""
        keywords = ['what is', 'explain', 'how does', 'tell me about', 
                    'define', 'meaning of', 'who is', 'when was', 'why is']
        message_lower = message.lower()
        return any(k in message_lower for k in keywords)

# ✅ Global instance
ai_engine = AIEngine()