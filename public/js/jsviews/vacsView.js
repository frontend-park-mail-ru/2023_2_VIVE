
import { BACKEND_SERVER_URL } from '../../../config/config.js';
import APIConnector from '../modules/APIConnector.js';

export default class vacsView {
  /**
   * Асинхронный метод для отображения страницы
   */
  async render() {
    console.log('rendering vacs');
    
    const data = await this.getVacancies();

    // eslint-disable-next-line no-undef
    const template = Handlebars.templates['vacs.hbs'];
    document.querySelector('main').innerHTML = template({
      data: data,
    });

    this.addEventListeners();
  }

  /**
   * Асинхронный метод для получения вакансий
   * @returns {Object} объект с вакансиями, если успешно; undefined в случае ошибки
   */
  async getVacancies() {
    try {
      const resp = await APIConnector.get(BACKEND_SERVER_URL + '/vacancies');
      return await resp.json();
    } catch (err) {
      console.error(err);
      return undefined;
    }
  }

  /**
   * Метод, добавляющий обработчики событий на страницу
   */
  addEventListeners() {}

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
