// Web Vitals reporting utilities

import logger from './logger';

/**
 * Web Vitals metric data structure
 */
export interface WebVitalsMetric {
  name: string;
  value: number;
  rating: 'good' | 'needs-improvement' | 'poor';
  delta: number;
  entries: PerformanceEntry[];
  id: string;
}

/**
 * Web Vitals callback function type
 */
export type WebVitalsCallback = (metric: WebVitalsMetric) => void;

/**
 * Report web vitals to console and analytics
 * @param callback - Optional callback for custom handling
 */
export const reportWebVitals = (callback?: WebVitalsCallback): void => {
  if ('web-vitals' in window || typeof window !== 'undefined') {
    // Dynamic import to avoid affecting bundle size for users who don't use it
    import('web-vitals')
      .then(({ onCLS, onFCP, onINP, onLCP, onTTFB }) => {
        const handleMetric = (metric: WebVitalsMetric) => {
          // Log metric to console in development
          if (import.meta.env['MODE'] === 'development') {
            logger.info(`Web Vitals: ${metric.name}`, {
              value: metric.value,
              rating: metric.rating,
              delta: metric.delta,
            });
          }

          // Send to callback if provided
          if (callback) {
            callback(metric);
          }
        };

        // Report all web vitals
        onCLS(handleMetric);
        onFCP(handleMetric);
        onINP(handleMetric);
        onLCP(handleMetric);
        onTTFB(handleMetric);
      })
      .catch((error) => {
        logger.warn('Failed to load web-vitals library', {
          error: error instanceof Error ? error.message : String(error),
        });
      });
  }
};
