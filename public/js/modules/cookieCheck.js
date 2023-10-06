import APIConnector from './APIConnector.js';
import router from './router.js';
import { BACKEND_SERVER_URL } from '../../../config/config.js';

/**
 * Класс CookieCheck для проверки кук и перехода по URL
 * @class
 */
export default class CookieCheck {
  /**
   * Конструктор класса CookieCheck
   * @constructor
   * @param {Object} urlWithoutCookie - переменная, хранящая URL, на которые нельзя переходить, если пользователь авторизирован (имеется cookie)
   */
  constructor() {
    this.urlWithoutCookie = {
      '/app_reg': '/app_reg',
      '/app_login': '/app_login',
      '/emp_reg': '/emp_reg',
      '/emp_login': '/emp_login',
    };
  }

  /**
   * Функция для проверки URL на предмет перехода по текущему адресу
   * @param {String} url - текущий адрес, на котором находится пользователь
   * @returns {Promise<void>} 
   */
  async checkPathForNoCookie(url) {
    if (url in this.urlWithoutCookie && (await this.hasCookie())) {
      await router.goToLink('/');
      return;
    }
    await router.goToLink(url);
  }

  /**
   * Функция для проверки того, имеет ли пользователь cookie
   * @returns {Boolean}
   */
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
