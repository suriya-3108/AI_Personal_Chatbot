import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { User, Mail, Lock, Bot, Eye, EyeOff, MessageSquare } from "lucide-react";
import { authAPI } from "../api";

const SignUp = ({ theme, onThemeChange, onLogin }) => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    preferredName: "",
    chatbotName: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) navigate("/chat");
  }, [navigate]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const response = await authAPI.signup(formData);
      if (response.data.access_token) {
        localStorage.setItem("token", response.data.access_token);
        localStorage.setItem(
          "user",
          JSON.stringify({
            id: response.data.user_id,
            preferred_name: response.data.preferred_name,
            chatbot_name: response.data.chatbot_name,
          })
        );
        if (onLogin)
          onLogin({
            id: response.data.user_id,
            preferred_name: response.data.preferred_name,
            chatbot_name: response.data.chatbot_name,
          });
        navigate("/chat");
      }
    } catch (error) {
      setError(error.response?.data?.error || "Registration failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const inputClass =
    "w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white/60 dark:bg-gray-900/60 py-3 pl-10 pr-4 text-gray-800 dark:text-gray-200 focus:ring-2 focus:ring-indigo-500 focus:outline-none";

  return (
    <div
      className={`min-h-screen flex items-center justify-center p-6 transition-colors duration-300 ${
        theme === "dark"
          ? "bg-[var(--bg-dark)]"
          : "bg-[var(--bg-light)]"
      }`}
    >
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <div className="mx-auto w-20 h-20 bg-gradient-to-br from-black to-gray-800 dark:from-white dark:to-gray-200 rounded-2xl flex items-center justify-center mb-6 shadow-lg">
            <MessageSquare className="h-10 w-10 text-white dark:text-black" />
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-black to-gray-700 dark:from-white dark:to-gray-300 bg-clip-text text-transparent mb-3">
            Create Account
          </h1>
          <p className="text-gray-600 dark:text-gray-400 text-lg">
            Join your AI Assistant today
          </p>
        </div>

        <div className="professional-card glass-morphism p-8 space-y-6">
          {error && (
            <div
              className={`p-4 rounded-lg text-sm border ${
                theme === "dark"
                  ? "bg-red-950/50 text-red-300 border-red-800"
                  : "bg-red-50 text-red-700 border-red-200"
              }`}
            >
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Username */}
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none" />
              <input
                name="username"
                type="text"
                value={formData.username}
                onChange={handleChange}
                required
                className={inputClass}
                placeholder="Choose a username"
              />
            </div>

            {/* Email */}
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none" />
              <input
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                required
                className={inputClass}
                placeholder="Enter your email"
              />
            </div>

            {/* Preferred Name */}
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none" />
              <input
                name="preferredName"
                type="text"
                value={formData.preferredName}
                onChange={handleChange}
                required
                className={inputClass}
                placeholder="Your preferred name"
              />
            </div>

            {/* Chatbot Name */}
            <div className="relative">
              <Bot className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none" />
              <input
                name="chatbotName"
                type="text"
                value={formData.chatbotName}
                onChange={handleChange}
                required
                className={inputClass}
                placeholder="Name your AI assistant"
              />
            </div>

            {/* Password */}
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none" />
              <input
                name="password"
                type={showPassword ? "text" : "password"}
                value={formData.password}
                onChange={handleChange}
                required
                className="w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white/60 dark:bg-gray-900/60 py-3 pl-10 pr-12 text-gray-800 dark:text-gray-200 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                placeholder="Create a secure password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              >
                {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </button>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="btn-primary w-full py-4 text-lg font-semibold shadow-lg hover:shadow-xl transition-all mt-6"
            >
              {isLoading ? (
                <div className="flex items-center justify-center space-x-2">
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Creating Account...</span>
                </div>
              ) : (
                "Create Account"
              )}
            </button>
          </form>

          <div className="text-center pt-4 border-t border-gray-200 dark:border-gray-700">
            <p className="text-gray-600 dark:text-gray-400">
              Already have an account?{" "}
              <Link
                to="/login"
                className="font-semibold text-black dark:text-white hover:underline transition-colors"
              >
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
