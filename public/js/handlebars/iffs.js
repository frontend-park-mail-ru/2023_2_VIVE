import Handlebars from 'handlebars';

import { checkCondition } from './_main.js';

export default function iffs(v1, operator, v2, iftrue, iffalse) {
    return checkCondition(v1, operator, v2) ? iftrue : iffalse;
}

Handlebars.registerHelper('iffs', iffs);
