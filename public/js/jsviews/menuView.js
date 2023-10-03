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
      is_user_login: false,
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
    let btns = document.querySelectorAll(".navbar-btn");
    btns.forEach((elem, i) => {
      this.addEventListenerWrapper(elem, "click", (e) => {
        e.preventDefault();
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
