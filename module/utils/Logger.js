/**
 * Logger utility for Battlefield System
 * Provides logging functionality with different levels
 */

class Logger {
  constructor() {
    this._initialized = false;
    this._loggingLevel = 'LOG';
    this._levels = {
      NONE: 0,
      ERROR: 1,
      WARN: 2,
      INFO: 3,
      LOG: 4,
      DEBUG: 5
    };
  }

  /**
   * Initialize the logger
   */
  initialize() {
    if (!game || !game.settings) return;
    
    this._loggingLevel = game.settings.get(game.system.id, 'loggingLevel');
    this._initialized = true;
    
    // Register a callback for when settings are changed
    game.settings.settings.get(`${game.system.id}.loggingLevel`)?.onChange?.(level => {
      this._loggingLevel = level;
      this.log('INFO', `Logging level changed to ${level}`);
    });
  }

  /**
   * Log a debug message
   * @param {string} message - Message to log
   * @param {*} data - Optional data to include
   */
  debug(message, data = null) {
    this._log('DEBUG', message, data);
  }

  /**
   * Log a log level message
   * @param {string} message - Message to log
   * @param {*} data - Optional data to include
   */
  log(message, data = null) {
    this._log('LOG', message, data);
  }

  /**
   * Log an info level message
   * @param {string} message - Message to log
   * @param {*} data - Optional data to include
   */
  info(message, data = null) {
    this._log('INFO', message, data);
  }

  /**
   * Log a warning message
   * @param {string} message - Message to log
   * @param {*} data - Optional data to include
   */
  warn(message, data = null) {
    this._log('WARN', message, data);
  }

  /**
   * Log an error message
   * @param {string} message - Message to log
   * @param {*} data - Optional data to include
   */
  error(message, data = null) {
    this._log('ERROR', message, data);
  }

  /**
   * Internal logging method
   * @private
   * @param {string} level - Log level
   * @param {string} message - Message to log
   * @param {*} data - Optional data to include
   */
  _log(level, message, data = null) {
    if (!this._initialized) {
      // If not initialized yet, check if game is available
      if (game && game.settings) {
        this.initialize();
      } else {
        // If game is not available, default to log level
        level = 'LOG';
      }
    }
    
    // Check if we should log this message based on the current logging level
    if (this._levels[this._loggingLevel] >= this._levels[level]) {
      const prefix = `Battlefield System | ${level} |`;
      
      switch (level) {
        case 'ERROR':
          if (data) {
            console.error(prefix, message, data);
          } else {
            console.error(prefix, message);
          }
          break;
        case 'WARN':
          if (data) {
            console.warn(prefix, message, data);
          } else {
            console.warn(prefix, message);
          }
          break;
        case 'INFO':
          if (data) {
            console.info(prefix, message, data);
          } else {
            console.info(prefix, message);
          }
          break;
        case 'LOG':
          if (data) {
            console.log(prefix, message, data);
          } else {
            console.log(prefix, message);
          }
          break;
        case 'DEBUG':
          if (data) {
            console.debug(prefix, message, data);
          } else {
            console.debug(prefix, message);
          }
          break;
      }
    }
  }

  /**
   * Get the current logging level
   * @returns {string} Current logging level
   */
  get loggingLevel() {
    return this._loggingLevel;
  }

  /**
   * Check if the logger is initialized
   * @returns {boolean} True if initialized
   */
  get initialized() {
    return this._initialized;
  }
}

// Create a singleton instance
const logger = new Logger();

export default logger;