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

