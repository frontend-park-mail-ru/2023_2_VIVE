/**
 * Функция для добавления пользовательских handlebars-helpers
 */
export function registerHelpers() {
  // eslint-disable-next-line no-undef
  Handlebars.registerHelper('iff', function (v1, v2, options) {
    if (v1 === v2) {
      return options.fn(this);
    }
    return options.inverse(this);
  });
}
