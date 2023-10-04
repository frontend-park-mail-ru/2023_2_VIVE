import { BACKEND_SERVER_URL } from "../../../config/config.js";
import APIConnector from "../../modules/APIConnector.js";
import { router } from "../router/router.js";

export default class vacsView {
  render() {
    console.log("rendering vacs");
    const template = Handlebars.templates["vacs.hbs"];
    const data = this.getVacancies();
    console.log(data);
    document.querySelector("main").innerHTML = template(data);
    this.addEventListeners();
  }

  async getVacancies() {
    return await APIConnector.get(BACKEND_SERVER_URL + "/vacancies")
      .then(async (resp) => {
        const data = await response.json();
        return data;
      })
      .catch((err) => {
        console.error(err);
        return undefined;
      });
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
