import { router } from "../router/router.js";


export default class empAuthView {

  render() {
    console.log('rendering empAuth')
    const template = Handlebars.templates['emp_login.hbs'];
    document.querySelector('main').innerHTML = template();
    this.addEventListeners();
  }

  addEventListeners() {
    let elipse_btn = document.querySelector('.elipse-button');
    elipse_btn.addEventListener('click', function(e) {
      e.preventDefault();
      router.goToLink('/app_login')
    }, { once: true })
  }

  remove() {

  }
}
