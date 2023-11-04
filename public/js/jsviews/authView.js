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
    const template = Handlebars.templates['form_login_reg'];
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
    const links = document.querySelectorAll('.js-link');
    links.forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        router.goToLink(getHrefFromA(link));
      }) 
    })

    const form = document.querySelector('.form');
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const formData = this.getFormObject(new FormData(form));

      if (formIsValid(form, formData, { is_login: true })) {
        if (await this.sendForm(formData)) {
          router.goToLink('/');
        } else {
          const form_error = form.querySelector('.form__error');
          form_error.textContent = 'Неверная электронная почта или пароль';
          if (form_error.classList.contains('d-none')) {
            form_error.classList.remove('d-none');
          }
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
