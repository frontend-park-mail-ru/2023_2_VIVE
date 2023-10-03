'use strict';

/**
 * Returns object with default options combined with user's.
 *
 * @param {object} options Object with user's options.
 * @param {object} defaults Object with default options.
 * @returns {object} New object with combined options.
 */
const setDefaults = (options, defaults) => {
  return { ...defaults, ...options };
};

const DEFAULT_ALLOWED_SYMBOLS = `~!?@#$%^&*_-+()[]{}></\|"'.,:;`;

/**
 * Class that validates input data on frontend level.
 *
 * @class
 */
class Validator {
  /**
   * Check if given string is valid.
   *
   * @param {string} str A string with expected email.
   * @returns {boolean} True if given string is a valid email, false otherwise.
   */
  isEmail(str) {
    let emailRegExp = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/g;
    let res = str.match(emailRegExp) || [];
    return res.length == 1;
  }

  /**
   * Check if the string matches the comparison.
   *
   * @param {string} str A string to compare.
   * @param {string} comparison A string to compare with.
   * @returns {boolean} True if given string matches string to compare with, false otherwise.
   */
  equals(str, comparison) {
    return str == comparison;
  }

  /**
   * Check if the string contains the substring.
   *
   * @param {string} str A string to check.
   * @param {string} substr A substring to search in str.
   * @param {object} [options] Optional object wich defaults to { `ignoreCase`: false }.
   * `ignoreCase`: Ignores case while comparing, default false.
   * @returns {boolean} True if substring is in string, false otherwise.
   */
  contains(str, substr, options) {
    let defaults = {
      ignoreCase: false,
    };
    options = setDefaults(options, defaults);

    if (options.ignoreCase) {
      str = str.toLocaleLowerCase();
      substr = substr.toLocaleLowerCase();
    }
    return str.includes(substr);
  }

  /**
   * Check for minimal length of a string.
   *
   * @param {string} str String to check.
   * @param {number} minLength Minimal allowed length.
   * @returns {boolean} True if length of a string >= `minLength`, false otherwise.
   */
  checkMinLength(str, minLength) {
    return str.length >= minLength;
  }

  /**
   * Check for maximal length of a string.
   *
   * @param {string} str String to check.
   * @param {number} maxLength Maximal allowed length.
   * @returns {boolean} True if length of a string <= `maxLength`, false otherwise.
   */
  checkMaxLength(str, maxLength) {
    return str.length <= maxLength;
  }

  /**
   * Check if given symbol is alphanumeric.
   *
   * @param {string} sym Symbol to check.
   * @returns {boolean} True if symbol is alpha, false otherwise.
   * @throws Will throw an error if not a single symbol is passed.
   */
  isAlphanumeric(sym) {
    if (sym.length != 1) {
      throw new Error('wrong number of symbols: should be only one');
    }
    let res = sym.match(/^[a-zA-Z0-9]$/) || [];
    return res.length == 1;
  }

  /**
   * Check if given symbol is digit.
   *
   * @param {string} sym Symbol to check.
   * @returns {boolean} True if symbol is digit, false otherwise.
   * @throws Will throw an error if not a single symbol is passed.
   */
  isDigit(sym) {
    if (sym.length != 1) {
      throw new Error('wrong number of symbols: should be only one');
    }
    let res = sym.match(/^[0-9]$/) || [];
    return res.length == 1;
  }

  /**
   * Check if given symbol is upperCase.
   *
   * @param {string} sym Symbol to check.
   * @returns {boolean} True if symbol is upperCase, false otherwise.
   * @throws Will throw an error if not a single symbol is passed.
   */
  isUpperCase(sym) {
    if (sym.length != 1) {
      throw new Error('wrong number of symbols: should be only one');
    }
    let res = sym.match(/^[A-Z]$/) || [];
    return res.length == 1;
  }

  /**
   * Check if password symbol is allowed.
   *
   * @param {string} sym Single symbol of a password.
   * @param {string} otherAlowedSymbols String of other allowed symbols.
   * @returns {boolean} True if password symbol is allowed, false otherwise.
   */
  checkPasswordSymbol(sym, otherAlowedSymbols) {
    let res = true;
    if (!this.isAlphanumeric(sym)) {
      res = false;
    }
    if (res) {
      return true;
    }
    if (this.contains(otherAlowedSymbols, sym)) {
      res = true;
    } else {
      res = false;
    }

    return res;
  }

  /**
   * Returns an object with boolean properties of all the requirements for the password.
   *
   * @param {string} password A string with the given password.
   * @param {number} [minLength=8] Minimal legth of a password, default 8.
   * @param {number} [maxLength=128] Maximal legth of a password, default 128.
   * @param {boolean} [includeUpperCase=true] Check for upper case letters, default true.
   * @param {boolean} [includeDigits=true] Check for digits, default true.
   * @param {string} [includeSpecialSymbols=DEFAULT_ALLOWED_SYMBOLS] String of remaining allowed symbols, default DEFAULT_ALLOWED_SYMBOLS.
   */
  checkPassword(
    password,
    minLength = 8,
    maxLength = 128,
    includeUpperCase = true,
    includeDigits = true,
    includeSpecialSymbols = DEFAULT_ALLOWED_SYMBOLS
  ) {
    let res;

    res = this.checkMinLength(password, minLength);
    res &&= this.checkMaxLength(password, maxLength);

    let containUpperCase = false;
    let containDigits = false;
    let containSpecialSymbols = false;
    for (let sym of password.split('')) {
      res &&= this.checkPasswordSymbol(sym, includeSpecialSymbols);
      if (!containUpperCase) {
        containUpperCase = this.isUpperCase(sym);
      }
      if (!containDigits) {
        containDigits = this.isDigit(sym);
      }
      if (!containSpecialSymbols) {
        containSpecialSymbols = this.contains(includeSpecialSymbols, sym);
      }
    }

    if (includeUpperCase) {
      res &&= containUpperCase;
    }
    if (includeDigits) {
      res &&= containDigits;
    }
    res &&= containSpecialSymbols;

    return res;
  }
}

export default Validator;
