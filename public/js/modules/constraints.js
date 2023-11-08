'use strict';

import validator from './validator.js';

// Constraints data for form validation
export const Constraints = {
  // When data is required
  required: {
    check: validator.checkRequired,
    // check: (data, required) => {
    //   return required && !data;
    // },
    error: () => {
      return 'Это поле обязательно для заполнения';
    },
  },

  // Email constraint
  email: {
    check: validator.checkEmail,
    error: () => {
      return 'Некорректный email';
    },
  },

  // Password constraint
  password: {
    check: validator.checkPassword,
    error: () => {
      return 'Пароль должен быть от 6 до 128 символов, иметь заглавные буквы';
    },
  },

  // Constraint on data containing digits
  digits: {
    check: validator.checkDigits,
    // check: (data, digits) => {
    //   return digits ? data.split('').some((sym) => this.isDigit(sym)) : true;
    // },
    error: () => {
      return 'Это поле должно содержать цифры';
    },
  },

  // Constraint on word's number
  count_words: {
    check: validator.checkCountWords.bind(validator),
    // check: (data, countWords) => {
    //   return countWords
    //     ? data.trim().split(WORDS_SEPARATOR_REG_EX).length <= countWords
    //     : false;
    // },
    error: (wordCount) => {
      return `Максимальное количество слов: ${wordCount}`;
    },
  },

  // Constraint on max length of data
  max_len: {
    check: validator.checkMaxLen,
    // check: (data, maxLen) => {
    //   return maxLen ? data.length <= maxLen : false;
    // },
    error: (maxLen) => {
      return `Максимальная длина: ${maxLen}`;
    },
  },

  // Constraint on min length of data
  min_len: {
    check: validator.checkMinLen,
    // check: (data, minLen) => {
    //   return minLen >= 0 ? data.length >= minLen : false;
    // },
    error: (minLen) => {
      return `Минимальная длина: ${minLen}`;
    },
  },

  // Data must be valid date formatting like (dd.mm.yyyy)
  date: {
    check: validator.checkDate,
    // check: (data, date) => {
    //   if (!date) {
    //     return false;
    //   }
    //   res = data.match(DATE_REGEX) || [];
    //   isValid = res.length == 1;
    //   if (!isValid) {
    //     return false;
    //   }

    //   tokens = data.split('.');
    //   day = tokens[0];
    //   month = tokens[1];
    //   year = tokens[2];

    //   res = Date.parse(`${year}-${month}-${day}`);
    //   if (isNaN(res)) {
    //     return false;
    //   }
    //   return true;
    //   // return this.isValidDate(day, month, year);
    // },
    error: () => {
      return 'Это поле должно содержать дату';
    },
  },

  // Data must be valid year
  year: {
    check: validator.checkYear,
    // check: (data, year) => {
    //   return year ? Number(data) > 1900 && Number(data) < 2100 : false;
    // },
    error: () => {
      return 'Это поле должно содержать корректный год';
    },
  },
};

export const constraintExists = (constraintName) => {
  return constraintName in Constraints;
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
 * @returns {object} Object of errors.
 * @throws Will throw error if in the given metaData there is no field `name`.
 */
export const validateForm = (metaDataArr, dataObj) => {
  const res = {};
  metaDataArr.forEach(metaData => {
    if (!('name' in metaData)) {
      throw new Error('There is no field `name` in the given `metaData`');
    }
    const currentName = metaData.name;
    for (let field in metaData) {
      if (constraintExists(field)) {
        res[currentName] = validateFormField(
          field,
          metaData[field],
          dataObj[metaData.name],
        );
        break;
      }
    }
  })
  
    

  return res;
};

/**
 * Returns error message or null accorging to a given constraint.
 *
 * @param {string} constraint String name of constraint.
 * @param {object} constraintFlag Value of a constraint.
 * @param {any} data Data for given .
 * @param {Function} check Function that checks if data is valid.
 * @returns {string} Error message or null.
 * @throws Will throw an error when given the wrong type.
 */
export const validateFormField = (
  constraint,
  constraintFlag,
  data /* , check */,
) => {
  if (!constraintExists(constraint)) {
    throw new Error(`wrong given type: ${constraint}`);
  }
  if (Constraints[constraint].check(data, constraintFlag)) {
    return null;
  }
  return Constraints[constraint].Error(constraintFlag);
};
