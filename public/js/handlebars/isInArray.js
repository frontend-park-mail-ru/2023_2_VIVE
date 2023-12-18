import Handlebars from 'handlebars';

export default function isInArray(item, array, options) {
    if (Array.isArray(array) && array.length > 0 && array.indexOf(item) > -1) {
        return options.fn(this);
    } else {
        return options.inverse(this);
    }
}

Handlebars.registerHelper('isInArray', isInArray);
