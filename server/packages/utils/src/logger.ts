/**
 * Logging utilities for React Scuba
 * @packageDocumentation
 */

export type LogLevel = 'debug' | 'info' | 'warn' | 'error';

export interface LogEntry {
  level: LogLevel;
  message: string;
  timestamp: string;
  context?: Record<string, unknown>;
  error?: Error;
}

/**
 * Simple logger with structured output
 */
export class Logger {
  private context: Record<string, unknown>;

  constructor(private name: string, defaultContext: Record<string, unknown> = {}) {
    this.context = defaultContext;
  }

  /**
   * Create child logger with additional context
   */
  child(name: string, additionalContext: Record<string, unknown> = {}): Logger {
    return new Logger(
      `${this.name}:${name}`,
      { ...this.context, ...additionalContext }
    );
  }

  /**
   * Add persistent context to all log entries
   */
  setContext(context: Record<string, unknown>): void {
    this.context = { ...this.context, ...context };
  }

  /**
   * Log debug message
   */
  debug(message: string, context?: Record<string, unknown>): void {
    this.log('debug', message, context);
  }

  /**
   * Log info message
   */
  info(message: string, context?: Record<string, unknown>): void {
    this.log('info', message, context);
  }

  /**
   * Log warning message
   */
  warn(message: string, context?: Record<string, unknown>): void {
    this.log('warn', message, context);
  }

  /**
   * Log error message
   */
  error(message: string, error?: Error, context?: Record<string, unknown>): void {
    this.log('error', message, context, error);
  }

  /**
   * Core logging method
   */
  private log(
    level: LogLevel,
    message: string,
    context?: Record<string, unknown>,
    error?: Error
  ): void {
    const entry: LogEntry = {
      level,
      message: `[${this.name}] ${message}`,
      timestamp: new Date().toISOString(),
      context: { ...this.context, ...context },
      ...(error && { error }),
    };

    if (process.env['NODE_ENV'] === 'development') {
      this.consoleLog(entry);
    } else {
      this.structuredLog(entry);
    }
  }

  /**
   * Pretty console logging for development
   */
  private consoleLog(entry: LogEntry): void {
    const { level, message, context, error } = entry;

    const colors = {
      debug: '\x1b[36m', // Cyan
      info: '\x1b[32m',  // Green
      warn: '\x1b[33m',  // Yellow
      error: '\x1b[31m', // Red
    };

    const reset = '\x1b[0m';
    const color = colors[level];

    console[level === 'debug' ? 'log' : level](
      `${color}${level.toUpperCase()}${reset} ${message}`
    );

    if (context && Object.keys(context).length > 0) {
      console.log('  Context:', context);
    }

    if (error) {
      console.error('  Error:', error);
    }
  }

  /**
   * Structured JSON logging for production
   */
  private structuredLog(entry: LogEntry): void {
    const output = {
      ...entry,
      error: entry.error ? {
        name: entry.error.name,
        message: entry.error.message,
        stack: entry.error.stack,
      } : undefined,
    };

    console.log(JSON.stringify(output));
  }
}

/**
 * Create logger instance
 */
export function createLogger(name: string, context?: Record<string, unknown>): Logger {
  return new Logger(name, context);
}

/**
 * Default application logger
 */
export const logger = createLogger('react-scuba');
