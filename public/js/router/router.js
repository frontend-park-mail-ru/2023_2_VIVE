import appAuthView from "../jsviews/appAuthView"
import empAuthView from "../jsviews/empAuthView.js";
import menuView from "../jsviews/menuView.js";

export default class Router {
    constructor() {
        this.routes = {
            '/app_login': 'appAuth',
            '/emp_login': 'empAuth',
        };

        this.objs = {
            appAuth: new appAuthView(),
            empAuth: new empAuthView(),
            menu: new menuView(),
        };
    };

    goToLink(url) {
        if (url in this.routes) {
            this.objs[this.routes[url]].render();
        } else {
            console.error(`Такого адреса не существует: ${url}`);
        }
    }
}

export const router = new Router();
