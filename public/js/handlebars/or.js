import Handlebars from 'handlebars';

export default function or(a, b, options) {
    return a || b ? options.fn(this) : options.inverse(this);
}

Handlebars.registerHelper('or', or);
