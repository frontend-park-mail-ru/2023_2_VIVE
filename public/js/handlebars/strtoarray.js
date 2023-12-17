import Handlebars from 'handlebars';

export default function strtoarray(str) {
  return str.split('\u000A');
}

Handlebars.registerHelper('strtoarray', strtoarray);
