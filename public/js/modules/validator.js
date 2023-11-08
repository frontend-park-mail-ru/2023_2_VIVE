'use strict';

// import { PreCheckField } from './constraints.js';
// const DEFAULT_ALLOWED_SYMBOLS = `~!?@#$%^&*_-+()[]{}></|"'.,:;`;
const EMAIL_REGEX = /.+@.+\..+$/g;
const WORDS_SEPARATOR_REG_EX = /\s+/;
const ALPHANUMERIC_REGEX = /^[a-zA-Z0-9]$/;
const UPPERCASE_REGEX = /^[A-Z]$/;
const DIGIT_REGEX = /^[0-9]$/g;
const DATE_REGEX = /^\d{1,2}\.\d{1,2}\.\d{4}$/g;

/**
 * Class that validates input data on frontend level.
 *
 * @class
 */
class Validator {
  /**
   *
   * @param {string} data Given data.
   * @returns {boolean} True if data is not empty string.
   */
  preCheckText(data) {
    if (data.trim() === '') {
      return false;
    }
    return true;
  }

  /**
   * Checks if `data` for a required constraint.
   *
   * @param {any} data Given data.
   * @param {boolean} requiredFlag Required field flag.
   * @returns {boolean} True if `required` is true and `data` is given otherwise false.
   */
  checkRequired(data, requiredFlag) {
    return requiredFlag && data;
  }

  /**
   * Check if given string is a valid email.
   *
   * @param {string} data A string with expected email.
   * @param {boolean} emailFlag Email field flag.
   * @returns {boolean} True if given string is a valid email, false otherwise.
   */
  checkEmail(data, emailFlag) {
    const res = data.match(EMAIL_REGEX) || [];
    return res.length == 1;
  }

  /**
   * Check if the password is valid.
   *
   * @param {string} password A string with the given password.
   * @param {object} passwordFlag Password check flag.
   * @returns {boolean} True if the password is valid, false otherwise.
   */
  checkPassword(
    data,
    passwordFlag = {
      minLength: 6,
      maxLength: 128,
      includeUpperCase: true,
      includeDigits: true,
    },
  ) {
    if (!passwordFlag) {
      return false;
    }

    const isLengthValid =
      this.checkMinLen(data, minLength) && this.checkMaxLen(data, maxLength);

    const hasUpperCase = includeUpperCase
      ? data.split('').some((sym) => this.isUpperCase(sym))
      : true;

    const hasDigits = includeDigits
      ? data.split('').some((sym) => this.isDigit(sym))
      : true;

    const symbolsAreValid = data
      .split('')
      .every((sym) => this.checkPasswordSymbol(sym));

    return isLengthValid && hasUpperCase && hasDigits && symbolsAreValid;
  }

  hasDigits(str) {
    return str.split('').some((sym) => this.isDigit(sym));
  }

  /**
   *  Checks for digits in `data`.
   *
   * @param {string} data Given text to check.
   * @param {boolean} digitsAllowed Flag to check for digits.
   * @returns {boolean} Returns true if `digitsAllowed` is true,
   * otherwise if there are some digits in `data` returns false,
   * otherwise false.
   */
  checkDigits(data, digitsAllowed) {
    return digitsAllowed ? this.hasDigits(data) : !this.hasDigits(data);
  }

  /**
   *  Checks if `data` contains no digits.
   *
   * @param {string} data Given text to check.
   * @param {boolean} noDigitsAllowed Flag to check for digits.
   * @returns {boolean} Returns true if `digitsAllowed` is true,
   * otherwise if there are some digits in `data` returns false,
   * otherwise false.
   */
  checkDigits(data, noDigitsAllowed) {
    return noDigitsAllowed ? this.hasDigits(data) : !this.hasDigits(data);
  }

  /**
   * Checks for word number in `data`.
   *
   * @param {string} data Given text to check.
   * @param {number} countWordsFlag Max number of words.
   * @returns {boolean} Returns true if `countWords` > 0 and number of words in `data` is less than `countWords`,
   * false otherwise.
   */
  checkCountWords(data, countWordsFlag) {
    // if (data.trim() === '') {
    //   return false;
    // }
    // return data.trim() !== '';
    return data.trim() !== '' && countWordsFlag
      ? this.countWords(data) <= countWordsFlag
      : false;
  }

  /**
   * Check for maximal length of a `data`.
   *
   * @param {string} data Given text to check.
   * @param {number} maxLenFlag Maximal allowed length.
   * @returns {boolean} True if `maxLen` > 0 length of a string <= `maxLength`, false otherwise.
   */
  checkMaxLen(data, maxLenFlag) {
    return maxLenFlag ? data.length <= maxLenFlag : false;
  }

  /**
   * Check for minimal length of a `data`.
   *
   * @param {string} data Given text to check.
   * @param {number} minLenFlag Minimal allowed length.
   * @returns {boolean} True if `minLen` >= 0 and length of a `data` >= `minLength`, false otherwise.
   */
  checkMinLen(data, minLenFlag) {
    return minLenFlag >= 0 ? data.length >= minLenFlag : false;
  }

