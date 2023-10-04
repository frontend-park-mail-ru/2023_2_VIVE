import { router } from "../router/router.js";
import { getHrefFromA } from "../utils.js";


export default class empRegView {

  render() {
    console.log('rendering empReg')
    const template = Handlebars.templates['emp_reg.hbs'];
    document.querySelector('main').innerHTML = template();
    this.addEventListeners();
  }

  addEventListeners() {
    let elipse_link = document.querySelector('.elipse-button');
    elipse_link.addEventListener('click', function(e) {
      e.preventDefault();
      router.goToLink(getHrefFromA(elipse_link))
    }, { once: true })
  }

  removeEventListeners() {

  }

  remove() {

  }
}
