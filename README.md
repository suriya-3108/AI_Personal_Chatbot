
## 📖 README.md

```markdown
# 🤖 Personal AI Assistant

A full-stack personal AI assistant built with React frontend and Flask backend, featuring voice capabilities, dark/light mode, PDF export, and personalized conversations using Google's Gemini AI.

![AI Assistant Demo](https://img.shields.io/badge/AI-Assistant-blue)
![React](https://img.shields.io/badge/React-18.2-blue)
![Flask](https://img.shields.io/badge/Flask-2.3-green)
![MongoDB](https://img.shields.io/badge/MongoDB-Database-green)

## ✨ Features

### 🎯 Core Features
- **🤖 AI-Powered Conversations** - Powered by Google Gemini API
- **🎙️ Voice Input/Output** - Speech-to-text and text-to-speech capabilities
- **🌙 Dark/Light Mode** - Toggle between themes with persistent preferences
- **📄 PDF Export** - Download entire conversations as formatted PDFs
- **🔐 User Authentication** - Secure signup/login with JWT tokens
- 💾 **Conversation Memory** - MongoDB storage for chat history and preferences

### 🚀 Advanced Features
- **🔍 Knowledge Search** - Web search integration for detailed explanations
- **👤 Personalization** - Custom AI names and user preferences
- **📱 Responsive Design** - Works seamlessly on desktop and mobile
- **🎨 Modern UI** - Clean, intuitive interface with smooth animations
- **⚡ Real-time Actions** - Weather, reminders, and website commands

## 🛠️ Tech Stack

### Frontend
- **React 18** - UI framework
- **TailwindCSS** - Styling and theming
- **Vite** - Build tool and dev server
- **Lucide React** - Beautiful icons
- **jsPDF** - PDF generation
- **Axios** - HTTP client

### Backend
- **Flask** - Python web framework
- **Google Gemini AI** - AI conversation engine
- **MongoDB** - Database for users and conversations
- **JWT** - Authentication tokens
- **PyTTsx3** - Text-to-speech
- **SpeechRecognition** - Speech-to-text

## 🚀 Quick Start

### Prerequisites
- Node.js 16+ 
- Python 3.8+
- MongoDB (local or Atlas)
- Google Gemini API key

### 1. Clone the Repository
```bash
git clone <repository-url>
cd personal_ai_assistant
```

### 2. Backend Setup
```bash
# Navigate to backend
cd backend

# Create virtual environment
python -m venv venv

# Activate virtual environment
# On Windows:
venv\Scripts\activate
# On macOS/Linux:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Set up environment variables
cp .env.example .env
# Edit .env with your API keys
```

#### Environment Variables (.env)
```env
# MongoDB Configuration
MONGO_URI=mongodb://localhost:27017/ai_assistant

# Gemini API Configuration
GEMINI_API_KEY=your_actual_gemini_api_key_here

# Optional: Web Search API
SERPAPI_KEY=your_serpapi_key_here

# JWT Configuration
JWT_SECRET_KEY=your-super-secret-jwt-key-change-in-production
SECRET_KEY=your-flask-secret-key-change-in-production
```

#### Start Backend Server
```bash
python app.py
```
Backend runs on `http://localhost:5000`

### 3. Frontend Setup
```bash
# Open new terminal and navigate to frontend
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev
```
Frontend runs on `http://localhost:3000`

### 4. Access the Application
Open your browser and navigate to `http://localhost:3000`

## 📁 Project Structure

```
personal_ai_assistant/
├── backend/
│   ├── app.py                 # Main Flask application
│   ├── auth.py               # Authentication routes & logic
│   ├── ai_engine.py          # Gemini AI integration
│   ├── speech_module.py      # Voice input/output handling
│   ├── memory.py             # MongoDB operations
│   ├── search_module.py      # Web search functionality
│   ├── actions.py            # Real-world action handlers
│   ├── config.py             # Configuration settings
│   ├── requirements.txt      # Python dependencies
│   └── .env                  # Environment variables
├── frontend/
│   ├── package.json          # Node.js dependencies
│   ├── vite.config.js        # Vite configuration
│   ├── public/index.html     # HTML template
│   └── src/
│       ├── components/       # React components
│       │   ├── ChatWindow.jsx
│       │   ├── Message.jsx
│       │   ├── VoiceButton.jsx
│       │   ├── Navbar.jsx
│       │   └── ThemeToggle.jsx
│       ├── pages/           # Page components
│       │   ├── Login.jsx
│       │   ├── SignUp.jsx
│       │   └── Profile.jsx
│       ├── utils/           # Utility functions
│       │   ├── download.js  # PDF export & copy features
│       │   └── theme.js     # Theme management
│       ├── api.js           # API client configuration
│       ├── App.jsx          # Main App component
│       ├── main.jsx         # React entry point
│       ├── index.css        # Global styles
│       └── tailwind.config.js
└── README.md
```

## 🎨 Theming System

The application features a comprehensive theming system with:

### Color Scheme
- **White**: Primary background (light mode)
- **Black**: Primary text and dark mode background
- **Light Grey**: Secondary elements and borders

