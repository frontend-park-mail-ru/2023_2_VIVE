import APIConnector from "../../modules/APIConnector.js";
import { router } from "../router/router.js";

const config = {
  ip: 'http://212.233.90.231:8081'
}

export default class appRegView {
  render() {
    console.log("rendering appReg");
    const template = Handlebars.templates["app_reg.hbs"];
    document.querySelector("main").innerHTML = template();
    this.addEventListeners();
  }

  addEventListeners() {
    let elipse_btn = document.querySelector(".elipse-button");
    elipse_btn.addEventListener(
      "click",
      function (e) {
        e.preventDefault();
        router.goToLink("/emp_reg");
      },
      { once: true }
    );

    let form = document.querySelector(".reg-form");
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      let formData = new FormData(form);

      let formObject = {};
      formData.forEach(function (value, key) {
        formObject[key] = value;
      });

      formObject['role'] = 'applicant';
      delete formObject['repeat_password'];
      delete formObject['remember_password'];
      console.log(formObject);
      APIConnector.post(config.ip + '/users', formObject).then((resp) => {
        console.log(resp.status);
      }).catch(err => {
        console.error(err);
      })
    });
  }

  removeEventListeners() {}

  remove() {}
}
