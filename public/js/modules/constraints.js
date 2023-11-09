'use strict';

import { validator, DEFAULT_PASSWORD_PARAM } from './validator.js';
import { zip, checkField, contains } from '../utils.js';

const WRONG_PSWD_PARAM =
  'Wrong password flag, mus be an object with (minLength, maxLength, includeUpperCase, includeDigits) fields or true';

/**
 * Constraints data for form validation. All flags must be present to be true
 * meaning that it doesn't matter what value the have.
 *
 * Exceptions are:
 * - `passwordFlag` is an object with following fields
 * [`minLength`, `maxLength`, `includeUpperCase`, `includeDigits`]:
 * - `password_repeat` is a name of field with a main field with password
 * - `count_words` is a max word number in the string
 * - `max_len` is max length of a string
 * - `min_len` is min length of a string
 * - `regExpFlag` is an regular expression string
 */
const Constraints = {
  // When data is required
  required: {
    check: (ctx, fieldToCheckName) => {
      return ctx[fieldToCheckName] ? null : [fieldToCheckName];
    },
    error: () => {
      return 'Это поле обязательно для заполнения';
    },
  },

  // Email constraint
  email: {
    check: (ctx, fieldToCheckName) => {
      return validator.isEmail(ctx[fieldToCheckName])
        ? null
        : [fieldToCheckName];
    },
    error: () => {
      return 'Некорректный email';
    },
  },

  // Password constraint for registration form.
  password: {
    check: (ctx, fieldToCheckName, passwordParams) => {
      if (passwordParams === true) {
        return validator.isValidPasswor(ctx[fieldToCheckName])
          ? null
          : [fieldToCheckName];
      }
      if (passwordParams instanceof Object) {
        checkField(passwordParams, 'minLength');
        checkField(passwordParams, 'maxLength');
        checkField(passwordParams, 'includeUpperCase');
        checkField(passwordParams, 'includeDigits');
        return validator.isValidPasswor(ctx[fieldToCheckName], passwordParams)
          ? null
          : [fieldToCheckName];
      }
      throw new Error(WRONG_PSWD_PARAM);
    },
    error: (passwordParams) => {
      if (passwordParams === true) {
        passwordParams = DEFAULT_PASSWORD_PARAM;
      }
      if (passwordParams instanceof Object) {
        checkField(passwordParams, 'minLength');
        checkField(passwordParams, 'maxLength');
        checkField(passwordParams, 'includeUpperCase');
        checkField(passwordParams, 'includeDigits');

        let errorMsg = `Пароль должен: быть от ${passwordParams.minLength} до ${passwordParams.maxLength} символов`;
        if (passwordParams.includeUpperCase) {
          errorMsg += ', содержать заглавные символы';
        }
        if (passwordParams.includeDigits) {
          errorMsg += ', содержать цифры';
        }
        return errorMsg;
      }
      throw new Error(WRONG_PSWD_PARAM);
    },
  },

  // Check if entered password matches the one in another field
  password_repeat: {
    check: (ctx, fieldToCheckName, passwordFieldName) => {
      return validator.equals(ctx[fieldToCheckName], ctx[passwordFieldName])
        ? null
        : [fieldToCheckName, passwordFieldName];
    },
    error: () => {
      return 'Пароли не совпадают';
    },
  },

  // Constraint on data must containing digits
  digits: {
    check: (ctx, fieldToCheckName) => {
      return validator.hasDigits(ctx[fieldToCheckName])
        ? null
        : [fieldToCheckName];
    },
    error: () => {
      return 'Это поле должно содержать цифры';
    },
  },

  // Constraint on data containing no digits
  no_digits: {
    check: (ctx, fieldToCheckName) => {
      return !validator.hasDigits(ctx[fieldToCheckName])
        ? null
        : [fieldToCheckName];
    },
    error: () => {
      return 'Это поле не должно содержать цифры';
    },
  },

  // Constraint on data containing only digits
  only_digits: {
    check: (ctx, fieldToCheckName) => {
      if (validator.onlyDigits(ctx[fieldToCheckName])) {
        return null;
      }
      return [fieldToCheckName];
    },
    error: () => {
      return 'Это поле должно содержать только цифры';
    },
  },

  // Constraint on word's number
  count_words: {
    check: (ctx, fieldToCheckName, countWordsValue) => {
      return ctx[fieldToCheckName].trim() &&
        validator.countWords(ctx[fieldToCheckName]) <= countWordsValue
        ? null
        : [fieldToCheckName];
    },
    error: (wordCount) => {
      return `Максимальное количество слов: ${wordCount}`;
    },
  },

  // Constraint on max length of data
  max_len: {
    check: (ctx, fieldToCheckName, maxLenValue) => {
      return ctx[fieldToCheckName].length <= maxLenValue
        ? null
        : [fieldToCheckName];
    },
    error: (maxLen) => {
      return `Максимальная длина: ${maxLen}`;
    },
  },

  // Constraint on min length of data
  min_len: {
    check: (ctx, fieldToCheckName, minLenFlag) => {
      return ctx[fieldToCheckName].length >= minLenFlag
        ? null
        : [fieldToCheckName];
    },
    error: (minLen) => {
      return `Минимальная длина: ${minLen}`;
    },
  },

  // equals: {},

  // Data must be valid date formatting like (dd.mm.yyyy)
  date: {
    check: (ctx, fieldToCheckName) => {
      return validator.isValidDate(ctx[fieldToCheckName])
        ? null
        : [fieldToCheckName];
    },
    error: () => {
      return 'Это поле должно содержать дату';
    },
  },

  // Data must be valid year
  year: {
    check: (ctx, fieldToCheckName) => {
      return validator.isValidYear(ctx[fieldToCheckName])
        ? null
        : [fieldToCheckName];
    },
    error: () => {
      return 'Это поле должно содержать корректный год';
    },
  },

  // RegExp constraint on data
  regexp: {
    check: (ctx, fieldToCheckName, regExpFlag) => {
      return validator.fullMatchRegExp(ctx[fieldToCheckName], regExpFlag)
        ? null
        : [fieldToCheckName];
    },
    error: () => {
      return 'Неверный формат';
    },
  },
};

