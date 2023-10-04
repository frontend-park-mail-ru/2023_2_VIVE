import { BACKEND_SERVER_URL } from "../../../config/config.js";
import APIConnector from "../../modules/APIConnector.js";

export default class vacsView {
  async render() {
    console.log("rendering vacs");
    const template = Handlebars.templates["vacs.hbs"];
    const data = await this.getVacancies();
    // const data = [{
    //   'name': 'dsfaf',
    //   'company_name': 'fdsa',
    //   'description': 'regggerg',
    //   'salary': 100,

    // }, 
    // {
    //   'name': 'dsfaf',
    //   'company_name': 'fdsa',
    //   'description': 'sdffas',
    //   'salary': 100,

    // }]
    console.log(data);
    document.querySelector("main").innerHTML = template({
      'data': data,
    });
    this.addEventListeners();
  }

  async getVacancies() {
    return await APIConnector.get(BACKEND_SERVER_URL + "/vacancies")
      .then(async (resp) => {
        return await resp.json();
      }).then(data => {
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
