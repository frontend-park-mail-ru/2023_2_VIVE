import authView from '../jsviews/authView.js';
import menuView from '../jsviews/menuView.js';
import regView from '../jsviews/regView.js';
import vacsView from '../jsviews/vacsView.js';

class Router {
  constructor() {
    this.routes = {
      '/app_login': 'appAuth',
      '/emp_login': 'empAuth',
      '/app_reg': 'appReg',
      '/emp_reg': 'empReg',
      '/': 'vacs',
    };

    this.objs = {
      vacs: new vacsView(),
      appAuth: new authView('app'),
      empAuth: new authView('emp'),
      appReg: new regView('app'),
      empReg: new regView('emp'),
      menu: new menuView(),
    };

    this.lastUrl = '';
  }

  async goToLink(url) {
    // if (url == this.lastUrl) {
    //   return;
    // }
    if (url in this.routes) {
      if (this.lastUrl) {
        this.objs[this.routes[url]].remove();
      }

      this.lastUrl = url;
      this.objs['menu'].render();
      this.objs[this.routes[url]].render();
    } else {
      console.error(`Такого адреса не существует: ${url}`);
    }
  }

  get curUrl() {
    return this.lastUrl;
  }
}

const router = new Router();
export default router;
