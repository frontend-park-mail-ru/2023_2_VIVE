import Handlebars from 'handlebars';

export default function sum(arr) {
    return arr.reduce((partialSum, a) => partialSum + a, 0);
}

Handlebars.registerHelper('sum', sum);
