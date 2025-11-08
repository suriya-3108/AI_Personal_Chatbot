// Profile.jsx - Professional redesign
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Save, ArrowLeft, User, Bot, Palette, Volume2, VolumeX, Settings } from 'lucide-react';
import { authAPI } from '../api';

const Profile = ({ theme, onThemeChange }) => {
  const [profile, setProfile] = useState({
    username: '',
    email: '',
    preferred_name: '',
    chatbot_name: '',
    theme_preference: 'dark',
    voice_enabled: true
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }
    fetchProfile();
  }, [navigate]);

  const fetchProfile = async () => {
    setIsLoading(true);
    try {
      const response = await authAPI.getProfile();
      setProfile(response.data);
    } catch (error) {
      console.error('Failed to fetch profile:', error);
      if (error.response?.status === 401) {
        localStorage.removeItem('token');
        navigate('/login');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (field, value) => {
    setProfile(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSave = async () => {
    setIsSaving(true);
    setMessage('');

    try {
      await authAPI.updateProfile({
        preferred_name: profile.preferred_name,
        chatbot_name: profile.chatbot_name,
        theme_preference: profile.theme_preference,
        voice_enabled: profile.voice_enabled
      });

      if (profile.theme_preference !== theme) {
        onThemeChange(profile.theme_preference);
      }

      setMessage('Profile updated successfully!');
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      setMessage('Failed to update profile. Please try again.');
      console.error('Profile update error:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleBack = () => {
    navigate('/chat');
  };

  if (isLoading) {
    return (
      <div className={`min-h-screen flex items-center justify-center transition-colors duration-300 ${
        theme === 'dark' ? 'bg-[var(--bg-dark)]' : 'bg-[var(--bg-light)]'
      }`}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black dark:border-white mx-auto mb-4"></div>
          <p className={`text-lg ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
            Loading profile...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen transition-colors duration-300 ${
      theme === 'dark' ? 'bg-[var(--bg-dark)]' : 'bg-[var(--bg-light)]'
    }`}>
      <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <button
            onClick={handleBack}
            className="flex items-center space-x-3 px-4 py-3 rounded-xl btn-secondary transition-all duration-200 hover:scale-105"
          >
            <ArrowLeft className="h-5 w-5" />
            <span className="font-medium">Back to Chat</span>
          </button>
          
          <div className="text-center">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-black to-gray-700 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
              Profile Settings
            </h1>
            <p className="text-gray-500 dark:text-gray-400 mt-2">
              Manage your account preferences
            </p>
          </div>
          
          <div className="w-24"></div> {/* Spacer for balance */}
        </div>

        {/* Profile Form */}
        <div className="professional-card glass-morphism p-8 space-y-8">
          {/* Status Message */}
          {message && (
            <div className={`rounded-xl p-4 text-sm font-medium border ${
              message.includes('successfully') 
                ? theme === 'dark' 
                  ? 'bg-green-950/50 text-green-300 border-green-800' 
                  : 'bg-green-50 text-green-700 border-green-200'
                : theme === 'dark'
                  ? 'bg-red-950/50 text-red-300 border-red-800'
                  : 'bg-red-50 text-red-700 border-red-200'
            }`}>
              {message}
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Left Column - Account Information */}
            <div className="space-y-6">
              <div className="flex items-center space-x-3 mb-6">
                <Settings className="h-6 w-6 text-gray-600 dark:text-gray-400" />
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                  Account Information
                </h2>
              </div>

              {/* Read-only fields */}
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold mb-3 text-gray-700 dark:text-gray-300">
                    Username
                  </label>
                  <div className={`px-4 py-3 rounded-xl border ${
                    theme === 'dark' 
                      ? 'bg-gray-900/50 text-gray-300 border-gray-700' 
                      : 'bg-gray-50 text-gray-600 border-gray-200'
                  }`}>
                    {profile.username}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-3 text-gray-700 dark:text-gray-300">
                    Email Address
                  </label>
                  <div className={`px-4 py-3 rounded-xl border ${
                    theme === 'dark' 
                      ? 'bg-gray-900/50 text-gray-300 border-gray-700' 
                      : 'bg-gray-50 text-gray-600 border-gray-200'
                  }`}>
                    {profile.email}
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column - Preferences */}
            <div className="space-y-6">
              <div className="flex items-center space-x-3 mb-6">
                <User className="h-6 w-6 text-gray-600 dark:text-gray-400" />
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                  Personalization
                </h2>
              </div>

              {/* Editable fields */}
              <div className="space-y-5">
                <div>
                  <label className="flex items-center space-x-2 text-sm font-semibold mb-3 text-gray-700 dark:text-gray-300">
                    <User className="h-4 w-4" />
                    <span>Your Preferred Name</span>
                  </label>
                  <input
                    type="text"
                    value={profile.preferred_name}
                    onChange={(e) => handleChange('preferred_name', e.target.value)}
                    className="professional-input bg-white/50 dark:bg-gray-900/50 border-gray-200 dark:border-gray-700"
                    placeholder="What should I call you?"
                  />
                </div>

                <div>
                  <label className="flex items-center space-x-2 text-sm font-semibold mb-3 text-gray-700 dark:text-gray-300">
                    <Bot className="h-4 w-4" />
                    <span>AI Assistant Name</span>
                  </label>
                  <input
                    type="text"
                    value={profile.chatbot_name}
                    onChange={(e) => handleChange('chatbot_name', e.target.value)}
                    className="professional-input bg-white/50 dark:bg-gray-900/50 border-gray-200 dark:border-gray-700"
                    placeholder="Name your AI assistant"
                  />
                </div>

                {/* Theme Preference */}
                <div>
                  <label className="flex items-center space-x-2 text-sm font-semibold mb-3 text-gray-700 dark:text-gray-300">
                    <Palette className="h-4 w-4" />
                    <span>Theme Preference</span>
                  </label>
                  <select
                    value={profile.theme_preference}
                    onChange={(e) => handleChange('theme_preference', e.target.value)}
                    className="professional-input bg-white/50 dark:bg-gray-900/50 border-gray-200 dark:border-gray-700"
                  >
                    <option value="dark">Dark Mode</option>
                    <option value="light">Light Mode</option>
                  </select>
                </div>

                {/* Voice Input */}
                <div>
                  <label className="flex items-center space-x-2 text-sm font-semibold mb-3 text-gray-700 dark:text-gray-300">
                    {profile.voice_enabled ? (
                      <Volume2 className="h-4 w-4" />
                    ) : (
                      <VolumeX className="h-4 w-4" />
                    )}
                    <span>Voice Input</span>
                  </label>
                  <div className="flex space-x-3">
                    <button
                      onClick={() => handleChange('voice_enabled', true)}
                      className={`flex-1 py-3 rounded-xl border transition-all duration-200 font-medium ${
                        profile.voice_enabled
                          ? theme === 'dark'
                            ? 'bg-gray-800 text-white border-gray-600 shadow-inner'
                            : 'bg-gray-900 text-white border-gray-800 shadow-inner'
                          : theme === 'dark'
                            ? 'bg-gray-900/50 text-gray-400 border-gray-700 hover:bg-gray-800'
                            : 'bg-gray-50 text-gray-600 border-gray-200 hover:bg-gray-100'
                      }`}
                    >
                      Enabled
                    </button>
                    <button
                      onClick={() => handleChange('voice_enabled', false)}
                      className={`flex-1 py-3 rounded-xl border transition-all duration-200 font-medium ${
                        !profile.voice_enabled
                          ? theme === 'dark'
                            ? 'bg-gray-800 text-white border-gray-600 shadow-inner'
                            : 'bg-gray-900 text-white border-gray-800 shadow-inner'
                          : theme === 'dark'
                            ? 'bg-gray-900/50 text-gray-400 border-gray-700 hover:bg-gray-800'
                            : 'bg-gray-50 text-gray-600 border-gray-200 hover:bg-gray-100'
                      }`}
                    >
                      Disabled
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Save Button */}
          <div className="flex justify-end pt-6 border-t border-gray-200 dark:border-gray-700">
            <button
              onClick={handleSave}
              disabled={isSaving}
              className="btn-primary flex items-center space-x-3 px-8 py-4 text-lg font-semibold shadow-lg hover:shadow-xl transition-all"
            >
              {isSaving ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Saving...</span>
                </>
              ) : (
                <>
                  <Save className="h-5 w-5" />
                  <span>Save Changes</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;