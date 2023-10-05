import { BACKEND_SERVER_URL } from '../../../config/config.js';
import APIConnector from '../../modules/APIConnector.js';
import { router } from '../router/router.js';
import { getHrefFromA } from '../utils.js';
import { formIsValid } from './formValidation.js';

export default class empRegView {
  render() {
    console.log('rendering empReg');
    const template = Handlebars.templates['emp_reg.hbs'];
    document.querySelector('main').innerHTML = template();
    this.addEventListeners();
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
