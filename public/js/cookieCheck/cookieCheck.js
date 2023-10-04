import APIConnector from "../../modules/APIConnector.js";
import { router } from "../router/router.js";

const config = {
    ip: "http://212.233.90.231:8081"
};

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
        APIConnector.get(config.ip + "/session")
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
