export function isObjEmpty(obj) {
  return Object.keys(obj).length === 0;
}

export function getHrefFromLink(aTag) {
  const splittedHref = aTag.href.split(aTag.host);
  return splittedHref[splittedHref.length - 1];
}

/**
 * Метод, получающий объект данных формы
 * @returns {Object} объект с данными формы
 */
export function getFormObject(formData) {
  const formObject = {};
  formData.forEach(function (value, key) {
    formObject[key] = value;
  });
  return formObject;
}

/**
 * Returns new object with all the properties of all the given objects.
 * If one property is in multiple objects selects the erliest one.
 * If one of given arguments is not an object - returns null
 * Throws an exception if given no arguments
 *
 * @throws {Error} Argument objects should not be empty
 * @param  {...object} objects - Given objects
 * @returns {object} - New object with all the properties or null.
 */
export const zip = (...objects) => {
  if (objects.length == 0) {
    throw new Error('No parametres were entered');
  }
  return objects.every(
    (element) =>
      typeof element === 'object' &&
      Object.getPrototypeOf(element) === Object.prototype,
  )
    ? Object.assign({}, ...objects.reverse())
    : null;
};

/**
 * Check if given `fieldName` is in `obj`.
 *
 * @param {object} obj Object to check in.
 * @param {string} fieldName Name of field to check in `obj`.
 * @throws Will throw error when no fields with name `fieldName` was found
 */
export const checkField = (obj, fieldName) => {
  if (!(fieldName in obj)) {
    throw new Error(
      `There is no field '${fieldName}' in the given object: ${fieldName}`,
    );
  }
};

/**
 * Check if given `elem` is in `arr`.
 *
 * @param {Array} arr Array to check in.
 * @param {any} elem Element to check for.
 * @returns {boolean} True if `elem` is in `arr`, false othrewise
 */
export function contains(arr, elem) {
  return arr.indexOf(elem) != -1;
}
