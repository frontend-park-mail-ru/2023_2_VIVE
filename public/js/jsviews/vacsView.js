import { BACKEND_SERVER_URL } from "../../../config/config.js";
import APIConnector from "../../modules/APIConnector.js";
import { router } from "../router/router.js";

export default class vacsView {
  render() {
    console.log("rendering vacs");
    const template = Handlebars.templates["vacs.hbs"];
    let data = this.getVacancies();
    document.querySelector("main").innerHTML = template(data);
    this.addEventListeners();
  }

  getVacancies() {
    return APIConnector.get(BACKEND_SERVER_URL + '/vacancies')
    .then(resp => resp.json())
    // .then(json => json)
    .catch(error => console.error(error));
  }

  addEventListeners() {
    // let elipse_btn = document.querySelector(".elipse-button");
    // elipse_btn.addEventListener(
    //   "click",
    //   function (e) {
    //     e.preventDefault();
    //     router.goToLink("/emp_login");
    //   },
    //   { once: true }
    // );
  }

  removeEventListeners() {}

  remove() {}
}
