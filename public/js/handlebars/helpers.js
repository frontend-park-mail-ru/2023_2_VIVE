import Handlebars from "handlebars";

export function registerHelpers() {
  Handlebars.registerHelper('iff', function (v1, v2, options) {
    if (v1 === v2) {
      return options.fn(this);
    }
    return options.inverse(this);
  });
}
