import authView from '../jsviews/authView.js';
import menuView from '../jsviews/menuView.js';
import regView from '../jsviews/regView.js';
import vacsView from '../jsviews/vacsView.js';

/**
 * Класс Router для управления навигацией по сайту
 * @class
 */
class Router {
  /**
   * Конструктор класса Router
   * @constructor
   * @param {Object} routes - Хранилище рабочих адресов
   * @param {Object} ojbs - Хранилище для сопоставления адреса и соответствующей функции
   * @param {String} lastUrl - Переменная, хранящаяя предыдущий адрес посещения при переходе на следующий
   */
  constructor() {
    this.routes = {
      '/app_login': 'appAuth',
      '/emp_login': 'empAuth',
      '/app_reg': 'appReg',
      '/emp_reg': 'empReg',
      '/': 'vacs',
    };

    this.objs = {
      vacs: new vacsView(),
      appAuth: new authView('app'),
      empAuth: new authView('emp'),
      appReg: new regView('app'),
      empReg: new regView('emp'),
      menu: new menuView(),
    };

    this.lastUrl = '';
  }

  /**
   * Переход по указанному URL и отображение соответствующего вида
   * @param {String} url - текущий адрес, на котором находится пользователь
   * @returns {Promise<void>} - Промис, который разрешается, когда навигация успешно завершена (URL существует)
   */
  async goToLink(url) {
    if (url in this.routes) {
      if (this.lastUrl) {
        this.objs[this.routes[url]].remove();
      }

      this.lastUrl = url;
      this.objs['menu'].render();
      this.objs[this.routes[url]].render();
    } else {
      console.error(`Такого адреса не существует: ${url}`);
    }
  }

  /**
   * Получение текущего URL
   * @returns {String}
   */
  get curUrl() {
    return this.lastUrl;
  }
}

const router = new Router();
export default router;
