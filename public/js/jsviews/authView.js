import { BACKEND_SERVER_URL } from '../../../config/config.js';
import APIConnector from '../../modules/APIConnector.js';
import router from '../router/router.js';
import { getHrefFromA } from '../utils.js';
import { formIsValid } from './formValidation.js';

export default class authView {
  render(role) {
    this.compileTemplates();
    this.addEventListeners();
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

      if (formIsValid(formData, { is_login: true })) {
        if (await this.sendForm(formData)) {
          router.goToLink('/');
        } else {
          // ...
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
    delete formData['remember_password'];
    console.log(formData);

    try {
      let resp = await APIConnector.post(
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

  removeEventListeners() {}

  remove() {}
}
