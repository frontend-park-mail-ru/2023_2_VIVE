import Handlebars from 'handlebars';

export default function arraytostr(arr) {
    let res = '';
    if (arr !== undefined) {
        if (typeof arr === "string") {
            arr = arr.split(';');
        }
        arr.forEach(element => {
            res += element + ';';
        });
        res = res.slice(0, -1);
    }
    return res;
}

Handlebars.registerHelper('arraytostr', arraytostr);
