import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';

// Debug log to check if element exists
const container = document.getElementById('root');
console.log('Container element:', container);

if (container) {
  const root = createRoot(container);
  root.render(<App />);
} else {
  console.error('Root element not found! Check your HTML file.');
}
