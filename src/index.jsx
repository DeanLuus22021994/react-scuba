import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import { ErrorBoundary } from './components/common';
import './index.css';
import { initializeGA4, initializeGTM } from './utils/analytics';
import { validateEnvVars } from './utils/env';
import { reportWebVitalsToGA4 } from './utils/reportWebVitals';

// Validate environment variables
validateEnvVars();

// Initialize GTM and GA4
initializeGTM();
initializeGA4();

const root = createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </React.StrictMode>
);

// Send web vitals to GA4
reportWebVitalsToGA4();
