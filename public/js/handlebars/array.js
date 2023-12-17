import Handlebars from 'handlebars';

export default function array() {
    return Array.from(arguments).slice(0, arguments.length - 1)
}

Handlebars.registerHelper('array', array);

