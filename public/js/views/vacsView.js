
import { BACKEND_SERVER_URL } from '../../../config/config.js';
import APIConnector from '../modules/APIConnector.js';
import View from './view.js';

export default class vacsView extends View {

  async render() {
    super.render();
    const data = await this.getVacancies();

    // eslint-disable-next-line no-undef
    const template = Handlebars.templates['vacs'];
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
      const data = await resp.json();
      console.log(data);
      return data;
    } catch (err) {
      console.error(err);
      return undefined;
    }
  }
  
  addEventListeners() {
    super.addEventListeners();

    const descriptionText = document.querySelectorAll('.vacs__list__item__desc__prev');

    descriptionText.forEach(description => {
      description.textContent = description.textContent.substring(0, 300) + "...";
    })
  }
}
