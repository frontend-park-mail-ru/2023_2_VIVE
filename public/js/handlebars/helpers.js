const ruNames = {
  'none': 'Не указано',
  'nothing': 'Не указано',

  'city': 'Город',
  'salary': 'Уровень дохода',

  'gender': 'Пол',
  'female': 'Женский',
  'male': 'Мужской',

  'experience': 'Опыт работы',
  'no_experience': 'Без опыта',
  'one_three_years': 'От 1 до 3-х лет',
  'three_six_years': 'От 3-х до 6-ти лет',
  'six_more_years': 'Более 6-ти лет',

  'employment': 'Тип занятости',
  'full-time': 'Полная занятость',
  'one-time': 'Разовая работа',
  'volunteering': 'Волонтерство',
  'part-time': 'Частичная занятость',
  'internship': 'Стажировка',

  'education_type': 'Образование',
  'secondary': 'Среднее',
  'secondary_special': 'Среднее специальное',
  'incomplete_higher': 'Незаконченное высшее',
  'higher': 'Высшее',
  'bachelor': 'Бакалавр',
  'master': 'Магистр',
  'phd_junior': 'Кандидат наук',
  'phd': 'Доктор наук',
};

/**
 * Функция для добавления пользовательских handlebars-helpers
 */
import Handlebars from 'handlebars';

export function registerHelpers() {
  Handlebars.registerHelper('sub', function (num1, num2) {
    return num1 - num2;
  });

  Handlebars.registerHelper('or', function(a, b, options) {
    return a || b ? options.fn(this) : options.inverse(this);
  });

  Handlebars.registerHelper('and', function() {
    const arr = Array.from(arguments).slice(0, arguments.length-1);
    console.log(arr);
    let isOk = true;
    isOk = arr.every(arg =>{
      if (arg) {
        console.log(arg)
        return true;
      }
      return false
    });
    return isOk;
  });

  Handlebars.registerHelper('isOdd', function(value) {
    return value % 2 !== 0;
  });

  Handlebars.registerHelper('isEven', function(value) {
    return value % 2 === 0;
  });
  
  
  Handlebars.registerHelper('object', function({hash}) {
    return hash;
  });

  Handlebars.registerHelper('array', function () {
    return Array.from(arguments).slice(0, arguments.length - 1)
  });

  Handlebars.registerHelper('sum', function (arr) {
    return arr.reduce((partialSum, a) => partialSum + a, 0);
  });

  Handlebars.registerHelper('concat', function () {
    const args = Array.from(arguments).slice(0, arguments.length - 1);
    return args.reduce((sum, current) => sum + current, "");
  });

  Handlebars.registerHelper('times', function(n, block) {
    let accum = '';
    for (let i = 0; i < n; ++i) {
      const id = `${i + 1}`;
      accum += block.fn({ index: i, id });
    }
    return accum;
  });

  function checkCondition(v1, operator, v2) {
    switch (operator) {
      case '==':
        return (v1 == v2);
      case '===':
        return (v1 === v2);
      case '!==':
        return (v1 !== v2);
      case '<':
        return (v1 < v2);
      case '<=':
        return (v1 <= v2);
      case '>':
        return (v1 > v2);
      case '>=':
        return (v1 >= v2);
      case '&&':
        return (v1 && v2);
      case '||':
        return (v1 || v2);
      default:
        return false;
    }
  }

  Handlebars.registerHelper('ifs', function (v1, iftrue, iffalse) {
    return v1 ? iftrue : iffalse;
  });

  Handlebars.registerHelper('iffs', function (v1, operator, v2, iftrue, iffalse) {
    return checkCondition(v1, operator, v2) ? iftrue : iffalse;
  });

  Handlebars.registerHelper('iff', function (v1, operator, v2, options) {

    return checkCondition(v1, operator, v2)
      ? options.fn(this)
      : options.inverse(this);
  });

  Handlebars.registerHelper('strtoarray', function (str) {
    return str.split('\u000A');
  });

  Handlebars.registerHelper('arraytostr', function (arr) {
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
  });

  Handlebars.registerHelper('formatDate', function (dateString) {
    const options = { year: 'numeric', month: '2-digit', day: '2-digit' };
    const formattedDate = new Date(dateString).toLocaleDateString('ru-RU', options);
    return formattedDate;
  });

  Handlebars.registerHelper('ruFilters', function (string) {
    return ruNames[string];
  });

  Handlebars.registerHelper('sortByCityCount', function(cities, name, number) {
    cities.sort(function(a, b) {
      return b.count - a.count;
    });
    
    if (name !== 'city') {
      return cities;
    } else {
      return cities.slice(0, number);
    }
  });

  Handlebars.registerHelper('isInArray', function (item, array, options) {
    if (Array.isArray(array) && array.length > 0 && array.indexOf(item) > -1) {
      return options.fn(this);
    } else {
      return options.inverse(this);
    } 
  });

  Handlebars.registerHelper('minFromValue', function(value) {
    return value.split(':')[0];
  });

  Handlebars.registerHelper('maxFromValue', function(value) {
    return value.split(':')[1];
  });
}

registerHelpers();
