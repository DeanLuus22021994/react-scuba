/**
 * Logger utility for consistent logging across the application
 * In production, logs are suppressed or sent to a logging service
 */

const isDevelopment = import.meta.env.MODE === 'development';

const logger = {
  /**
   * Log informational messages (only in development)
   */
  info: (...args) => {
    if (isDevelopment) {
      console.warn('[INFO]', ...args);
    }
  },

  /**
   * Log warning messages
   */
  warn: (...args) => {
    if (isDevelopment) {
      console.warn('[WARN]', ...args);
    }
  },

  /**
   * Log error messages (always logged, can be sent to error tracking service)
   */
  error: (...args) => {
    console.error('[ERROR]', ...args);
    // In production, this could send to error tracking service (e.g., Sentry)
  },

  /**
   * Log debug messages (only in development)
   */
  debug: (...args) => {
    if (isDevelopment) {
      console.warn('[DEBUG]', ...args);
    }
  },
};

export default logger;
