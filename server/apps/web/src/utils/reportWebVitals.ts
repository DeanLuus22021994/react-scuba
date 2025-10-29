// Report Web Vitals to Google Analytics

import { trackConversion } from './analytics';
import logger from './logger';
import type { WebVitalsMetric } from './webVitals';

/**
 * Report Web Vitals metrics to Google Analytics 4
 */
export const reportWebVitalsToGA4 = (): void => {
  // Dynamic import to avoid affecting bundle size
  import('web-vitals')
    .then(({ onCLS, onFCP, onINP, onLCP, onTTFB }) => {
      const sendToGA = (metric: WebVitalsMetric) => {
        // Send to GA4 via gtag
        const gtag = (window as any)['gtag'];
        if (typeof gtag === 'function') {
          gtag('event', metric.name, {
            event_category: 'Web Vitals',
            event_label: metric.id,
            value: Math.round(metric.name === 'CLS' ? metric.value * 1000 : metric.value),
            custom_map: { metric_rating: metric.rating },
          });
        }

        // Also track as conversion for important metrics
        if (['LCP', 'CLS', 'FCP'].includes(metric.name) && metric.rating === 'good') {
          trackConversion('web_vitals_good', {
            currency: 'USD',
            value: metric.value,
          });
        }

        logger.info(`Web Vitals: ${metric.name}`, {
          value: metric.value,
          rating: metric.rating,
          id: metric.id,
        });
      };

      // Report all web vitals to GA4
      onCLS(sendToGA);
      onFCP(sendToGA);
      onINP(sendToGA);
      onLCP(sendToGA);
      onTTFB(sendToGA);
    })
    .catch((error) => {
      logger.error('Failed to load web-vitals for GA4 reporting', {
        error: error instanceof Error ? error.message : String(error),
      });
    });
};

/**
 * Default export for React's reportWebVitals pattern
 * Accepts optional callback function for custom Web Vitals reporting
 */
const reportWebVitals = (onPerfEntry?: (metric: any) => void) => {
  if (onPerfEntry && typeof onPerfEntry === 'function') {
    // Use GA4 reporting with custom callback
    import('web-vitals')
      .then(({ onCLS, onFCP, onINP, onLCP, onTTFB }) => {
        const sendToCallback = (metric: any) => {
          onPerfEntry(metric);
        };
        onCLS(sendToCallback);
        onFCP(sendToCallback);
        onINP(sendToCallback);
        onLCP(sendToCallback);
        onTTFB(sendToCallback);
      })
      .catch((error) => {
        logger.error('Failed to load web-vitals for callback reporting', {
          error: error instanceof Error ? error.message : String(error),
        });
      });
  } else {
    // Use default GA4 reporting
    reportWebVitalsToGA4();
  }
};

export default reportWebVitals;
