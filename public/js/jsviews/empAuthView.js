import { router } from "../router/router.js";
import { getHrefFromA } from "../utils.js";


export default class empAuthView {

  render() {
    console.log('rendering empAuth')
    const template = Handlebars.templates['emp_login.hbs'];
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

  remove() {

  }
}
