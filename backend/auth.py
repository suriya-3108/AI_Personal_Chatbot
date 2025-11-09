from flask import jsonify, request
from flask_jwt_extended import JWTManager, create_access_token, jwt_required, get_jwt_identity
from werkzeug.security import generate_password_hash, check_password_hash
from memory import MemoryManager
import re

memory_manager = MemoryManager()
jwt = JWTManager()

def init_auth(app):
    jwt.init_app(app)

def validate_email(email):
    """Validate email format"""
    pattern = r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'
    return re.match(pattern, email) is not None

def register_routes(app):
    
    @app.route('/api/auth/signup', methods=['POST'])
    def signup():
        try:
            data = request.get_json()
            
            # Validate required fields
            required_fields = ['username', 'email', 'password', 'preferredName', 'chatbotName']
            for field in required_fields:
                if not data.get(field):
                    return jsonify({'error': f'Missing required field: {field}'}), 400
            
            # Validate email
            if not validate_email(data['email']):
                return jsonify({'error': 'Invalid email format'}), 400
            
            # Check if user already exists
            if memory_manager.get_user_by_username(data['username']):
                return jsonify({'error': 'Username already exists'}), 409
            
            if memory_manager.get_user_by_email(data['email']):
                return jsonify({'error': 'Email already exists'}), 409
            
            # Hash password
            password_hash = generate_password_hash(data['password'])
            
            # Create user
            user_id = memory_manager.create_user(
                username=data['username'],
                email=data['email'],
                password_hash=password_hash,
                preferred_name=data['preferredName'],
                chatbot_name=data['chatbotName']
            )
            
            # Create access token
            access_token = create_access_token(identity=user_id)
            
            return jsonify({
                'message': 'User created successfully',
                'access_token': access_token,
                'user_id': user_id,
                'preferred_name': data['preferredName'],
                'chatbot_name': data['chatbotName']
            }), 201
            
        except Exception as e:
            return jsonify({'error': f'Registration failed: {str(e)}'}), 500
    
    @app.route('/api/auth/login', methods=['POST'])
    def login():
        try:
            data = request.get_json()
            identifier = data.get('username') or data.get('email')  # Support both username or email
            password = data.get('password')
            
            if not identifier or not password:
                return jsonify({'error': 'Username or email and password required'}), 400
            
            # Determine if identifier is email
            if validate_email(identifier):
                user = memory_manager.get_user_by_email(identifier)
            else:
                user = memory_manager.get_user_by_username(identifier)
            
            if not user or not check_password_hash(user['password'], password):
                return jsonify({'error': 'Invalid credentials'}), 401
            
            access_token = create_access_token(identity=str(user['_id']))
            
            return jsonify({
                'message': 'Login successful',
                'access_token': access_token,
                'user_id': str(user['_id']),
                'preferred_name': user['preferred_name'],
                'chatbot_name': user['chatbot_name'],
                'theme_preference': user.get('theme_preference', 'light')  # FIXED: Changed 'dark' to 'light'
            }), 200
            
        except Exception as e:
            return jsonify({'error': f'Login failed: {str(e)}'}), 500
    
    @app.route('/api/auth/profile', methods=['GET'])
    @jwt_required()
    def get_profile():
        try:
            user_id = get_jwt_identity()
            user = memory_manager.get_user_by_id(user_id)
            
            if not user:
                return jsonify({'error': 'User not found'}), 404
            
            return jsonify({
                'username': user['username'],
                'email': user['email'],
                'preferred_name': user['preferred_name'],
                'chatbot_name': user['chatbot_name'],
                'theme_preference': user.get('theme_preference', 'light'),  # FIXED: Changed 'dark' to 'light'
                'voice_enabled': user.get('voice_enabled', True)
            }), 200
            
        except Exception as e:
            return jsonify({'error': f'Failed to get profile: {str(e)}'}), 500
    
    @app.route('/api/auth/profile', methods=['PUT'])
    @jwt_required()
    def update_profile():
        try:
            user_id = get_jwt_identity()
            data = request.get_json()
            
            update_data = {}
            if 'preferred_name' in data:
                update_data['preferred_name'] = data['preferred_name']
            if 'chatbot_name' in data:
                update_data['chatbot_name'] = data['chatbot_name']
            if 'theme_preference' in data:
                update_data['theme_preference'] = data['theme_preference']
            if 'voice_enabled' in data:
                update_data['voice_enabled'] = data['voice_enabled']
            
            memory_manager.update_user_preferences(user_id, update_data)
            
            return jsonify({'message': 'Profile updated successfully'}), 200
            
        except Exception as e:
            return jsonify({'error': f'Failed to update profile: {str(e)}'}), 500