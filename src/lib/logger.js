/**
 * Production-ready logging utility with debug/production modes.
 * Similar to Python's logging levels.
 */

import { isDevelopment } from './config.js';

// Log levels (similar to Python logging)
const LOG_LEVELS = {
  DEBUG: 0,
  INFO: 1,
  WARN: 2,
  ERROR: 3,
  NONE: 4
};

// Current log level based on environment
const CURRENT_LOG_LEVEL = isDevelopment ? LOG_LEVELS.DEBUG : LOG_LEVELS.ERROR;

// Log the current environment and log level (only in development)
if (isDevelopment) {
  console.log(`🔧 Logger initialized: Environment=${isDevelopment ? 'development' : 'production'}, LogLevel=${Object.keys(LOG_LEVELS)[CURRENT_LOG_LEVEL]}`);
}

/**
 * Logger class with different log levels
 */
class Logger {
  constructor(name = 'App') {
    this.name = name;
  }

  /**
   * Format log message with timestamp and logger name
   */
  _formatMessage(level, message, ...args) {
    const timestamp = new Date().toISOString();
    const prefix = `[${timestamp}] [${this.name}] [${level}]`;
    return [prefix, message, ...args];
  }

  /**
   * Log debug messages (only in development)
   */
  debug(message, ...args) {
    if (CURRENT_LOG_LEVEL <= LOG_LEVELS.DEBUG) {
      console.log(...this._formatMessage('DEBUG', message, ...args));
    }
  }

  /**
   * Log info messages (only in development)
   */
  info(message, ...args) {
    if (CURRENT_LOG_LEVEL <= LOG_LEVELS.INFO) {
      console.info(...this._formatMessage('INFO', message, ...args));
    }
  }

  /**
   * Log warning messages (development and production)
   */
  warn(message, ...args) {
    if (CURRENT_LOG_LEVEL <= LOG_LEVELS.WARN) {
      console.warn(...this._formatMessage('WARN', message, ...args));
    }
  }

  /**
   * Log error messages (always logged)
   */
  error(message, ...args) {
    if (CURRENT_LOG_LEVEL <= LOG_LEVELS.ERROR) {
      console.error(...this._formatMessage('ERROR', message, ...args));
    }
  }

  /**
   * Log with emoji for better visual distinction (development only)
   */
  emoji(emoji, message, ...args) {
    if (CURRENT_LOG_LEVEL <= LOG_LEVELS.DEBUG) {
      console.log(...this._formatMessage('DEBUG', `${emoji} ${message}`, ...args));
    }
  }
}

/**
 * Create a logger instance for a specific module
 */
export function createLogger(name) {
  return new Logger(name);
}

/**
 * Default logger instance
 */
export const logger = new Logger('Elys');

/**
 * Check if we're in debug mode
 */
export const isDebugMode = () => CURRENT_LOG_LEVEL <= LOG_LEVELS.DEBUG;

/**
 * Conditional logging - only logs in development
 */
export const debugLog = (message, ...args) => {
  if (isDebugMode()) {
    console.log(message, ...args);
  }
};

export default logger;