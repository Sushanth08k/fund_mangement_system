import { useState, useEffect } from 'react';
import { loadFromLocalStorage, saveToLocalStorage } from '../utils/storage';

export function useLocalStorage(key, initialValue) {
  const [value, setValue] = useState(() => {
    const stored = loadFromLocalStorage(key);
    if (stored === null || stored === undefined) {
      return initialValue;
    }
    try {
      return JSON.parse(stored);
    } catch {
      return stored;
    }
  });

  useEffect(() => {
    try {
      saveToLocalStorage(key, JSON.stringify(value));
    } catch {
      saveToLocalStorage(key, value);
    }
  }, [key, value]);

  return [value, setValue];
}
