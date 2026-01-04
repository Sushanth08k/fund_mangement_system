const isBrowser = typeof window !== 'undefined' && typeof window.localStorage !== 'undefined';

export const loadFromLocalStorage = (key, defaultValue = null) => {
  if (!isBrowser) return defaultValue;
  try {
    const storedValue = window.localStorage.getItem(key);
    return storedValue !== null ? storedValue : defaultValue;
  } catch (error) {
    console.warn(`Unable to read localStorage key "${key}"`, error);
    return defaultValue;
  }
};

export const saveToLocalStorage = (key, value) => {
  if (!isBrowser) return;
  try {
    window.localStorage.setItem(key, value);
  } catch (error) {
    console.warn(`Unable to save localStorage key "${key}"`, error);
  }
};

export const removeFromLocalStorage = (key) => {
  if (!isBrowser) return;
  try {
    window.localStorage.removeItem(key);
  } catch (error) {
    console.warn(`Unable to remove localStorage key "${key}"`, error);
  }
};
