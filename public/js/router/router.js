import appAuthView from "../jsviews/appAuthView.js";
import appRegView from "../jsviews/appRegView.js";
import empAuthView from "../jsviews/empAuthView.js";
import empRegView from "../jsviews/empRegView.js";
import menuView from "../jsviews/menuView.js";

export default class Router {
  constructor() {
    this.routes = {
      "/app_login": "appAuth",
      "/emp_login": "empAuth",
      "/app_reg": "appReg",
      "/emp_reg": "empReg"
    };

    this.objs = {
      appAuth: new appAuthView(),
      empAuth: new empAuthView(),
      appReg: new appRegView(),
      empReg: new empRegView(),
      menu: new menuView()
    };

    this.lastUrl = "";
  }

  goToLink(url) {
    if (url in this.routes) {
      this.lastUrl
        ? this.objs[this.routes[url]].remove()
        : (this.lastUrl = url);
      this.objs[this.routes[url]].render();
      this.objs["menu"].render();
    } else {
      console.error(`Такого адреса не существует: ${url}`);
    }
  }
}

export const router = new Router();
