import { BACKEND_SERVER_URL } from '../../../config/config.js';
import APIConnector from '../modules/APIConnector.js'
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
      '/profile/vacancies': 'profile',
      '/profile/responses': 'profile',
      '/vacancy/:id': 'vacancy',
      '/vacancy/:id/description': 'vacancy',
      '/vacancy/:id/responses': 'vacancy',
      '/vacs': 'vacs',
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

    this.authoriziedNeed = [
    '/resCreation', 
    '/profile', 
    '/profile/settings', 
    '/profile/resumes', 
    '/profile/responses', 
    '/vacancy/:id/responses'
    ];

    this.denyWithAuth = [
      '/app_login',
      '/emp_login',
      '/app_reg',
      '/emp_reg',
    ]

    this.prevView = undefined;
  }

  /**
   * Переход по указанному URL и отображение соответствующего вида
   * @param {String} url - текущий адрес, на котором находится пользователь
   * @returns {Promise<void>} - Промис, который разрешается, когда навигация успешно завершена (URL существует)
   */
  async goToLink(url) {
    this.deleteLastRender();

    url = (url == '/') ? '/vacs' : url;

    const matchedRoute = await this.parsingUrlOnMathced(url);
    if (!matchedRoute) {
      this.prevView = this.objs['page404'];
      this.prevView.render();
      return;
    }

    const redirect = await this.needRedirect(matchedRoute);
    if ('redirect' in redirect) {
      router.goToLink(redirect['redirect']);
      return;
    }

    this.render(matchedRoute);
    history.pushState(null, null, url);
  }

  /**
   * Получение текущего URL
   * @returns {String}
   */
  get curUrl() {
    return this.lastUrl;
  }

  deleteLastRender() {
    if (this.prevView) {
      this.prevView.remove();
    }
    this.objs['menu'].remove();
    this.objs['footer'].remove();
  }

  render(url) {
    if (url) {
      this.objs['menu'].render();
      this.objs['footer'].render();
      this.prevView = this.objs[this.routes[url]];
    } else {
      this.prevView = this.objs['page404'];
    }
    this.prevView.render();
  }

  async needRedirect(url) {
    if (this.denyWithAuth.includes(url) && await this.authCheck()) {
      return {'redirect': '/vacs'};
    } else if (this.authoriziedNeed.includes(url) && !(await this.authCheck())) {
      return {'redirect': '/app_login'};
    } else {
      return {};
    }
  }

  async parsingUrlOnMathced(url) {
    for (const route in this.routes) {
      const routeRegex = new RegExp(`^${route.replace(/:\w+/g, '(\\d+)')}(#)?$`);
      if (routeRegex.test(url)) {
        
        if (url.startsWith('/vacancy')) {
          const id = await this.getVacancyId(url);
          if (id <= 0) {
            return null;
          } 
        } else if (url.startsWith('/profile')) {
          if (!(await this.setDataUrlToProfile(url))) {
            return null;
          }
        }

        return route;
      }
    }
    return null;
  }

  async getVacancyId(url) {
    const idMatch = url.match(/\d+/);
    const id = idMatch ? parseInt(idMatch[0]) : null;
    if (!isNaN(id)) {
      const view = this.objs[this.routes['/vacancy/:id']];
      if (!(await view.updateInnerData({'id': id}))) {
        return -1;
      } else {
        return id; 
      }
    }
  }

  async setDataUrlToProfile(url) {
    const view = this.objs[this.routes[url]];
    return await view.updateInnerData(url);
  }

  async authCheck() {
    try {
      const resp = await APIConnector.get(`${BACKEND_SERVER_URL}/session`);
      return true;
    } catch(err) {
      const statusCode = err.status.StatusCode;
      if (statusCode > 500) {
        throw new Error("INTERNAL ERROR");
      } else {
        return false;
      }
    }
  }
}

const router = new Router();
export default router;
