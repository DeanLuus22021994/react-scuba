import { sendWebVitalsToGA4 } from './analytics.js';

const reportWebVitals = (onPerfEntry) => {
  if (onPerfEntry && onPerfEntry instanceof Function) {
    import('web-vitals')
      .then(({ onCLS, onFID, onFCP, onLCP, onTTFB }) => {
        onCLS(onPerfEntry);
        onFID(onPerfEntry);
        onFCP(onPerfEntry);
        onLCP(onPerfEntry);
        onTTFB(onPerfEntry);
      })
      .catch(() => {
        // Silently ignore if web-vitals is not available
      });
  }
};

// Send web vitals to GA4
export const reportWebVitalsToGA4 = () => {
  reportWebVitals(sendWebVitalsToGA4);
};

export default reportWebVitals;
