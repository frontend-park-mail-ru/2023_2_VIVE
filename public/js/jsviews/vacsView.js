import { router } from "../router/router.js";

export default class vacsView {
  render() {
    console.log("rendering vacs");
    const template = Handlebars.templates["vacs.hbs"];
    document.querySelector("main").innerHTML = template();
    this.addEventListeners();
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
