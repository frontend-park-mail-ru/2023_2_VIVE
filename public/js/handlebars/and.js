import Handlebars from 'handlebars';

export default function and() {
    const arr = Array.from(arguments).slice(0, arguments.length - 1);
    console.log(arr);
    let isOk = true;
    isOk = arr.every(arg => {
        if (arg) {
            console.log(arg)
            return true;
        }
        return false
    });
    return isOk;
}

Handlebars.registerHelper('and', and);
