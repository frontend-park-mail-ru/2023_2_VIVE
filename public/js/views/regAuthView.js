import { BACKEND_SERVER_URL } from '../../../config/config.js';
import APIConnector from '../modules/APIConnector.js';
import router from '../modules/router.js';
import { getHrefFromLink, getFormObject } from '../utils.js';
import View from './view.js';
import regAuthStore from '../stores/RegAuthStore.js';

export default class regAuthView extends View {
  /**
   * Конструктор для создания класса, который обрабатывает страницу
   * @constructor
   * @param {string} type - роль пользователя('auth', 'reg')
   * @param {string} role - роль пользователя('app', 'emp')
   */
  constructor(type, role) {
    super();
    this.form_type = type;
    this.role = role;

  }

  /**
   * Основной метод класса, который отображает все необходимое после открытия страницы
   */
  render() {
    super.render();
    regAuthStore.sendType(this.form_type, this.role);
    this.compileTemplates();
    this.addEventListeners();
  }

  /**
   * Метод, который компилирует шаблон с данными
   */
  compileTemplates() {
    // eslint-disable-next-line no-undef
    const template = Handlebars.templates['form_login_reg'];
    document.querySelector('main').innerHTML = template(regAuthStore.getContext());
  }


  /**
   * Метод, добавляющий обработчики событий на страницу
   */
  addEventListeners() {
    super.addEventListeners();
    
    const form = document.querySelector('.form');
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      regAuthStore.sendForm(getFormObject(new FormData(form)));
      this.render();
    });
  }
}
