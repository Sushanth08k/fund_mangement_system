import { createContext, useContext, useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { loadFromLocalStorage, saveToLocalStorage } from '../utils/storage';
import { THEME_STORAGE_KEY } from '../utils/constants';

const ThemeContext = createContext({
  darkMode: false,
  toggleTheme: () => {}
});

function applyThemePreference(isDarkMode) {
  if (isDarkMode) {
    document.body.classList.add('dark-theme');
    document.documentElement.setAttribute('data-theme', 'dark');
  } else {
    document.body.classList.remove('dark-theme');
    document.documentElement.setAttribute('data-theme', 'light');
  }
}

export function ThemeProvider({ children }) {
  const [darkMode, setDarkMode] = useState(() => {
    const savedTheme = loadFromLocalStorage(THEME_STORAGE_KEY);
    return savedTheme !== null ? JSON.parse(savedTheme) : false;
  });

  useEffect(() => {
    applyThemePreference(darkMode);
    saveToLocalStorage(THEME_STORAGE_KEY, JSON.stringify(darkMode));
  }, [darkMode]);

  const toggleTheme = () => {
    setDarkMode((prevMode) => !prevMode);
  };

  const value = {
    darkMode,
    toggleTheme
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
}

ThemeProvider.displayName = 'ThemeProvider';
ThemeProvider.propTypes = {
  children: PropTypes.node.isRequired
};

export function useTheme() {
  return useContext(ThemeContext);
}
