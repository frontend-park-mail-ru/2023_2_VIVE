import APIConnector from "../../modules/APIConnector.js";
import { router } from "../router/router.js";
import { BACKEND_SERVER_URL } from "../../../config/config.js";

export default class CookieCheck {
    constructor() {
        this.urlWithoutCookie = {
            app_reg: '/app_reg',
            app_in: '/app_in',
            emp_reg: '/emp_reg',
            emp_in: '/emp_in',
        }
    }

    checkPathForNoCookie(url) {
        if (this.hasCookie() && url in this.urlWithoutCookie) {
            router.goToLink('/');
            return;
        }
        router.goToLink(url);
    }

    hasCookie() {
        APIConnector.get(BACKEND_SERVER_URL + "/session")
            .then((resp) => {
                return resp.status == 200;
            })
            .catch((err) => {
                console.error(err);
                return false;
            });
    }
}

export const cookie = new CookieCheck();
