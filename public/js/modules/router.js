import authView from '../views/authView.js';
import footerView from '../views/footerView.js';
import menuView from '../views/menuView.js';
import page404View from '../views/page404View.js';
import regView from '../views/regView.js';
import resCreationView from '../views/resCreationView.js';
import resViewView from '../views/resViewView.js';
import vacsView from '../views/vacsView.js';
import profileView from '../views/profileView.js';
import vacancyView from '../views/vacancyView.js'

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
      '/resume_creation': 'resCreation',
      '/resume_view': 'resView',
      '/profile': 'profile',
      '/profile/settings': 'profile',
      '/profile/resumes': 'profile',
      '/profile/responses': 'profile',
      '/vacancy': 'vacancy',
      '/': 'vacs',
    };

    this.objs = {
      vacs: new vacsView(),
      resCreation: new resCreationView(),
      resView: new resViewView(),
      appAuth: new authView('app'),
      empAuth: new authView('emp'),
      appReg: new regView('app'),
      empReg: new regView('emp'),
      profile: new profileView(),
      vacancy: new vacancyView(),
      menu: new menuView(),
      footer: new footerView(),
      page404: new page404View(),
    };

    this.prevView = undefined;
  }

  /**
   * Переход по указанному URL и отображение соответствующего вида
   * @param {String} url - текущий адрес, на котором находится пользователь
   * @returns {Promise<void>} - Промис, который разрешается, когда навигация успешно завершена (URL существует)
   */
  async goToLink(url) {
    if (this.prevView) {
      this.prevView.remove();
    }

    this.objs['menu'].remove();
    this.objs['footer'].remove();
    if (url in this.routes) {
      history.pushState(null, null, url);
      this.objs['menu'].render();
      this.objs['footer'].render();
      this.prevView = this.objs[this.routes[url]];
    } else {
      this.prevView = this.objs['page404'];
    }
    this.prevView.render();
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
