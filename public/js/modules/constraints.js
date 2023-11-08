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
      check: (data, requiredFlag) => {
        return Constraints.email.check(data, requiredFlag);
      },
    },
    password: {
      check: (data, requiredFlag) => {
        return Constraints.password.check(data, requiredFlag);
      },
    },
    digits: {
      check: (data, requiredFlag) => {
        return Constraints.digits.check(data, requiredFlag);
      },
    },
    count_words: {
      check: (data, requiredFlag) => {
        return Constraints.count_words.check(data, requiredFlag);
      },
    },
    max_len: {
      check: (data, requiredFlag) => {
        return Constraints.max_len.check(data, requiredFlag);
      },
    },
    min_len: {
      check: (data, requiredFlag) => {
        return Constraints.min_len.check(data, requiredFlag);
      },
    },
    year: {
      check: (data, requiredFlag) => {
        return Constraints.year.check(data, requiredFlag);
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

// Constraints data for form validation
export const Constraints = {
  // When data is required
  required: {
    check: validator.checkRequired.bind(validator),
    // check: (data, required) => {
    //   return required && !data;
    // },
    error: () => {
      return 'Это поле обязательно для заполнения';
    },
  },

  // Email constraint
  email: {
    check: validator.checkEmail.bind(validator),
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
    check: validator.checkDigits.bind(validator),
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
    check: validator.checkMaxLen.bind(validator),
    // check: (data, maxLen) => {
    //   return maxLen ? data.length <= maxLen : false;
    // },
    error: (maxLen) => {
      return `Максимальная длина: ${maxLen}`;
    },
  },

  // Constraint on min length of data
  min_len: {
    check: validator.checkMinLen.bind(validator),
    // check: (data, minLen) => {
    //   return minLen >= 0 ? data.length >= minLen : false;
    // },
    error: (minLen) => {
      return `Минимальная длина: ${minLen}`;
    },
  },

  // Data must be valid date formatting like (dd.mm.yyyy)
  date: {
    check: validator.checkDate.bind(validator),
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
    check: validator.checkYear.bind(validator),
    // check: (data, year) => {
    //   return year ? Number(data) > 1900 && Number(data) < 2100 : false;
    // },
    error: () => {
      return 'Это поле должно содержать корректный год';
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
 * @returns {object} Object of errors.
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

    // if (!PreCheckField[fieldType].preCheck(fieldData)) {
    //   res[fieldName] = PreCheckField[fieldType].error();
    // } else {
    for (let field in metaData) {
      // if (res[fieldName] !== undefined) {
      //   break;
      // }
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
  fieldData /* , check */,
) => {
  if (!constraintExists(fieldType, constraint)) {
    throw new Error(`wrong given type: ${constraint}`);
  }

  // if (fieldType)
  if (FieldType[fieldType][constraint].check(fieldData, constraintValue)) {
    return null;
  }
  return Constraints[constraint].error(constraintValue);
};
