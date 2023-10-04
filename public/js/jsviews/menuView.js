import { cookie } from "../cookieCheck/cookieCheck.js";
import { router } from "../router/router.js";
import { getHrefFromA } from "../utils.js";

export default class menuView {
  constructor() {
    this.eventListeners = {
      // obj: {
      //   listener: ...,
      //   type: ...,
      //   options: ...,
      //   useCapture: ...,
      // }
    };
  }

  render() {
    const template = Handlebars.templates["header.hbs"];
    let ctx = {
      is_user_login: cookie.hasCookie(),
      user_type: {
        app: true
      }
    };
    document.querySelector("header").innerHTML = template(ctx);

    this.addEventListeners();
  }

  addEventListenerWrapper(
    obj,
    type,
    listener,
    useCapture = false,
    options = {}
  ) {
    obj.addEventListener(type, listener, useCapture, options);
    this.eventListeners[obj] = {
      listener,
      useCapture,
      options
    };
  }

  addEventListeners() {
    let links = document.querySelectorAll(".navbar-item a");
    links.forEach((link, i) => {
      this.addEventListenerWrapper(link, "click", (e) => {
        e.preventDefault();
        router.goToLink(getHrefFromA(link));
      });
    });
  }

  remove() {
    // this.eventListeners.forEach((elem, ))
    // console.log(this.eventListeners);
  }

  remove() {
    
  }
}
