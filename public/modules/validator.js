'use strict';

const DEFAULT_ALLOWED_SYMBOLS = `~!?@#$%^&*_-+()[]{}></|"'.,:;`;

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
    const emailRegExp = /.+@.+\..+$/g;
    const res = str.match(emailRegExp) || [];
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
   * @param {boolean} [ignoreCase=false] Ignores case while comparing.
   * @returns {boolean} True if substring is in string, false otherwise.
   */
  contains(str, substr, ignoreCase = false) {
    if (ignoreCase) {
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
    const res = sym.match(/^[a-zA-Z0-9]$/) || [];
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
    const res = sym.match(/^[0-9]$/) || [];
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
    const res = sym.match(/^[A-Z]$/) || [];
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
   * Check if the password is valid.
   *
   * @param {string} password A string with the given password.
   * @param {number} [minLength=8] Minimal legth of a password, default 8.
   * @param {number} [maxLength=128] Maximal legth of a password, default 128.
   * @param {boolean} [includeUpperCase=true] Check for upper case letters, default true.
   * @param {boolean} [includeDigits=true] Check for digits, default true.
   * @param {string} [includeSpecialSymbols=DEFAULT_ALLOWED_SYMBOLS] String of remaining allowed symbols, default DEFAULT_ALLOWED_SYMBOLS.
   * @returns {boolean} True if the password is valid, false otherwise.
   */
  checkPassword({
    password,
    minLength = 8,
    maxLength = 128,
    includeUpperCase = true,
    includeDigits = true,
    includeSpecialSymbols = DEFAULT_ALLOWED_SYMBOLS,
  }) {
    const isLengthValid =
      this.checkMinLength(password, minLength) &&
      this.checkMaxLength(password, maxLength);

    const hasUpperCase = includeUpperCase
      ? password.split('').some((sym) => this.isUpperCase(sym))
      : true;

    const hasDigits = includeDigits
      ? password.split('').some((sym) => this.isDigit(sym))
      : true;

    const hasSpecialSymbols = password
      .split('')
      .some((sym) => this.contains(includeSpecialSymbols, sym));

    const areSymbolsValid = password
      .split('')
      .every((sym) => this.checkPasswordSymbol(sym, includeSpecialSymbols));

    return (
      isLengthValid &&
      hasUpperCase &&
      hasDigits &&
      hasSpecialSymbols &&
      areSymbolsValid
    );
  }

  validateField(data, errorMessage) {
    if (!data || !data.trim() === '') {
      return errorMessage;
    }
  }

  /**
   * Check if registration form is valid. Returns object with errors if any.
   * Throws error if there are no required fields in `data`.
   *
   * @param {object} data Object with all the input data from registration form.
   * Must contain following fields: `email`, `password`, `repeat_password`.
   * @returns {object} Object of errors.
   * @throws Will throw an error if there are no required fields in `data`.
   */
  validateRegistrationForm(data) {
    if (!('email' in data) || !('password' in data) || !('repeat_password' in data)) {
      throw new Error("data doesn't contain required fields");
    }

    let errors = {};

    for (let key in data) {
      errors[key] = this.validateField(
        data[key],
        'Обязательное поле для заполнения',
      );
    }

    // Email
    if (!errors.email && !this.isEmail(data.email.trim())) {
      errors.email = 'Некорректная электронная почта';
    }

    // Password
    if (!errors.password && !this.checkPassword({ password: data.password })) {
      errors.password =
        'Пароль должен быть от 8 до 128 символов, иметь заглавные буквы, цифры и прочие символы';
    }

    // Repeat password
    if (
      !errors.password &&
      !errors.repeat_password &&
      !this.equals(data.password, data.repeat_password)
    ) {
      errors.password = 'Пароли не совпадают';
      errors.repeat_password = 'Пароли не совпадают';
    }

    return errors;
  }

  /**
   * Check if authorization form is valid. Returns object with errors if any.
   * Throws error if there are no required fields in `data`.
   *
   * @param {object} data Object with all the input data from registration form.
   * Must contain following fields: `email`, `password`.
   * @returns {object} Object of errors.
   * @throws Will throw an error if there are no required fields in `data`.
   */
  validateAuthForm(data) {
    if (!('email' in data) || !('password' in data)) {
      throw new Error("data doesn't contain required fields");
    }

    let errors = {};

    for (let key in data) {
      errors[key] = this.validateField(
        data[key],
        'Обязательное поле для заполнения',
      );
    }

    // Email
    if (!errors.email && !this.isEmail(data.email.trim())) {
      errors.email = 'Некорректная электронная почта';
    }

    return errors;
  }
}

const validator = new Validator();
export default validator;
