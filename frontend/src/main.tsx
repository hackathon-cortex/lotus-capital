import React from 'react';
import ReactDOM from 'react-dom/client';
import { App } from './App';
import './styles/main.css';

// Handle iOS Safari BFCache (back-forward cache) restorations
window.addEventListener('pageshow', (event) => {
  if (event.persisted) {
    // Page was restored from bfcache
    window.dispatchEvent(new Event('resize'));
  }
});

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

