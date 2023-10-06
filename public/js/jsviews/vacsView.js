
import { BACKEND_SERVER_URL } from '../../../config/config.js';
import APIConnector from '../modules/APIConnector.js';

export default class vacsView {
  async render() {
    console.log('rendering vacs');
    // eslint-disable-next-line no-undef
    const template = Handlebars.templates['vacs.hbs'];
    const data = await this.getVacancies();
    document.querySelector('main').innerHTML = template({
      data: data,
    });
    this.addEventListeners();
  }

  async getVacancies() {
    try {
      const resp = await APIConnector.get(BACKEND_SERVER_URL + '/vacancies');
      return await resp.json();
    } catch (err) {
      console.error(err);
      return undefined;
    }
  }

  addEventListeners() {}

  removeEventListeners() {}

  remove() {}
}
