import axios from "axios";

// ✅ Use 127.0.0.1 to avoid CORS mismatch on Windows
const API_BASE_URL = "http://127.0.0.1:5000/api";

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Add token automatically
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Handle token expiration / unauthorized access
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      console.warn("⚠️ Token expired or invalid. Redirecting to login...");
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

// ------------------- AUTH API -------------------
export const authAPI = {
  signup: (userData) => api.post("/auth/signup", userData),
  login: (credentials) => api.post("/auth/login", credentials),
  getProfile: () => api.get("/auth/profile"),
  updateProfile: (data) => api.put("/auth/profile", data),
};

// ------------------- CHAT API -------------------
export const chatAPI = {
  sendMessage: (message) => api.post("/chat", { message }),
  speechToText: (audioFile) => {
    const formData = new FormData();
    formData.append("audio", audioFile);
    return api.post("/chat/speech-to-text", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  },
  textToSpeech: (text) => api.post("/chat/text-to-speech", { text }),
  getHistory: () => api.get("/chat/history"),
  clearHistory: () => api.post("/chat/clear"),
};

// ------------------- HEALTH CHECK -------------------
export const healthCheck = () => api.get("/health");

export default api;
