import Handlebars from 'handlebars';

export default function formatDate(dateString) {
    const options = { year: 'numeric', month: '2-digit', day: '2-digit' };
    const formattedDate = new Date(dateString).toLocaleDateString('ru-RU', options);
    return formattedDate;
}

Handlebars.registerHelper('formatDate', formatDate);
