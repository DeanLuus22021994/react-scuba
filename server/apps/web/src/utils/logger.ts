/**
 * Logger utility for consistent structured logging across the application
 * Outputs JSON format logs with correlation IDs for better debugging
 */

interface LogEntry {
  timestamp: string;
  level: string;
  correlation_id: string;
  message: string;
  module: string;
  [key: string]: unknown;
}

interface Logger {
  info: (message: string, extra?: Record<string, unknown>) => void;
  warn: (message: string, extra?: Record<string, unknown>) => void;
  error: (message: string, extra?: Record<string, unknown>) => void;
  debug: (message: string, extra?: Record<string, unknown>) => void;
  setCorrelationId: (id: string) => void;
  getCorrelationId: () => string;
}

const isDevelopment = import.meta.env['MODE'] === 'development';

// Polyfill for UUID generation (works in all environments)
const generateUUID = () => {
  // Try native crypto.randomUUID first (modern browsers with secure context)
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    try {
      return crypto.randomUUID();
    } catch (_e) {
      // Fall through to polyfill
    }
  }

  // Fallback: RFC4122 version 4 compliant UUID
  /* eslint-disable no-bitwise */
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
  /* eslint-enable no-bitwise */
};

// Generate or retrieve correlation ID
const getCorrelationId = () => {
  // Try to get from session storage, or generate new one
  let correlationId = sessionStorage.getItem('correlationId');
  if (!correlationId) {
    correlationId = generateUUID();
    sessionStorage.setItem('correlationId', correlationId);
  }
  return correlationId;
};

const createLogEntry = (level: string, message: string, extra: Record<string, unknown> = {}): LogEntry => {
  return {
    timestamp: new Date().toISOString(),
    level,
    correlation_id: getCorrelationId(),
    message,
    module: 'react-app',
    ...extra,
  };
};

const logger: Logger = {
  /**
   * Log informational messages
   */
  info: (message: string, extra: Record<string, unknown> = {}) => {
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
  warn: (message: string, extra: Record<string, unknown> = {}) => {
    const logEntry = createLogEntry('WARN', message, extra);
    console.warn(JSON.stringify(logEntry));
  },

  /**
   * Log error messages (always logged)
   */
  error: (message: string, extra: Record<string, unknown> = {}) => {
    const logEntry = createLogEntry('ERROR', message, { ...extra, error: true });
    console.error(JSON.stringify(logEntry));
    // In production, this could send to error tracking service (e.g., Sentry)
  },

  /**
   * Log debug messages (only in development)
   */
  debug: (message: string, extra: Record<string, unknown> = {}) => {
    const logEntry = createLogEntry('DEBUG', message, extra);
    if (isDevelopment) {
      console.warn(JSON.stringify(logEntry));
    }
  },

  /**
   * Set correlation ID for current session
   */
  setCorrelationId: (id: string) => {
    sessionStorage.setItem('correlationId', id);
  },

  /**
   * Get current correlation ID
   */
  getCorrelationId,
};

export default logger;
