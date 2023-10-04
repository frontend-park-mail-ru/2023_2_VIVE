import { BACKEND_SERVER_URL } from "../../../config/config.js";
import APIConnector from "../../modules/APIConnector.js";
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

  async render() {
    const template = Handlebars.templates["header.hbs"];
    let ctx = {
      // is_user_login: await cookie.hasCookie(),
      is_user_login: true,
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

    let logout_btn = document.querySelector(".logout-btn");
    logout_btn.addEventListener('click', function(e) {
      e.preventDefault();
      APIConnector.delete(BACKEND_SERVER_URL + '/session')
      .then(()=>router.goToLink('/'))
      .catch(err => console.error(err));
    });
  }

  remove() {
    // this.eventListeners.forEach((elem, ))
    // console.log(this.eventListeners);
  }

  remove() {
    
  }
}
