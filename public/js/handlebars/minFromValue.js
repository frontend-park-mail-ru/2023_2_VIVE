import Handlebars from 'handlebars';

export default function minFromValue(value) {
    return value.split(':')[0];
}

Handlebars.registerHelper('minFromValue', minFromValue);
