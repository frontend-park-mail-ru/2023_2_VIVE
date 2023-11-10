import APIConnector from '../modules/APIConnector.js';
import router from '../modules/router.js';
import { BACKEND_SERVER_URL } from '../../../config/config.js';
import { getHrefFromLink, getFormObject } from '../utils.js';
import { formIsValid } from './formValidation.js';
import View from './view.js';

export default class regView extends View {
  /**
   * Конструктор для создания класса, который обрабатывает страницу
   * @constructor
   * @param {string} role - роль пользователя('app', 'emp')
   */
  constructor(role) {
    super();
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
        form_type: 'reg',
      };
    } else {
      return {
        role: 'emp',
        form_type: 'reg',
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
        router.goToLink(getHrefFromLink(link));
      })
    })

    const form = document.querySelector('.form');
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const formData = getFormObject(new FormData(form));

      if (formIsValid(form, formData, { is_reg: true })) {
        if (await this.sendForm(formData)) {
          router.goToLink('/');
        } else {
          const form_error = form.querySelector('.form__error');
          form_error.textContent = 'Пользователь с такой электронной почтой уже зарегистрирован';
          if (form_error.classList.contains('d-none')) {
            form_error.classList.remove('d-none');
          }
        }

        // else {
        //   const emailInput = document.querySelector("input[name='email']");
        //   const existErrorNode = emailInput.parentNode.querySelector('.input__error-msg');
        //   if (!existErrorNode) {
        //     const errorNode = document.createElement('div');
        //     errorNode.classList.add('input-error-msg');
        //     errorNode.textContent = "Пользователь с такой почтой уже существует";
        //     emailInput.parentNode.appendChild(errorNode);

        //     emailInput.classList.add('input-in-error');
        //   }
        // }
      }
    });
  }

  /**
   * Асинхронный метод, отправляющий данные формы
   * @returns {boolean} true - если отправилась успешно, false - иначе
   */
  async sendForm(formData) {
    formData['role'] = this.role == 'app' ? 'applicant' : 'employer';
    console.log(formData);
    delete formData['repeat_password'];
    delete formData['remember_password'];
    console.log(formData);
    try {
      const resp = await APIConnector.post(
        BACKEND_SERVER_URL + '/users',
        formData,
      );
      return resp.ok;
    } catch (err) {
      return false;
    }
  }
}