### Theme Features
- 🌙 **Dark Mode**: Easy on eyes, reduces eye strain
- ☀️ **Light Mode**: Clean and professional
- 💾 **Persistent**: Preferences saved per user
- ⚡ **Smooth Transitions**: Animated theme switching

## 🗣️ Voice Features

### Speech-to-Text (STT)
- 🎤 Click microphone button to start recording
- 🛑 Click again or wait to stop
- 🔄 Automatic conversion to text
- 🌐 Supports multiple browsers

### Text-to-Speech (TTS)
- 🔊 AI responses can be read aloud
- ⚙️ Configurable in user profile
- 🎵 Natural sounding speech synthesis

## 📊 PDF Export Features

### Chat Export Options
- **📄 PDF Download**: Formatted conversation with timestamps
- **📋 Copy Text**: Quick copy of individual messages
- **💾 Full History**: Entire conversation export

### PDF Features
- 🎨 Theme-appropriate styling
- 👤 Personalized headers
- 📱 Responsive formatting
- 🔗 Clickable links preserved

## 🔐 Authentication System

### User Registration
- Unique username and email
- Secure password hashing
- Custom AI assistant name
- Personal preferred name

### Session Management
- JWT token-based authentication
- Automatic token refresh
- Secure logout from all devices
- Session persistence

## 🤖 AI Capabilities

### Conversation Features
- 📝 Context-aware responses
- 🔍 Web search integration
- 🎯 Personalized addressing
- 💭 Memory of past conversations

### Supported Commands
- `"Explain [topic]"` - Detailed explanations with web search
- `"What is [concept]"` - Conceptual explanations
- `"Weather in [city]"` - Weather information
- `"Remind me to [task]"` - Reminder setting
- `"Open [website]"` - Website navigation

## 🛠️ API Endpoints

### Authentication
- `POST /api/auth/signup` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/profile` - Get user profile
- `PUT /api/auth/profile` - Update user preferences

### Chat
- `POST /api/chat` - Send message to AI
- `POST /api/chat/speech-to-text` - Convert audio to text
- `POST /api/chat/text-to-speech` - Convert text to audio
- `GET /api/chat/history` - Get conversation history
- `POST /api/chat/clear` - Clear conversation history

## 🔧 Configuration

### Getting API Keys

#### Google Gemini API
1. Visit [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Create a new API key
3. Add to backend `.env` file as `GEMINI_API_KEY`

#### MongoDB
- **Local**: Install MongoDB Community Edition
- **Cloud**: Use [MongoDB Atlas](https://www.mongodb.com/atlas)

#### Optional: SerpAPI (for web search)
1. Sign up at [SerpAPI](https://serpapi.com)
2. Get your API key
3. Add to backend `.env` as `SERPAPI_KEY`

## 🐛 Troubleshooting

### Common Issues

#### Backend Won't Start
- Check Python version (3.8+ required)
- Verify virtual environment is activated
- Ensure all dependencies are installed
- Check MongoDB connection

#### Frontend Connection Issues
- Ensure backend is running on port 5000
- Check CORS configuration
- Verify API endpoints in `src/api.js`

#### Voice Features Not Working
- Allow microphone permissions in browser
- Use HTTPS in production (required for microphone)
- Check browser compatibility (Chrome, Firefox, Edge)

#### PDF Export Issues
- Ensure jsPDF is properly installed
- Check browser compatibility
- Verify user permissions for file downloads

## 🚀 Deployment

### Backend Deployment (PythonAnywhere, Heroku, Railway)
1. Set environment variables in production
2. Configure MongoDB connection string
3. Set `debug=False` in production
4. Use Gunicorn for production server

### Frontend Deployment (Vercel, Netlify, Railway)
1. Build the project: `npm run build`
2. Deploy the `dist` folder
3. Configure environment variables
4. Set up proxy for API calls

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'Add amazing feature'`
4. Push to branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Google Gemini AI](https://deepmind.google/technologies/gemini/) for powerful AI capabilities
- [React](https://reactjs.org) and [Vite](https://vitejs.dev) for excellent frontend tooling
- [Flask](https://flask.palletsprojects.com/) for lightweight backend framework
- [TailwindCSS](https://tailwindcss.com) for utility-first CSS framework
- [Lucide](https://lucide.dev) for beautiful icons

---

## 📞 Support

If you encounter any issues or have questions:

1. Check the [Troubleshooting](#-troubleshooting) section
2. Search existing [GitHub Issues](https://github.com/your-repo/issues)
3. Create a new issue with detailed description

## 🎯 Roadmap

- [ ] Mobile app (React Native)
- [ ] Group conversations
- [ ] File upload and analysis
- [ ] Multi-language support
- [ ] Plugin system for extended capabilities
- [ ] Voice cloning for personalized TTS

---

**Built with ❤️ using modern web technologies**
```

This comprehensive README.md includes:

- **Project overview** and features
- **Complete setup instructions** for both backend and frontend
- **Detailed project structure**
- **Feature explanations** for all major components
- **API documentation**
- **Troubleshooting guide**
- **Deployment instructions**
- **Contributing guidelines**
- **Future roadmap**

The README provides everything needed to understand, set up, and work with the Personal AI Assistant project!"# AI_Personal_Chatbot" 
