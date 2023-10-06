import APIConnector from './APIConnector.js';
import router from './router.js';
import { BACKEND_SERVER_URL } from '../../../config/config.js';

export default class CookieCheck {
  constructor() {
    this.urlWithoutCookie = {
      '/app_reg': '/app_reg',
      '/app_login': '/app_login',
      '/emp_reg': '/emp_reg',
      '/emp_login': '/emp_login',
    };
  }

  async checkPathForNoCookie(url) {
    if (url in this.urlWithoutCookie && (await this.hasCookie())) {
      await router.goToLink('/');
      return;
    }
    await router.goToLink(url);
  }

  async hasCookie() {
    try {
      let resp = await APIConnector.get(BACKEND_SERVER_URL + '/session');
      return resp.status == 200;
    } catch (err) {
      // console.error('Error in hasCookie', err);
      return false;
    }
  }
}

export const cookie = new CookieCheck();
