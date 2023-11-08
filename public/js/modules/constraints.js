'use strict';

import validator from './validator.js';

export const FieldType = {
  text: {
    required: {
      check: (data, requiredFlag) => {
        return validator.isEmpty(data)
          ? Constraints.required.check(data, requiredFlag)
          : false;
      },
    },
    email: {
      check: (data, emailFlag) => {
        return Constraints.email.check(data, emailFlag);
      },
    },
    password: {
      check: (data, passwordFlag) => {
        return Constraints.password.check(data, passwordFlag);
      },
    },
    digits: {
      check: (data, digitsFlag) => {
        return Constraints.digits.check(data, digitsFlag);
      },
    },
    nodigits: {
      check: (data, nodigitsFlag) => {
        return Constraints.nodigits.check(data, nodigitsFlag);
      },
    },
    count_words: {
      check: (data, countWordsFlag) => {
        return Constraints.count_words.check(data, countWordsFlag);
      },
    },
    max_len: {
      check: (data, maxLenFlag) => {
        return Constraints.max_len.check(data, maxLenFlag);
      },
    },
    min_len: {
      check: (data, minLenFlag) => {
        return Constraints.min_len.check(data, minLenFlag);
      },
    },
    year: {
      check: (data, yearFlag) => {
        return Constraints.year.check(data, yearFlag);
      },
    },
    regExp: {
      check: (data, regExpFlag) => {
        return Constraints.year.check(data, regExpFlag);
      },
    },
  },

  radio: {
    required: {
      check: (data, requiredFlag) => {
        return Constraints.required.check(data, requiredFlag);
      },
    },
  },

  checkbox: {
    required: {
      check: (data, requiredFlag) => {
        return Constraints.required.check(data, requiredFlag);
      },
    },
  },

  date: {
    required: {
      check: (data, requiredFlag) => {
        return Constraints.required.check(data, requiredFlag);
      },
    },
    date: {
      check: (data, requiredFlag) => {
        return Constraints.date.check(data, requiredFlag);
      },
    },
  },
};

// const preCheck = (fieldType, data) => {};

/**
 * Constraints data for form validation. On default all constraint flags are false.
 * That means that check() function will return true anyway,
 * even if you make your flag false by hand.
 *
 * Exceptions are:
 * - `passwordFlag` is an object with following fields:
 * ```js
 * {
 * minLength: 6,
 * maxLength: 128,
 * includeUpperCase: true,
 * includeDigits: true,
 * }
 * ```
 * - `regExpFlag` is an regular expression string
 */
