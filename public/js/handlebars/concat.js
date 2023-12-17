import Handlebars from 'handlebars';

export default function concat() {
    const args = Array.from(arguments).slice(0, arguments.length - 1);
    return args.reduce((sum, current) => sum + current, "");
}

Handlebars.registerHelper('concat', concat);
