import { BACKEND_SERVER_URL } from '../../../config/config.js';
import APIConnector from '../modules/APIConnector.js';
import { cookie } from '../modules/cookieCheck.js';
import router from '../modules/router.js';
import { getHrefFromA } from '../utils.js';
// import { Handlebars } from '../../../node_modules/handlebars/dist/handlebars.runtime.js'

export default class menuView {
  // constructor() {
  //   this.eventListeners = {
  //     // obj: {
  //     //   listener: ...,
  //     //   type: ...,
  //     //   options: ...,
  //     //   useCapture: ...,
  //     // }
  //   };
  // }

  /**
   * Асинхронный метод для отображения меню
   */
  async render() {
    await this.compileTemplates();
    this.addEventListeners();
  }
  
  /**
   * Метод, который компилирует шаблон с данными
   */
  async compileTemplates() {
    // eslint-disable-next-line no-undef
    const template = Handlebars.partials['header'];
    document.querySelector('header').innerHTML = template(await this.getContext());
  }

  /**
   * Метод для создания контекста шаблона
   * @returns {Object} объект с данными
   */
  async getContext() { 
    const isOk = await cookie.hasCookie();
    return {
      is_user_login: isOk,
      user_type: {
        app: true,
      },
    };

  }

  // addEventListenerWrapper(
  //   obj,
  //   type,
  //   listener,
  //   useCapture = false,
  //   options = {},
  // ) {
  //   obj.addEventListener(type, listener, useCapture, options);
  //   this.eventListeners[obj] = {
  //     listener,
  //     useCapture,
  //     options,
  //   };
  // }

  /**
   * Метод, добавляющий обработчики событий на страницу
   */
  async addEventListeners() {
    const links = document.querySelectorAll('.navbar__item__btn');
    // eslint-disable-next-line no-unused-vars
    links.forEach((link, i) => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        router.goToLink(getHrefFromA(link));
      });
    });

    if (await cookie.hasCookie()) {
      const logout_btn = document.querySelector('.logout-btn');
      logout_btn.addEventListener('click', async (e) => {
        e.preventDefault();
        try {
          await APIConnector.delete(BACKEND_SERVER_URL + '/session');
          router.goToLink('/');
        } catch (err) {
          console.error('logout: ', err);
        }
      });
    }
  }

  /**
   * Метод, удаляющий обработчики событий
   */
  removeEventListeners() {}

  /**
   * Основной метод, который вызывается при закрытии страницы
   */
  remove() {
    this.removeEventListeners();
  }
}