  /**
   * Check for if `data` is date.
   *
   * @param {string} data Given text to check.
   * @param {number} dateFlag Flag to check for date.
   * @returns {boolean} True if `date` is true and `data` is valid date, false otherwise.
   */
  checkDate(data, dateFlag) {
    if (!dateFlag) {
      return false;
    }
    const res = data.match(DATE_REGEX) || [];
    const isValid = res.length == 1;
    if (!isValid) {
      return false;
    }

    const tokens = data.split('.');
    const day = tokens[0];
    const month = tokens[1];
    const year = tokens[2];
    return this.isValidDate(day, month, year);
  }

  /**
   * Check for if `data` is year.
   *
   * @param {string} data Given text to check.
   * @param {number} yearFlag Flag to check for year.
   * @returns {boolean} True if `year` is true and `data` is valid date, false otherwise.
   */
  checkYear(data, yearFlag) {
    return yearFlag ? this.isValidYear(data) : false;
  }

  isEmpty(str) {
    return str.trim() === '' ? false : true;
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
    const res = sym.match(ALPHANUMERIC_REGEX) || [];
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
    const res = sym.match(DIGIT_REGEX) || [];
    return res.length == 1;
  }

  /**
   * Checks `day`, `month`, `year`.
   *
   * @param {string} day Day string.
   * @param {string} month Month string..
   * @param {string} year Year string.
   * @returns {boolean} Returns true if date is valid, false otherwise.
   */
  isValidDate(day, month, year) {
    const res = Date.parse(`${year}-${month}-${day}`);
    if (isNaN(res)) {
      return false;
    }
    return true;
  }

  /**
   * Checks `year`.
   *
   * @param {string} year Year string.
   * @returns {boolean} Returns true if `year` is valid, false otherwise.
   */
  isValidYear(year) {
    return Number(year) > 1900 && Number(year) < 2100;
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
    const res = sym.match(UPPERCASE_REGEX) || [];
    return res.length == 1;
  }

  /**
   * Returns number of words in the given line. Word is a sybol collection
   * separated by one ore more spaces.
   *
   * @param {string} line A line to count words into.
   * @returns {int} Number of words in the given line.
   */
  countWords(line) {
    return line.trim().split(WORDS_SEPARATOR_REG_EX).length;
  }

  /**
   * Check if password symbol is allowed.
   *
   * @param {string} sym Single symbol of a password.
   * @param {string} otherAlowedSymbols String of other allowed symbols.
   * @returns {boolean} True if password symbol is allowed, false otherwise.
   */
  checkPasswordSymbol(sym) {
    let res = true;
    if (!this.isAlphanumeric(sym)) {
      return false;
    }
    if (res) {
      return true;
    }

    return res;
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
    if (
      !('email' in data) ||
      !('password' in data) ||
      !('repeat_password' in data)
    ) {
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
    if (!errors.email && !this.checkEmail(data.email.trim())) {
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
    if (!errors.email && !this.checkEmail(data.email.trim())) {
      errors.email = 'Некорректная электронная почта';
    }

    return errors;
  }

  validateField(data, errorMessage) {
    if (!data || !data.trim() === '') {
      return errorMessage;
    }
  }

  // /**
  //  * Returns object with errors.
  //  *
  //  * @param {Array} metaDataArr Array, containing array of metaData objects that
  //  * must contain fields `name` and constraints names.
  //  *
  //  * For example:
  //  * ```js
  //  * metaDataArr = [
  //  *    {
  //  *      name: "profession",
  //  *      required: true,
  //  *    },
  //  *    {
  //  *      name: "first_name",
  //  *      count_words: 1,
  //  *      digits: false,
  //  *      required: true,
  //  *    }
  //  * ];
  //  * ```
  //  * @param {object} dataObj Object containing data from the form field.
  //  *
  //  * For example:
  //  * ```js
  //  * dataObj = {
  //  *  profession: "Web-developer",
  //  *  first_name: "Jhon",
  //  * };
  //  * ```
  //  * @returns {object} Object of errors.
  //  */
  // validateForm(metaDataArr, dataObj) {
  //   for (let metaData in metaDataArr) {
  //     for (let field in metaData) {
  //       if (constraintExists(field)) {
  //         this.validateFormField(
  //           field,
  //           metaData[field],
  //           dataObj[metaData.name],
  //         );
  //       }
  //     }
  //   }
  // }

  // /**
  //  * Returns error message or null accorging to a given constraint.
  //  *
  //  * @param {string} constraint String name of constraint.
  //  * @param {object} constraintValue Value of a constraint.
  //  * @param {any} data Given data.
  //  * @param {Function} check Function that checks if data is valid.
  //  * @returns {string} Error message or null.
  //  * @throws Will throw an error when given the wrong type.
  //  */
  // validateFormField(constraint, constraintValue, data /* , check */) {
  //   if (!constraintExists(constraint)) {
  //     throw new Error(`wrong given type: ${constraint}`);
  //   }
  //   if (Constraints[constraint].check(data, constraintValue)) {
  //     return null;
  //   }
  //   return Constraints[constraint].Error(constraintValue);
  // }
}

const validator = new Validator();
export default validator;
