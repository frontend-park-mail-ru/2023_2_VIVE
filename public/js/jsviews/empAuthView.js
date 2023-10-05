import { BACKEND_SERVER_URL } from "../../../config/config.js";
import APIConnector from "../../modules/APIConnector.js";
import router from "../router/router.js";
import { getHrefFromA } from "../utils.js";
import { formIsValid } from "./formValidation.js";
import Handlebars from "handlebars";

export default class empAuthView {
  render() {
    console.log('rendering empAuth');
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
      'form_type': 'login',
      'inputs': [
        {
          'type': 'text',
          'name': 'email',
          'placeholder': 'Электронная почта(компания)',
        },
        {
          'type': 'password',
          'name': 'password',
          'placeholder': 'Пароль',
        }
      ]
    };
  }
  

  addEventListeners() {
    let elipse_link = document.querySelector('.elipse-button');
    elipse_link.addEventListener('click', function(e) {
      e.preventDefault();
      router.goToLink(getHrefFromA(elipse_link))
    }, { once: true })

    let form = document.querySelector(".reg-form");
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      let formData = this.getFormObject(new FormData(form));

      if (formIsValid(formData, {is_login: true})) {
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
    delete formData["remember_password"];
    console.log(formData);
    APIConnector.post(BACKEND_SERVER_URL + "/session", formData)
      .then((resp) => {
        console.log(resp.status);
      })
      .catch((err) => {
        console.error(err);
      });
  }

  removeEventListeners() {}

  remove() {

  }
}
