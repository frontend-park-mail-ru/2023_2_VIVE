import Handlebars from 'handlebars';

export default function sub(num1, num2) {
    return num1 - num2;
}

Handlebars.registerHelper('sub', sub);
