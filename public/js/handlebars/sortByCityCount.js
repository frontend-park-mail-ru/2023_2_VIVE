import Handlebars from 'handlebars';

export default function sortByCityCount(cities, name, number) {
    cities.sort(function (a, b) {
        return b.count - a.count;
    });

    if (name !== 'city') {
        return cities;
    } else {
        return cities.slice(0, number);
    }
}

Handlebars.registerHelper('sortByCityCount', sortByCityCount);
