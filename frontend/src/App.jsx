import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { initializeTheme } from "./utils/theme";
import { authAPI, chatAPI } from "./api";
import Navbar from "./components/Navbar";
import ChatWindow from "./components/ChatWindow";
import Login from "./pages/Login";
import SignUp from "./pages/SignUp";
import Profile from "./pages/Profile";
import { downloadChatPDF } from "./utils/download";

function App() {
  const [theme, setTheme] = useState("dark");
  const [user, setUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);

  useEffect(() => {
    const storedTheme = initializeTheme();
    setTheme(storedTheme);
    checkAuthentication();
  }, []);

  // ✅ FIXED authentication check
  const checkAuthentication = async () => {
    console.log("🔍 Checking authentication...");
    const token = localStorage.getItem("token");
    const storedUser = localStorage.getItem("user");

    try {
      if (token && storedUser) {
        console.log("Token found:", token);
        await authAPI.getProfile(); // validate token with backend
        setUser(JSON.parse(storedUser));
        setIsAuthenticated(true);
        loadChatHistory();
        console.log("✅ Auth success");
      } else {
        console.log("No token or user stored");
        setIsAuthenticated(false);
      }
    } catch (error) {
      console.error("❌ Auth check failed:", error);
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      setIsAuthenticated(false);
    } finally {
      console.log("🏁 Done checking auth");
      setIsCheckingAuth(false);
    }
  };

  const loadChatHistory = async () => {
    try {
      const response = await chatAPI.getHistory();
      setMessages(response.data.history || []);
    } catch (error) {
      console.error("Failed to load chat history:", error);
    }
  };

  const handleThemeChange = (newTheme) => setTheme(newTheme);

  const handleLogin = (userData) => {
    console.log("User logged in:", userData);
    setUser(userData);
    setIsAuthenticated(true);
    loadChatHistory();
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    setIsAuthenticated(false);
    setMessages([]);
  };

  const handleSendMessage = async (message) => {
    if (!message.trim()) return;
    const newUserMessage = { role: "user", content: message };
    const updatedMessages = [...messages, newUserMessage];
    setMessages(updatedMessages);
    setIsLoading(true);

    try {
      const response = await chatAPI.sendMessage(message);
      const aiMessage = { role: "assistant", content: response.data.response };
      setMessages([...updatedMessages, aiMessage]);
    } catch (error) {
      console.error("Failed to send message:", error);
      const errorMessage = {
        role: "assistant",
        content: "Sorry, I encountered an error. Please try again.",
      };
      setMessages([...updatedMessages, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

const handleDownloadChat = () => {
  if (!messages || messages.length === 0) {
    alert("No messages to download.");
    return;
  }
  downloadChatPDF(
    messages,
    user?.preferred_name || "User",
    user?.chatbot_name || "AI Assistant",
    theme
  );
};

  const handleCopyChat = async () => {
    if (messages.length === 0) return;
    try {
      const plain = messages.map(m => `${m.role === 'user' ? (user?.preferred_name || 'You') : (user?.chatbot_name || 'AI')}: ${m.content}`).join('\n\n');
      await navigator.clipboard.writeText(plain);
      alert('Chat copied to clipboard.');
    } catch (e) {
      console.error('Copy failed', e);
    }
  };

  const handleClearChat = async () => {
    if (messages.length === 0) return;
    if (window.confirm("Clear chat history? This cannot be undone.")) {
      try {
        await chatAPI.clearHistory();
        setMessages([]);
      } catch (error) {
        console.error("Failed to clear chat history:", error);
        alert("Failed to clear chat history. Please try again.");
      }
    }
  };

  if (isCheckingAuth) {
    return (
      <div
        className={`min-h-screen flex items-center justify-center transition-colors duration-300 ${
          theme === "dark" ? "bg-gray-900" : "bg-gray-50"
        }`}
      >
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p
            className={`transition-colors duration-300 ${
              theme === "dark" ? "text-gray-300" : "text-gray-600"
            }`}
          >
            Loading...
          </p>
        </div>
      </div>
    );
  }

  return (
    <Router>
      <div
        className={`min-h-screen transition-colors duration-300 ${
          theme === "dark" ? "bg-gray-900" : "bg-gray-50"
        }`}
      >
        <Routes>
          {/* Public routes */}
          <Route
            path="/login"
            element={
              isAuthenticated ? (
                <Navigate to="/chat" replace />
              ) : (
                <Login theme={theme} onThemeChange={handleThemeChange} onLogin={handleLogin} />
              )
            }
          />
          <Route
            path="/signup"
            element={
              isAuthenticated ? (
                <Navigate to="/chat" replace />
              ) : (
                <SignUp theme={theme} onThemeChange={handleThemeChange} onLogin={handleLogin} />
              )
            }
          />

          {/* Protected routes */}
          <Route
            path="/chat"
            element={
              isAuthenticated ? (
              <div className="min-h-screen flex flex-col overflow-hidden">
                  <Navbar
                    user={user}
                    chatbotName={user?.chatbot_name}
                    theme={theme}
                    onThemeChange={handleThemeChange}
                    onLogout={handleLogout}
                    onDownloadChat={handleDownloadChat}
                    onClearChat={handleClearChat}
                    onCopyChat={handleCopyChat}
                    messageCount={messages.length}
                  />
                <div className="flex-1 min-h-0">
                    <ChatWindow
                      messages={messages}
                      onSendMessage={handleSendMessage}
                      userName={user?.preferred_name}
                      chatbotName={user?.chatbot_name}
                      theme={theme}
                      isLoading={isLoading}
                    />
                  </div>
                </div>
              ) : (
                <Navigate to="/login" replace />
              )
            }
          />
          <Route
            path="/profile"
            element={
              isAuthenticated ? (
                <Profile theme={theme} onThemeChange={handleThemeChange} />
              ) : (
                <Navigate to="/login" replace />
              )
            }
          />

          {/* Default route */}
          <Route path="/" element={<Navigate to={isAuthenticated ? "/chat" : "/login"} replace />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
