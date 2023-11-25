/**
 * Функция для добавления пользовательских handlebars-helpers
 */

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
}
registerHelpers();
