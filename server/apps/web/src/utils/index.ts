/**
 * Utility functions barrel export
 * Centralized exports for all utility modules
 */

export * from './analytics';
export * from './currency';
export {
  getApiUrl,
  getCalendarApiKey,
  getCalendarEmail,
  getEnvVar,
  isDevelopment,
  isProduction,
  validateEnvVars as validateEnv,
} from './env';
export { default as logger } from './logger';
export * from './scrollToAnchor';
export * from './seo';
export * from './webVitals';
export * from './reportWebVitals';
