import Handlebars from 'handlebars';

export default function arraytostr(arr) {
    let res = '';
    if (arr !== undefined) {
        if (typeof arr === "string") {
            arr = arr.split(' ');
        }
        arr.forEach(element => {
            res += element + ' ';
        });
    }
    return res;
}

Handlebars.registerHelper('arraytostr', arraytostr);
