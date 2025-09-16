/**
 * Utility functions for Battlefield System
 */

import logger from '../module/utils/Logger.js';

class BattlefieldUtils {
  /**
   * Generates a random ID
   * @returns {string} Random ID
   */
  static generateId() {
    return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
  }

  /**
   * Logs a message based on the current logging level
   * @param {string} level - Log level (ERROR, WARN, INFO, LOG, DEBUG)
   * @param {string} message - Log message
   * @param {*} data - Optional data to log
   */
  static log(level, message, data = null) {
    // Delegate to the Logger class
    switch (level) {
      case 'ERROR':
        logger.error(message, data);
        break;
      case 'WARN':
        logger.warn(message, data);
        break;
      case 'INFO':
        logger.info(message, data);
        break;
      case 'LOG':
        logger.log(message, data);
        break;
      case 'DEBUG':
        logger.debug(message, data);
        break;
    }
  }

  /**
   * Checks if a value is empty
   * @param {*} value - Value to check
   * @returns {boolean} True if value is empty
   */
  static isEmpty(value) {
    return value === null || value === undefined || value === '' || 
           (Array.isArray(value) && value.length === 0) ||
           (typeof value === 'object' && Object.keys(value).length === 0);
  }

  /**
   * Capitalizes the first letter of a string
   * @param {string} str - String to capitalize
   * @returns {string} Capitalized string
   */
  static capitalize(str) {
    if (!str || typeof str !== 'string') return str;
    return str.charAt(0).toUpperCase() + str.slice(1);
  }

  /**
   * Gets a translated string
   * @param {string} key - Translation key
   * @param {object} data - Optional data for interpolation
   * @returns {string} Translated string
   */
  static i18n(key, data = null) {
    return game.i18n.format(`battlefield-system.${key}`, data);
  }

  /**
   * Gets status effect configuration
   * @returns {object} Status effect configuration
   */
  static getStatusEffects() {
    return {
      strength: {
        id: 'strength',
        label: this.i18n('StatusEffects.Strength'),
        icon: 'systems/battlefield-system/icons/strength.svg'
      },
      weakness: {
        id: 'weakness',
        label: this.i18n('StatusEffects.Weakness'),
        icon: 'systems/battlefield-system/icons/weakness.svg'
      },
      speed: {
        id: 'speed',
        label: this.i18n('StatusEffects.Speed'),
        icon: 'systems/battlefield-system/icons/speed.svg'
      },
      slow: {
        id: 'slow',
        label: this.i18n('StatusEffects.Slow'),
        icon: 'systems/battlefield-system/icons/slow.svg'
      },
      defense: {
        id: 'defense',
        label: this.i18n('StatusEffects.Defense'),
        icon: 'systems/battlefield-system/icons/defense.svg'
      },
      vulnerable: {
        id: 'vulnerable',
        label: this.i18n('StatusEffects.Vulnerable'),
        icon: 'systems/battlefield-system/icons/vulnerable.svg'
      },
      attack: {
        id: 'attack',
        label: this.i18n('StatusEffects.Attack'),
        icon: 'systems/battlefield-system/icons/attack.svg'
      },
      stun: {
        id: 'stun',
        label: this.i18n('StatusEffects.Stun'),
        icon: 'systems/battlefield-system/icons/stun.svg'
      }
    };
  }

  /**
   * Creates a debounce function
   * @param {Function} func - Function to debounce
   * @param {number} wait - Wait time in milliseconds
   * @returns {Function} Debounced function
   */
  static debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  }

  /**
   * Creates a throttle function
   * @param {Function} func - Function to throttle
   * @param {number} limit - Time limit in milliseconds
   * @returns {Function} Throttled function
   */
  static throttle(func, limit) {
    let inThrottle;
    return function(...args) {
      const context = this;
      if (!inThrottle) {
        func.apply(context, args);
        inThrottle = true;
        setTimeout(() => inThrottle = false, limit);
      }
    };
  }

  /**
   * Deep clones an object
   * @param {*} obj - Object to clone
   * @returns {*} Cloned object
   */
  static deepClone(obj) {
    if (obj === null || typeof obj !== 'object') return obj;
    if (obj instanceof Date) return new Date(obj.getTime());
    if (obj instanceof Array) return obj.map(item => this.deepClone(item));
    if (typeof obj === 'object') {
      const clonedObj = {};
      for (let key in obj) {
        if (obj.hasOwnProperty(key)) {
          clonedObj[key] = this.deepClone(obj[key]);
        }
      }
      return clonedObj;
    }
    return obj;
  }

  /**
   * Merges two objects
   * @param {object} target - Target object
   * @param {object} source - Source object
   * @returns {object} Merged object
   */
  static mergeObjects(target, source) {
    return foundry.utils.mergeObject(target, source, { recursive: true });
  }

  /**
   * Formats a number with commas
   * @param {number} num - Number to format
   * @returns {string} Formatted number
   */
  static formatNumber(num) {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  }
}

// Export the utility class
export default BattlefieldUtils;