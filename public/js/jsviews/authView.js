import { BACKEND_SERVER_URL } from '../../../config/config.js';
import APIConnector from '../modules/APIConnector.js';
import router from '../modules/router.js';
import { getHrefFromA } from '../utils.js';
import { formIsValid } from './formValidation.js';

export default class authView {
  /**
   * Конструктор для создания класса, который обрабатывает страницу
   * @constructor
   * @param {string} role - роль пользователя('app', 'emp')
   */
  constructor(role) {
    this.role = role;
  }

  /**
   * Основной метод класса, который отображает все необходимое после открытия страницы
   */
  render() {
    this.compileTemplates();
    this.addEventListeners();
  }

  /**
   * Метод, который компилирует шаблон с данными
   */
  compileTemplates() {
    // eslint-disable-next-line no-undef
    const template = Handlebars.templates['form_login_reg.hbs'];
    document.querySelector('main').innerHTML = template(this.getContext());
  }

  /**
   * Метод для создания контекста шаблона
   * @param {string} role - роль пользователя('app', 'emp')
   * @returns {Object} объект с данными в зависимости от роли
   */
  getContext() {
    if (this.role == 'app') {
      return {
        role: 'app',
        form_type: 'login',
        inputs: [
          {
            type: 'text',
            name: 'email',
            placeholder: 'Электронная почта(соискатель)',
          },
          {
            type: 'password',
            name: 'password',
            placeholder: 'Пароль',
          },
        ],
      };
    } else {
      return {
        role: 'emp',
        form_type: 'login',
        inputs: [
          {
            type: 'text',
            name: 'email',
            placeholder: 'Электронная почта(компания)',
          },
          {
            type: 'password',
            name: 'password',
            placeholder: 'Пароль',
          },
        ],
      };
    }
  }

  /**
   * Метод, добавляющий обработчики событий на страницу
   */
  addEventListeners() {
    const elipse_link = document.querySelector('.elipse-button');
    elipse_link.addEventListener(
      'click',
      function (e) {
        e.preventDefault();
        router.goToLink(getHrefFromA(elipse_link));
      },
      { once: true },
    );

    const switch_link = document.querySelector('.form-type-switch-link');
    switch_link.addEventListener('click', (e) => {
      e.preventDefault();
      router.goToLink(getHrefFromA(switch_link));
    }) 

    const form = document.querySelector('.reg-form');
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const formData = this.getFormObject(new FormData(form));

      if (formIsValid(formData, { is_login: true })) {
        if (await this.sendForm(formData)) {
          router.goToLink('/');
        } else if (document.getElementsByClassName('form-error').length == 0) {
          const err = document.createElement('div');
          err.classList.add('reg-text', 'form-error');
          err.textContent = 'Неверная электронная почта или пароль';

          const toggler = document.getElementById('toggler');
          toggler.after(err);
        }
      }
    });
  }

  /**
   * Метод, получающий объект данных формы
   * @returns {Object} объект с данными формы
   */
  getFormObject(formData) {
    const formObject = {};
    formData.forEach(function (value, key) {
      formObject[key] = value;
    });
    return formObject;
  }

  /**
   * Асинхронный метод, отправляющий данные формы
   * @returns {boolean} true - если отправилась успешно, false - иначе
   */
  async sendForm(formData) {
    delete formData['remember_password'];
    formData['role'] = this.role == 'app' ? 'applicant' : 'employer';
    console.log(formData);

    try {
      const resp = await APIConnector.post(
        BACKEND_SERVER_URL + '/session',
        formData,
      );
      console.log(resp.status);
      return true;
    } catch (err) {
      console.error(err);
      return false;
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
