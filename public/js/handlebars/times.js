import Handlebars from 'handlebars';

export default function times(n, block) {
    let accum = '';
    for (let i = 0; i < n; ++i) {
        const id = `${i + 1}`;
        accum += block.fn({ index: i, id });
    }
    return accum;
}

Handlebars.registerHelper('times', times);

