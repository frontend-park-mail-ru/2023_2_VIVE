import Handlebars from 'handlebars';

export default function isOdd(value) {
    return value % 2 !== 0;
}

Handlebars.registerHelper('isOdd', isOdd);
