'use strict';

const DATE_REGEX = /^\d{1,2}\.\d{1,2}\.\d{4}$/g;

// Constraints data for form validation
export const Constraints = {
  // When data is required
  required: {
    check: (data, required) => {
      return required && !data;
    },
    error: () => {
      return 'Это поле обязательно для заполнения';
    },
  },

  // Constraint on data containing digits
  digits: {
    check: (data, digits) => {
      return digits ? data.split('').some((sym) => this.isDigit(sym)) : true;
    },
    error: () => {
      return 'Это поле должно содержать цифры';
    },
  },

  // Constraint on word's number
  count_words: {
    check: (data, countWords) => {
      return countWords
        ? data.trim().split(WORDS_SEPARATOR_REG_EX).length <= countWords
        : false;
    },
    error: (wordCount) => {
      return `Максимальное количество слов: ${wordCount}`;
    },
  },

  // Constraint on max length of data
  max_len: {
    // name: 'max_len',
    check: (data, maxLen) => {
      return maxLen ? data.length <= maxLen : false;
    },
    error: (maxLen) => {
      return `Максимальная длина: ${maxLen}`;
    },
  },

  // Constraint on min length of data
  min_len: {
    // name: 'min_len',
    check: (data, minLen) => {
      return minLen >= 0 ? data.length >= minLen : false;
    },
    error: (minLen) => {
      return `Минимальная длина: ${minLen}`;
    },
  },

  // Data must be valid date formatting like (dd.mm.yyyy)
  date: {
    // name: 'date',
    check: (data, date) => {
      if (!date) {
        return false;
      }
      res = data.match(DATE_REGEX) || [];
      isValid = res.length == 1;
      if (!isValid) {
        return false;
      }

      tokens = data.split('.');
      day = tokens[0];
      month = tokens[1];
      year = tokens[2];

      res = Date.parse(`${year}-${month}-${day}`);
      if (isNaN(res)) {
        return false;
      }
      return true;
      // return this.isValidDate(day, month, year);
    },
    error: () => {
      return 'Это поле должно содержать дату';
    },
  },

  // Data must be valid year
  year: {
    // name: 'year',
    check: (data, year) => {
      return year ? Number(data) > 1900 && Number(data) < 2100 : false;
    },
    error: () => {
      return 'Это поле должно содержать корректный год';
    },
  },
};

export const constraintExists = (constraintName) => {
  return constraintName in Constraints;
};
