/**
 * Logger utility for consistent structured logging across the application
 * Outputs JSON format logs with correlation IDs for better debugging
 */

const isDevelopment = import.meta.env.MODE === 'development';

// Generate or retrieve correlation ID
const getCorrelationId = () => {
  // Try to get from session storage, or generate new one
  let correlationId = sessionStorage.getItem('correlationId');
  if (!correlationId) {
    correlationId = crypto.randomUUID();
    sessionStorage.setItem('correlationId', correlationId);
  }
  return correlationId;
};

const createLogEntry = (level, message, extra = {}) => {
  return {
    timestamp: new Date().toISOString(),
    level,
    correlation_id: getCorrelationId(),
    message,
    module: 'react-app',
    ...extra,
  };
};

const logger = {
  /**
   * Log informational messages
   */
  info: (message, extra = {}) => {
    const logEntry = createLogEntry('INFO', message, extra);
    if (isDevelopment) {
      console.warn(JSON.stringify(logEntry));
    } else {
      // In production, could send to logging service
      console.warn(JSON.stringify(logEntry));
    }
  },

  /**
   * Log warning messages
   */
  warn: (message, extra = {}) => {
    const logEntry = createLogEntry('WARN', message, extra);
    console.warn(JSON.stringify(logEntry));
  },

  /**
   * Log error messages (always logged)
   */
  error: (message, extra = {}) => {
    const logEntry = createLogEntry('ERROR', message, { ...extra, error: true });
    console.error(JSON.stringify(logEntry));
    // In production, this could send to error tracking service (e.g., Sentry)
  },

  /**
   * Log debug messages (only in development)
   */
  debug: (message, extra = {}) => {
    const logEntry = createLogEntry('DEBUG', message, extra);
    if (isDevelopment) {
      console.warn(JSON.stringify(logEntry));
    }
  },

  /**
   * Set correlation ID for current session
   */
  setCorrelationId: (id) => {
    sessionStorage.setItem('correlationId', id);
  },

  /**
   * Get current correlation ID
   */
  getCorrelationId,
};

export default logger;
