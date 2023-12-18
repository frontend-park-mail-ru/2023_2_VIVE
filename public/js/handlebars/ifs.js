import Handlebars from 'handlebars';

export default function ifs(v1, iftrue, iffalse) {
    return v1 ? iftrue : iffalse;
}

Handlebars.registerHelper('ifs', ifs);
