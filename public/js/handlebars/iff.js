import Handlebars from 'handlebars';
import { checkCondition } from './_main.js';

export default function iff(v1, operator, v2, options) {
    return checkCondition(v1, operator, v2)
            ? options.fn(this)
            : options.inverse(this);

}


Handlebars.registerHelper('iff', iff);
