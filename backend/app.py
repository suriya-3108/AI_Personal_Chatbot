import importlib.metadata
try:
    importlib.metadata.packages_distributions
except AttributeError:
    import importlib_metadata
    importlib.metadata.packages_distributions = importlib_metadata.packages_distributions

from flask import Flask, request, jsonify, send_file
from flask_cors import CORS
from flask_jwt_extended import JWTManager, jwt_required, get_jwt_identity
import config
from auth import init_auth, register_routes as register_auth_routes
from ai_engine import ai_engine
from speech_module import speech_module
from memory import MemoryManager
from search_module import search_module
from actions import actions_module
import os
import tempfile

# Initialize Flask app
app = Flask(__name__)
app.config.from_object(config.Config)

# Initialize extensions
CORS(app, origins=app.config['CORS_ORIGINS'])
init_auth(app)

# Initialize memory manager
memory_manager = MemoryManager()

# Register authentication routes
register_auth_routes(app)

@app.route('/api/chat', methods=['POST'])
@jwt_required()
def chat():
    """Handle chat messages"""
    try:
        user_id = get_jwt_identity()
        data = request.get_json()
        user_message = data.get('message', '').strip()
        
        if not user_message:
            return jsonify({'error': 'Message cannot be empty'}), 400
        
        # Get user info
        user = memory_manager.get_user_by_id(user_id)
        if not user:
            return jsonify({'error': 'User not found'}), 404
        
        # Get conversation history
        conversation_history = memory_manager.get_conversation_history(user_id)
        
        # Check for actions first
        action_type = actions_module.detect_action(user_message)
        if action_type:
            action_result = actions_module.execute_action(
                action_type, user_message, user['preferred_name']
            )
            if action_result:
                # Add to conversation history
                new_messages = conversation_history + [
                    {'role': 'user', 'content': user_message},
                    {'role': 'assistant', 'content': action_result['response']}
                ]
                memory_manager.save_conversation(user_id, new_messages)
                
                return jsonify({
                    'response': action_result['response'],
                    'action': action_result,
                    'chatbot_name': user['chatbot_name']
                })
        
        # Check for knowledge queries
        if ai_engine.is_knowledge_query(user_message):
            search_results = search_module.web_search(user_message)
            if search_results:
                # Add search context to message
                search_context = search_module.format_search_results(search_results)
                enhanced_message = f"{user_message}\n\nContext from web search:\n{search_context}"
                
                # Generate AI response with search context
                ai_response = ai_engine.generate_response(
                    user_id, enhanced_message, conversation_history
                )
                
                # Add search links to response
                ai_response += "\n\n**Sources:**\n" + "\n".join(
                    [f"- [{result['title']}]({result['link']})" for result in search_results[:3]]
                )
            else:
                ai_response = ai_engine.generate_response(
                    user_id, user_message, conversation_history
                )
        else:
            # Regular AI response
            ai_response = ai_engine.generate_response(
                user_id, user_message, conversation_history
            )
        
        # Update conversation history
        new_messages = conversation_history + [
            {'role': 'user', 'content': user_message},
            {'role': 'assistant', 'content': ai_response}
        ]
        memory_manager.save_conversation(user_id, new_messages)
        
        return jsonify({
            'response': ai_response,
            'chatbot_name': user['chatbot_name']
        })
        
    except Exception as e:
        return jsonify({'error': f'Chat processing failed: {str(e)}'}), 500

@app.route('/api/chat/speech-to-text', methods=['POST'])
@jwt_required()
def speech_to_text():
    """Convert speech to text"""
    try:
        if 'audio' not in request.files:
            return jsonify({'error': 'No audio file provided'}), 400
        
        audio_file = request.files['audio']
        
        # Save audio to temporary file
        with tempfile.NamedTemporaryFile(delete=False, suffix='.wav') as temp_audio:
            audio_file.save(temp_audio.name)
            text = speech_module.speech_to_text(temp_audio.name)
        
        # Clean up
        os.unlink(temp_audio.name)
        
        return jsonify({'text': text})
        
    except Exception as e:
        return jsonify({'error': f'Speech to text failed: {str(e)}'}), 500

@app.route('/api/chat/text-to-speech', methods=['POST'])
@jwt_required()
def text_to_speech():
    """Convert text to speech"""
    try:
        data = request.get_json()
        text = data.get('text', '')
        
        if not text:
            return jsonify({'error': 'No text provided'}), 400
        
        audio_file_path = speech_module.text_to_speech(text)
        
        if audio_file_path and os.path.exists(audio_file_path):
            response = send_file(audio_file_path, as_attachment=True, download_name='response.mp3')
            
            # Schedule cleanup
            import threading
            import time
            def cleanup():
                time.sleep(30)  # Wait 30 seconds before cleanup
                speech_module.cleanup_audio_file(audio_file_path)
            
            threading.Thread(target=cleanup).start()
            
            return response
        else:
            return jsonify({'error': 'Text to speech conversion failed'}), 500
            
    except Exception as e:
        return jsonify({'error': f'Text to speech failed: {str(e)}'}), 500

@app.route('/api/chat/history', methods=['GET'])
@jwt_required()
def get_chat_history():
    """Get chat history for current user"""
    try:
        user_id = get_jwt_identity()
        user = memory_manager.get_user_by_id(user_id)
        
        if not user:
            return jsonify({'error': 'User not found'}), 404
        
        conversation_history = memory_manager.get_conversation_history(user_id)
        
        return jsonify({
            'history': conversation_history,
            'chatbot_name': user['chatbot_name'],
            'user_name': user['preferred_name']
        })
        
    except Exception as e:
        return jsonify({'error': f'Failed to get chat history: {str(e)}'}), 500

@app.route('/api/chat/clear', methods=['POST'])
@jwt_required()
def clear_chat_history():
    """Clear chat history for current user"""
    try:
        user_id = get_jwt_identity()
        memory_manager.clear_conversation_history(user_id)
        
        return jsonify({'message': 'Chat history cleared successfully'})
        
    except Exception as e:
        return jsonify({'error': f'Failed to clear chat history: {str(e)}'}), 500

@app.route('/api/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    return jsonify({'status': 'healthy', 'message': 'AI Assistant API is running'})

if __name__ == '__main__':
    app.run(debug=True, use_reloader=False, host='0.0.0.0', port=5000)
