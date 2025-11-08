import React from 'react';
import { Moon, Sun } from 'lucide-react';
import { toggleTheme, getStoredTheme } from '../utils/theme';

const ThemeToggle = ({ theme, onThemeChange }) => {
  const handleToggle = () => {
    const newTheme = toggleTheme();
    onThemeChange(newTheme);
  };

  return (
    <button
      onClick={handleToggle}
      className={`
        relative inline-flex h-8 w-14 items-center rounded-full 
        transition-colors duration-300 ease-in-out
        ${theme === 'dark' 
          ? 'bg-gray-700 hover:bg-gray-600' 
          : 'bg-gray-300 hover:bg-gray-400'
        }
        focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
      `}
      aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
    >
      <span
        className={`
          inline-block h-6 w-6 transform rounded-full bg-white shadow-lg 
          transition-transform duration-300 ease-in-out
          flex items-center justify-center
          ${theme === 'dark' ? 'translate-x-7' : 'translate-x-1'}
        `}
      >
        {theme === 'dark' ? (
          <Moon className="h-4 w-4 text-gray-800" />
        ) : (
          <Sun className="h-4 w-4 text-yellow-500" />
        )}
      </span>
    </button>
  );
};

export default ThemeToggle;