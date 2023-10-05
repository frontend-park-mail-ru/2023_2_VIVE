import APIConnector from '../../modules/APIConnector.js';
import router from '../router/router.js';
import { BACKEND_SERVER_URL } from '../../../config/config.js';
import { getHrefFromA } from '../utils.js';
import { formIsValid } from './formValidation.js';

export default class regView {
  render(role) {
    this.compileTemplates(role);
    this.addEventListeners(role);
    this.role = role;
  }

  compileTemplates() {
    const template = Handlebars.templates['form_login_reg.hbs'];
    document.querySelector('main').innerHTML = template(this.getContext());
  }

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

  addEventListeners() {
    let elipse_link = document.querySelector('.elipse-button');
    elipse_link.addEventListener(
      'click',
      function (e) {
        e.preventDefault();
        router.goToLink(getHrefFromA(elipse_link));
      },
      { once: true },
    );

    let switch_link = document.querySelector('.form-type-switch-link');
    switch_link.addEventListener('click', (e) => {
      e.preventDefault();
      router.goToLink(getHrefFromA(switch_link));
    }) 

    let form = document.querySelector('.reg-form');
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      let formData = this.getFormObject(new FormData(form));

      if (formIsValid(formData, { is_reg: true })) {
        if (await this.sendForm(formData)) {
          router.goToLink('/');
        }
      }
    });
  }

  getFormObject(formData) {
    let formObject = {};
    formData.forEach(function (value, key) {
      formObject[key] = value;
    });
    return formObject;
  }

  async sendForm(formData) {
    formData['role'] = this.role == 'app' ? 'applicant' : 'employer';
    delete formData['repeat_password'];
    delete formData['remember_password'];
    try {
      let resp = await APIConnector.post(
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

  removeEventListeners() {}

  remove() {}
}
