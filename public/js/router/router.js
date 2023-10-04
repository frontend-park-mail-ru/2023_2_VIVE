import appAuthView from "../jsviews/appAuthView.js";
import appRegView from "../jsviews/appRegView.js";
import empAuthView from "../jsviews/empAuthView.js";
import empRegView from "../jsviews/empRegView.js";
import menuView from "../jsviews/menuView.js";
import vacsView from "../jsviews/vacsView.js";

export default class Router {
  constructor() {
    this.routes = {
      "/app_login": "appAuth",
      "/emp_login": "empAuth",
      "/app_reg": "appReg",
      "/emp_reg": "empReg",
      "/": "vacs"
    };

    this.objs = {
      vacs: new vacsView(),
      appAuth: new appAuthView(),
      empAuth: new empAuthView(),
      appReg: new appRegView(),
      empReg: new empRegView(),
      menu: new menuView()
    };

    this.lastUrl = "";
  }

  goToLink(url) {
    if (url == this.lastUrl) {
      return;
    }
    if (url in this.routes) {
      if (this.lastUrl) {
        this.objs[this.routes[url]].remove()
      }
      this.objs[this.routes[url]].render();
      this.objs["menu"].render();
    } else {
      console.error(`Такого адреса не существует: ${url}`);
    }
  }

  get curUrl() {
    return this.lastUrl;
  }
}

export const router = new Router();
