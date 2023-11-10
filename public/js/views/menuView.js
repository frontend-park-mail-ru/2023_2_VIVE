import { BACKEND_SERVER_URL } from '../../../config/config.js';
import APIConnector from '../modules/APIConnector.js';
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

    const dropdownBtn = document.querySelector('.dropdown__padd-btn');
    const content = document.querySelector('.dropdown__content');

    if (dropdownBtn) {
      dropdownBtn.addEventListener('click', function (event) {
        const isContentVisible = !content.classList.contains('d-none');
        
        if (isContentVisible) {
          dropdownBtn.classList.remove('dropdown__img--rotate');
          dropdownBtn.classList.add('dropdown__img--rotate-secondary');
          content.classList.add('d-none');
        } else {
          dropdownBtn.classList.remove('dropdown__img--rotate-secondary');
          dropdownBtn.classList.add('dropdown__img--rotate');
          content.classList.remove('d-none');
        }

        event.stopPropagation();
      });

      document.addEventListener('click', function (event) {
        if (!content.contains(event.target) && !dropdownBtn.contains(event.target)) {
          dropdownBtn.classList.remove('dropdown__img--rotate');
          dropdownBtn.classList.add('dropdown__img--rotate-secondary');
          content.classList.add('d-none');
        }
      });

      const profileBtn = document.querySelector('[name="profile"]');
      const settingBtn = document.querySelector('[name="settings"]');
      const switchBtn = document.querySelector('[name="switch"]');
      const leaveBtn = document.querySelector('[name="leave"]');
  
      profileBtn.addEventListener('click', () => {
          router.goToLink('/profile');
      });
  
      settingBtn.addEventListener('click', () => {
        router.goToLink('/profile/settings');
      });
  
      leaveBtn.addEventListener('click', async (e) => {
        e.preventDefault();
        try {
          await APIConnector.delete(BACKEND_SERVER_URL + '/session');
          router.goToLink('/');
        } catch (err) {
          console.error('logout: ', err);
        }
      });
    }

    // if (await cookie.hasCookie()) {
    //   const logout_btn = document.querySelector('.logout-btn');
    //   leaveBtn.addEventListener('click', async (e) => {
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
