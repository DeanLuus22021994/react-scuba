import { onCLS, onINP, onFCP, onLCP, onTTFB } from 'web-vitals';

const sendToAnalytics = ({ name, value, id, rating }) => {
  // Log to console in development
  if (import.meta.env.DEV) {
    console.log(`[Web Vitals] ${name}:`, {
      value: Math.round(name === 'CLS' ? value * 1000 : value),
      id,
      rating,
    });
  }

  // Send to Google Analytics if available
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', name, {
      event_category: 'Web Vitals',
      event_label: id,
      value: Math.round(name === 'CLS' ? value * 1000 : value),
      non_interaction: true,
    });
  }

  // Send to custom analytics endpoint
  if (import.meta.env.VITE_ANALYTICS_ENDPOINT) {
    navigator.sendBeacon(
      import.meta.env.VITE_ANALYTICS_ENDPOINT,
      JSON.stringify({
        name,
        value,
        id,
        rating,
        timestamp: Date.now(),
      })
    );
  }
};

export const reportWebVitals = () => {
  try {
    onCLS(sendToAnalytics);
    onINP(sendToAnalytics); // INP replaced FID in web-vitals v3+
    onFCP(sendToAnalytics);
    onLCP(sendToAnalytics);
    onTTFB(sendToAnalytics);
  } catch (error) {
    console.error('[Web Vitals] Error reporting metrics:', error);
  }
};

export default reportWebVitals;
