import Handlebars from 'handlebars';

export default function maxFromValue(value) {
    return value.split(':')[1];
}

Handlebars.registerHelper('maxFromValue', maxFromValue);
