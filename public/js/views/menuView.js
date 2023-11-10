import router from '../modules/router.js';
import User from '../stores/UserStore.js';
import { getHrefFromLink } from '../utils.js';
import View from './view.js';

export default class menuView extends View {

  /**
   * Асинхронный метод для отображения меню
   */
  async render() {
    await super.render();
    await this.compileTemplates();
    this.addEventListeners();
  }

  /**
   * Метод, который компилирует шаблон с данными
   */
  async compileTemplates() {
    // eslint-disable-next-line no-undef
    const template = Handlebars.partials['header'];
    document.querySelector('header').innerHTML = template({ user: await User.getUser() });
  }

  /**
   * Метод, добавляющий обработчики событий на страницу
   */
  async addEventListeners() {
    const links = document.querySelectorAll('.navbar__item__btn');
    // eslint-disable-next-line no-unused-vars
    links.forEach((link, i) => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        router.goToLink(getHrefFromLink(link));
      });
    });

    // if (await cookie.hasCookie()) {
    //   const logout_btn = document.querySelector('.logout-btn');
    //   logout_btn.addEventListener('click', async (e) => {
    //     e.preventDefault();
    //     try {
    //       await APIConnector.delete(BACKEND_SERVER_URL + '/session');
    //       router.goToLink('/');
    //     } catch (err) {
    //       console.error('logout: ', err);
    //     }
    //   });
    // }
  }

  clear() {
    document.querySelector('header').innerHTML = "";
  }
}
