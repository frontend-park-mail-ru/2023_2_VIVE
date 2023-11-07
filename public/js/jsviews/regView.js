import APIConnector from '../modules/APIConnector.js';
import router from '../modules/router.js';
import { BACKEND_SERVER_URL } from '../../../config/config.js';
import { getHrefFromA } from '../utils.js';
import { formIsValid } from './formValidation.js';

export default class regView {
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
        form_type: 'reg',
        inputs: [
          {
            type: 'text',
            name: 'first_name',
            placeholder: 'Имя',
          },
          {
            type: 'text',
            name: 'last_name',
            placeholder: 'Фамилия',
          },
          {
            type: 'text',
            name: 'email',
            placeholder: 'Электронная почта',
          },
          {
            type: 'password',
            name: 'password',
            placeholder: 'Придумайте пароль',
          },
          {
            type: 'password',
            name: 'repeat_password',
            placeholder: 'Повторите пароль',
          },
        ],
      };
    } else {
      return {
        role: 'emp',
        form_type: 'reg',
        inputs: [
          {
            type: 'text',
            name: 'first_name',
            placeholder: 'Имя',
          },
          {
            type: 'text',
            name: 'last_name',
            placeholder: 'Фамилия',
          },
          {
            type: 'text',
            name: 'company_name',
            placeholder: 'Название компании',
          },
          {
            type: 'text',
            name: 'email',
            placeholder: 'Электронная почта',
          },
          {
            type: 'password',
            name: 'password',
            placeholder: 'Придумайте пароль',
          },
          {
            type: 'password',
            name: 'repeat_password',
            placeholder: 'Повторите пароль',
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

      if (formIsValid(form, formData, { is_reg: true })) {
        if (await this.sendForm(formData)) {
          router.goToLink('/');
        } else {
          const form_error = form.querySelector('.form__error');
          form_error.textContent = 'Неверная электронная почта или пароль';
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
    formData['role'] = this.role == 'app' ? 'applicant' : 'employer';
    console.log(formData);
    delete formData['repeat_password'];
    delete formData['remember_password'];
    try {
      const resp = await APIConnector.post(
        BACKEND_SERVER_URL + '/users',
        formData,
      );
      console.log(this.role + '_reg: ', resp.status);
      return true;
    } catch (err) {
      console.error(this.role + '_reg: ', err);
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
