import { BACKEND_SERVER_URL } from '../../../config/config.js';
import APIConnector from '../../modules/APIConnector.js';
import router from '../router/router.js';
import { getHrefFromA } from '../utils.js';
import { formIsValid } from './formValidation.js';
import Handlebars from "handlebars";

export default class empRegView {
  render() {
    console.log('rendering appReg');
    this.compileTemplates();
    this.addEventListeners();
  }

  compileTemplates() {
    const template = Handlebars.templates['form_login_reg.hbs'];
    document.querySelector('main').innerHTML = template(this.getContext());
  }

  getContext() {
    return {
      'role': 'emp',
      'form_type': 'reg',
      'inputs': [
        {
          'type': 'text',
          'name': 'first_name',
          'placeholder': 'Имя',
        },
        {
          'type': 'text',
          'name': 'last_name',
          'placeholder': 'Фамилия',
        },
        {
          'type': 'text',
          'name': 'company_name',
          'placeholder': 'Название компании',
        },
        {
          'type': 'text',
          'name': 'email',
          'placeholder': 'Электронная почта',
        },
        {
          'type': 'password',
          'name': 'password',
          'placeholder': 'Придумайте пароль',
        },
        {
          'type': 'password',
          'name': 'repeat_password',
          'placeholder': 'Повторите пароль',
        }
      ]
    };
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

    let form = document.querySelector('.reg-form');
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      let formData = this.getFormObject(new FormData(form));

      if (formIsValid(formData, { is_reg: true })) {
        this.sendForm(formData);
        router.goToLink('/');
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

  sendForm(formData) {
    formData['role'] = 'employer';
    delete formData['repeat_password'];
    delete formData['remember_password'];
    APIConnector.post(BACKEND_SERVER_URL + '/users', formData)
      .then((resp) => {
        console.log(resp.status);
      })
      .catch((err) => {
        console.error(err);
      });
  }

  removeEventListeners() {}

  remove() {}
}
