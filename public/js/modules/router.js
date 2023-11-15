import { BACKEND_SERVER_URL } from '../../../config/config.js';
import APIConnector from '../modules/APIConnector.js'
import footerView from '../views/footerView.js';
import menuView from '../views/menuView.js';
import page404View from '../views/page404View.js';
import resCreationView from '../views/resCreationView.js';
import resViewView from '../views/resViewView.js';
import vacsView from '../views/vacsView.js';
import profileView from '../views/profileView.js';
import vacancyView from '../views/vacancyView.js';
import regAuthView from '../views/regAuthView.js'
import responseView from '../views/responseView.js';

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
      '/app_auth': 'appAuth',
      '/emp_auth': 'empAuth',
      '/app_reg': 'appReg',
      '/emp_reg': 'empReg',
      '/resume_creation': 'resCreation',
      '/profile': 'profile',
      '/profile/settings': 'profile',
      '/profile/resumes': 'profile',
      '/profile/vacancies': 'profile',
      '/profile/responses': 'profile',
      '/vacancy/:id': 'vacancy',
      '/vacancy/:id/description': 'vacancy',
      '/vacancy/:id/responses': 'vacancy',
      '/resume/:id': 'resView',
      '/response/:id': 'responseView',
      '/vacs': 'vacs',
    };

    this.objs = {
      responseView: new responseView(),
      vacs: new vacsView(),
      resCreation: new resCreationView(),
      resView: new resViewView(),
      appAuth: new regAuthView('auth', 'applicant'),
      empAuth: new regAuthView('auth', 'employer'),
      appReg: new regAuthView('reg', 'applicant'),
      empReg: new regAuthView('reg', 'employer'),
      profile: new profileView(),
      vacancy: new vacancyView(),
      menu: new menuView(),
      footer: new footerView(),
      page404: new page404View(),
    };

    this.authoriziedNeed = [
    '/resume_creation', 
    '/profile', 
    '/profile/resumes', 
    '/profile/settings', 
    '/profile/responses',
    '/profile/vacancies', 
    '/vacancy/:id/responses',
    '/response/:id',
    ];

    this.denyWithAuth = [
      '/app_auth',
      '/emp_auth',
      '/app_reg',
      '/emp_reg',
    ]

    this.prevView = undefined;

    window.addEventListener('popstate', (e) => {
      const urlObj = new URL(window.location.href);
      this.urlWork(urlObj.pathname);
    });
  }

  /**
   * Переход по указанному URL и отображение соответствующего вида
   * @param {String} url - текущий адрес, на котором находится пользователь
   * @returns {Promise<void>} - Промис, который разрешается, когда навигация успешно завершена (URL существует)
   */
  async goToLink(url) {
    url = (url == '/') ? '/vacs' : url;
    await this.urlWork(url);
    history.pushState(null, null, url);
  }

  /**
   * Получение текущего URL
   * @returns {String}
   */
  get curUrl() {
    return this.lastUrl;
  }

  async urlWork(url) {
    this.deleteLastRender();

    const matchedRoute = await this.parsingUrlOnMathced(url);
    if (!matchedRoute) {
      this.prevView = this.objs['page404'];
      this.prevView.render();
      return;
    }

    this.render(matchedRoute);
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
      if (this.prevView) {
        this.prevView.clear();
      }
      this.objs['menu'].clear();
      this.objs['footer'].clear();
      this.prevView = this.objs['page404'];
    }
    this.prevView.render();
  }

  async needRedirect(url) {
    if (this.denyWithAuth.includes(url) && await this.authCheck()) {
      return {'redirect': '/vacs'};
    } else if (this.authoriziedNeed.includes(url) && !(await this.authCheck())) {
      return {'redirect': '/app_auth'};
    } else {
      return {};
    }
  }

  async parsingUrlOnMathced(url) {
    for (const route in this.routes) {
      const routeRegex = new RegExp(`^${route.replace(/:\w+/g, '(\\d+)')}(#)?$`);
      if (routeRegex.test(url)) {
        
        const redirect = await this.needRedirect(route);
        if (!('redirect' in redirect)) {
          if (url.startsWith('/vacancy')) {
            const id = await this.getVacancyId(url);
            if (id <= 0) {
              return null;
            } 
          } else if (url.startsWith('/profile')) {
              if (!(await this.setDataUrlToProfile(url))) {
                return null;
              }
          } else if (url.startsWith('/resume') && (url[7] != '_')) {
              const id = await this.setResumeIdToView(url);
              if (id <= 0) {
                return null;
              }
          } else  if (url.startsWith('/response')) {
            if (!await this.setVacancyIdToResponse(url)) {
              router.goToLink('/resume_creation');
              return;
            }
          } else if (url.startsWith('/vacs')) {
            if (!await this.updateVacanciesList()) {
              return null;
            }
          }
          
        } else {
          router.goToLink(redirect['redirect']);
          return;
        }

        return route;
      }
    }
    return null;
  }

  async updateVacanciesList() {
    const view = this.objs[this.routes['/vacs']];
    if (!await view.updateInnerData({})) {
      return false
    } else {
      return true;
    }
  }

  async setVacancyIdToResponse(url) {
    const idMatch = url.match(/\d+/);
    const id = idMatch ? parseInt(idMatch[0]) : null;
    if (!isNaN(id)) {
      const view = this.objs[this.routes['/response/:id']];
      if (!await view.updateInnerData({'id': id})) {
        return false
      } else {
        return true;
      }
    }
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

  async setResumeIdToView(url) {
    const idMatch = url.match(/\d+/);
    const id = idMatch ? parseInt(idMatch[0]) : null;
    if (!isNaN(id)) {
      const view = this.objs[this.routes['/resume/:id']];
      if (!(await view.updateInnerData({'id': id}))) {
        return -1;
      } else {
        return id; 
      }
    }
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
