import { BACKEND_SERVER_URL } from '../../../config/config.js';
import APIConnector from '../modules/APIConnector.js';
import { cookie } from '../modules/cookieCheck.js';
import router from '../modules/router.js';
import { getHrefFromA } from '../utils.js';

export default class menuView {
  constructor() {
    this.eventListeners = {
      // obj: {
      //   listener: ...,
      //   type: ...,
      //   options: ...,
      //   useCapture: ...,
      // }
    };
  }

  async render() {
    // eslint-disable-next-line no-undef
    const template = Handlebars.templates['header.hbs'];
    const isOk = await cookie.hasCookie();

    console.log(isOk);
    const ctx = {
      is_user_login: isOk,
      // is_user_login: true,
      user_type: {
        app: true,
      },
    };
    document.querySelector('header').innerHTML = template(ctx);

    this.addEventListeners();
  }

  addEventListenerWrapper(
    obj,
    type,
    listener,
    useCapture = false,
    options = {},
  ) {
    obj.addEventListener(type, listener, useCapture, options);
    this.eventListeners[obj] = {
      listener,
      useCapture,
      options,
    };
  }

  async addEventListeners() {
    const links = document.querySelectorAll('.navbar-item a');
    // eslint-disable-next-line no-unused-vars
    links.forEach((link, i) => {
      this.addEventListenerWrapper(link, 'click', (e) => {
        e.preventDefault();
        router.goToLink(getHrefFromA(link));
      });
    });

    const logo_link = document.querySelector('.navbar-logo a');
    logo_link.addEventListener('click', (e) => {
      e.preventDefault();
      router.goToLink(getHrefFromA(logo_link));
    }) 

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

  remove() {
    // this.eventListeners.forEach((elem, ))
    // console.log(this.eventListeners);
  }
}
