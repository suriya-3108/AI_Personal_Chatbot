// Theme management utilities
const THEME_KEY = 'theme-preference';

export const themes = {
  light: 'light',
  dark: 'dark'
};

export const getStoredTheme = () => {
  return localStorage.getItem(THEME_KEY) || themes.dark;
};

export const setStoredTheme = (theme) => {
  localStorage.setItem(THEME_KEY, theme);
};

export const applyTheme = (theme) => {
  const root = document.documentElement;
  
  if (theme === themes.dark) {
    root.classList.add('dark');
    root.setAttribute('data-theme', 'dark');
  } else {
    root.classList.remove('dark');
    root.setAttribute('data-theme', 'light');
  }
  
  setStoredTheme(theme);
};

export const initializeTheme = () => {
  const storedTheme = getStoredTheme();
  applyTheme(storedTheme);
  return storedTheme;
};

export const toggleTheme = () => {
  const currentTheme = getStoredTheme();
  const newTheme = currentTheme === themes.dark ? themes.light : themes.dark;
  applyTheme(newTheme);
  return newTheme;
};