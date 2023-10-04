import APIConnector from '../../modules/APIConnector.js';
import { router } from '../router/router.js';
import Validator from '../../modules/validator.js';
import { BACKEND_SERVER_URL } from '../../../config/config.js';

const validator = new Validator();

export default class appRegView {
  render() {
    console.log('rendering appReg');
    const template = Handlebars.templates['app_reg.hbs'];
    document.querySelector('main').innerHTML = template();
    this.addEventListeners();
  }

  addEventListeners() {
    let elipse_btn = document.querySelector('.elipse-button');
    elipse_btn.addEventListener(
      'click',
      function (e) {
        e.preventDefault();
        router.goToLink('/emp_reg');
      },
      { once: true }
    );

    let form = document.querySelector('.reg-form');
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      let formData = new FormData(form);

      let formObject = {};
      formData.forEach((value, key) => (formObject[key] = value));
      console.log(formObject);

      const errors = validator.validateRegistrationForm(formObject);

      if (errors == {}) {
        formObject['role'] = 'applicant';
        delete formObject['repeat_password'];
        delete formObject['remember_password'];
        console.log(formObject);

        APIConnector.post(BACKEND_SERVER_URL + '/users', formObject)
          .then((resp) => {
            console.log(resp.status);
          })
          .catch((err) => {
            console.error(err);
          });
      } else {
        console.log(errors);
      }
    });
  }

  removeEventListeners() {}

  remove() {}
}