export const Constraints = {
  // When data is required
  required: {
    check: (data, requiredFlag) => {
      return requiredFlag && data;
    },
    error: () => {
      return 'Это поле обязательно для заполнения';
    },
  },

  // Email constraint
  email: {
    check: (data, emailFlag) => {
      if (!emailFlag) {
        return true;
      }
      const res = data.match(EMAIL_REGEX) || [];
      return res.length == 1;
    },
    error: () => {
      return 'Некорректный email';
    },
  },

  // Password constraint
  password: {
    check: (
      data,
      passwordFlag = {
        minLength: 6,
        maxLength: 128,
        includeUpperCase: true,
        includeDigits: true,
      },
    ) => {
      if (!passwordFlag) {
        return false;
      }

      const isLengthValid =
        validator.checkMinLen(data, minLength) &&
        validator.checkMaxLen(data, maxLength);

      const hasUpperCase = includeUpperCase
        ? data.split('').some((sym) => validator.isUpperCase(sym))
        : true;

      const hasDigits = includeDigits
        ? data.split('').some((sym) => validator.isDigit(sym))
        : true;

      const symbolsAreValid = data
        .split('')
        .every((sym) => validator.checkPasswordSymbol(sym));

      return isLengthValid && hasUpperCase && hasDigits && symbolsAreValid;
    },

    hasDigits(str) {
      return str.split('').some((sym) => validator.isDigit(sym));
    },
    error: () => {
      return 'Пароль должен быть от 6 до 128 символов, иметь заглавные буквы';
    },
  },

  // Constraint on data must containing digits
  digits: {
    check: (data, digitsAllowed) => {
      return digitsAllowed ? validator.hasDigits(data) : true;
    },
    error: () => {
      return 'Это поле должно содержать цифры';
    },
  },

  // Constraint on data containing no digits
  nodigits: {
    check: (data, noDigitsAllowed) => {
      return noDigitsAllowed ? !validator.hasDigits(data) : true;
    },
    error: () => {
      return 'Это поле не должно содержать цифры';
    },
  },

  // Constraint on data containing only digits
  onlydigits: {
    check: (data, onlyDigitsFlag) => {
      return onlyDigitsFlag ? validator.onlyDigits(data) : true;
    },
    error: () => {
      return 'Это поле должно содержать только цифры';
    },
  },

  // Constraint on word's number
  count_words: {
    check: (data, countWordsFlag) => {
      return data.trim() !== '' && countWordsFlag
        ? validator.countWords(data) <= countWordsFlag
        : false;
    },
    error: (wordCount) => {
      return `Максимальное количество слов: ${wordCount}`;
    },
  },

  // Constraint on max length of data
  max_len: {
    check: (data, maxLenFlag) => {
      return maxLenFlag ? data.length <= maxLenFlag : false;
    },
    error: (maxLen) => {
      return `Максимальная длина: ${maxLen}`;
    },
  },

  // Constraint on min length of data
  min_len: {
    check: (data, minLenFlag) => {
      return minLenFlag >= 0 ? data.length >= minLenFlag : false;
    },
    error: (minLen) => {
      return `Минимальная длина: ${minLen}`;
    },
  },

  // Data must be valid date formatting like (dd.mm.yyyy)
  date: {
    check: (data, dateFlag) => {
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
      return validator.isValidDate(day, month, year);
    },
    error: () => {
      return 'Это поле должно содержать дату';
    },
  },

  // Data must be valid year
  year: {
    check: (data, yearFlag) => {
      return yearFlag ? validator.isValidYear(data) : false;
    },
    error: () => {
      return 'Это поле должно содержать корректный год';
    },
  },

  // RegExp constraint on data
  regExp: {
    check: (data, regExpFlag) => {
      return validator.fullMatchRegExp(data, regExpFlag);
    },
    error: () => {
      return 'Неверный формат';
    },
  },
};

export const constraintExists = (fieldTypeName, constraintName) => {
  return (
    constraintName in Constraints && constraintName in FieldType[fieldTypeName]
  );
};

/**
 * Returns object with errors.
 *
 * @param {Array} metaDataArr Array, containing array of metaData objects that
 * must contain fields `name` and constraints names.
 *
 * For example:
 * ```js
 * metaDataArr = [
 *    {
 *      name: "profession",
 *      required: true,
 *    },
 *    {
 *      name: "first_name",
 *      count_words: 1,
 *      digits: false,
 *      required: true,
 *    }
 * ];
 * ```
 * @param {object} dataObj Object containing data from the form field.
 *
 * For example:
 * ```js
 * dataObj = {
 *  profession: "Web-developer",
 *  first_name: "Jhon",
 * };
 * ```
 * @returns {object} Object with errors.
 * @throws Will throw error if in the given metaData there is no field `name`.
 */
export const validateForm = (metaDataArr, dataObj) => {
  const res = {};
  metaDataArr.forEach((metaData) => {
    if (!('name' in metaData)) {
      throw new Error('There is no field `name` in the given `metaData`');
    }
    if (!('type' in metaData)) {
      throw new Error('There is no field `type` in the given `metaData`');
    }
    const fieldType = metaData.type;
    const fieldName = metaData.name;
    const fieldData = dataObj[fieldName];

    for (let field in metaData) {
      if (constraintExists(fieldType, field)) {
        const constraint = metaData[field];
        const errorMsg = validateFormField(
          fieldType,
          field,
          constraint,
          fieldData,
        );
        if (errorMsg !== null) {
          res[fieldName] = errorMsg;
          break;
        }
      }
      // }
    }
  });

  return res;
};

/**
 * Returns error message or null accorging to a given constraint.
 *
 * @param {string} constraint String name of constraint.
 * @param {object} constraintValue Value of a constraint.
 * @param {any} fieldData Data for given .
 * @param {Function} check Function that checks if data is valid.
 * @returns {string} Error message or null.
 * @throws Will throw an error when given the wrong type.
 */
export const validateFormField = (
  fieldType,
  constraint,
  constraintValue,
  fieldData,
) => {
  if (!constraintExists(fieldType, constraint)) {
    throw new Error(`wrong given type: ${constraint}`);
  }

  if (FieldType[fieldType][constraint].check(fieldData, constraintValue)) {
    return null;
  }
  return Constraints[constraint].error(constraintValue);
};