const TypeConstraints = {
  text: {
    required: {
      check: (ctx, fieldToCheckName) => {
        return validator.isEmpty(ctx[fieldToCheckName])
          ? Constraints.required.check(ctx, fieldToCheckName)
          : [fieldToCheckName];
      },
    },
  },
};

const isTypeConstraint = (fieldType, constraintName) => {
  return fieldType in TypeConstraints
    ? constraintName in TypeConstraints[fieldType]
    : false;
};

const allowedConstraints = () => {
  let res = [];
  for (let constraint in Constraints) {
    res = res.concat(constraint);
  }

  return res;
};

export const constraintExists = (constraintName) => {
  if (constraintName in Constraints) {
    return true;
  }
  if (contains(['type', 'data'], constraintName)) {
    return false;
  }
  throw new Error(
    `Wrong constraint '${constraintName}. Allowed constraints: [${allowedConstraints().join(
      ', ',
    )}]'`,
  );
};

const collectData = (dataObj) => {
  const res = {};
  for (let filedName in dataObj) {
    checkField(dataObj[filedName], 'data');
    checkField(dataObj[filedName], 'type');
    res[filedName] = dataObj[filedName].data;
  }

  return res;
};

/**
 * Returns object with errors.
 *
 * @param {object} dataObj Object where keys are **names** of form fields and value
 * is another object where keys are:
 * - `data` from the form field
 * - `type` of the data
 * - constraints for this field
 *
 * For example:
 * ```js
 * dataObj = {
 *  first_name: {
 *    data: "Jhon",
 *    type: "text",
 *    required: true,
 *    count_words: 1,
 *    no_digits: true
 *  }
 * };
 * ```
 * @returns {object} Object with errors.
 * @throws Will throw error if in the objects of given dataObj no fields with `type` and `data`.
 * Also error will occur when provided with invalid constraints and values for them.
 */
export const validateForm = (dataObj) => {
  const ctx = collectData(dataObj);

  let res = {};
  for (let formFieldName in dataObj) {
    // dataObj.forEach((formFieldName) => {
    const constraints = dataObj[formFieldName];

    const errorObj = validateFormdField(constraints, formFieldName, ctx);
    if (errorObj === null) {
      continue;
    }

    res = zip(res, errorObj);
  }

  return res;
};

const validateFormdField = (constraints, fieldName, ctx) => {
  for (let constraintName in constraints) {
    if (constraintExists(constraintName)) {
      const fieldType = constraints.type;
      const constraintValue = constraints[constraintName];

      const constraintRes = validateFormConstraint(
        ctx,
        fieldName,
        fieldType,
        constraintName,
        constraintValue,
      );

      if (constraintRes !== null) {
        return constraintRes;
      }
    }
  }
  return null;
};

const validateFormConstraint = (
  ctx,
  fieldName,
  fieldType,
  constraintName,
  constraintValue,
) => {
  const errorFields = check(
    ctx,
    fieldName,
    fieldType,
    constraintName,
    constraintValue,
  );

  if (!errorFields) {
    return null;
  }
  let res = {};
  for (let errorField of errorFields) {
    res[errorField] = constraintError(constraintName, constraintValue);
  }

  return res;
};

const check = (ctx, fieldName, fieldType, constraintName, constraintValue) => {
  if (isTypeConstraint(fieldType, constraintName)) {
    return TypeConstraints[fieldType][constraintName].check(
      ctx,
      fieldName,
      constraintValue,
    );
  }
  return Constraints[constraintName].check(ctx, fieldName, constraintValue);
};

const constraintError = (constraintName, constraintErrorArg) => {
  return Constraints[constraintName].error(constraintErrorArg);
};
