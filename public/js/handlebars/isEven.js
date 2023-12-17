import Handlebars from 'handlebars';

export default function isEven(value) {
    return value % 2 === 0;
}

Handlebars.registerHelper('isEven', isEven);
