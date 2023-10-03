import { router } from "../router/router.js";

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
      console.log(this);
      let formData = new FormData(form);

      let formObject = {};
      formData.forEach(function (value, key) {
        formObject[key] = value;
      });

      console.log(formObject);
    });
  }

  removeEventListeners() {}

  remove() {}
}
