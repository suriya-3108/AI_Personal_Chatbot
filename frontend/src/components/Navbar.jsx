import React from 'react';
import { LogOut, User, Download, Trash2, MessageSquare, Copy } from 'lucide-react';
import ThemeToggle from './ThemeToggle';

const Navbar = ({ user, chatbotName, theme, onThemeChange, onLogout, onProfileClick, onDownloadChat, onClearChat, onCopyChat, messageCount }) => {
  return (
    <nav className="border-b border-gray-200 dark:border-gray-800 bg-white/60 dark:bg-black/50 backdrop-blur">
      <div className="max-w-5xl mx-auto px-4">
        <div className="flex justify-between items-center h-14">
          {/* Brand */}
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-black dark:bg-white flex items-center justify-center">
              <MessageSquare className="h-6 w-6 text-white dark:text-black" />
            </div>
            <div>
              <h1 className="text-lg font-semibold text-gray-900 dark:text-white">AI Chat</h1>
              {chatbotName && <p className="text-xs text-gray-500 dark:text-gray-400">Chatting with {chatbotName}</p>}
            </div>
          </div>

          {/* Controls */}
          <div className="flex items-center space-x-2">
            <ThemeToggle theme={theme} onThemeChange={onThemeChange} />
            {messageCount > 0 && (
              <>
                <button onClick={onCopyChat} className="icon-btn" title="Copy chat">
                  <Copy className="h-5 w-5" />
                </button>
                <button onClick={onDownloadChat} className="icon-btn" title="Download chat">
                  <Download className="h-5 w-5" />
                </button>
                <button onClick={onClearChat} className="icon-btn hover:text-red-500" title="Clear chat">
                  <Trash2 className="h-5 w-5" />
                </button>
              </>
            )}
            {user && (
              <>
                <button onClick={onProfileClick} className="px-3 py-2 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition">
                  <User className="inline h-5 w-5 mr-1" />
                  <span>{user.preferred_name}</span>
                </button>
                <button onClick={onLogout} className="icon-btn hover:text-red-600" title="Logout">
                  <LogOut className="h-5 w-5" />
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
