import { router } from "../router/router.js";


export default class empRegView {

  render() {
    console.log('rendering empReg')
    const template = Handlebars.templates['emp_reg.hbs'];
    document.querySelector('main').innerHTML = template();
    this.addEventListeners();
  }

  addEventListeners() {
    let elipse_btn = document.querySelector('.elipse-button');
    elipse_btn.addEventListener('click', function(e) {
      e.preventDefault();
      router.goToLink('/app_reg')
    }, { once: true })
  }

  removeEventListeners() {

  }

  remove() {

  }
}
