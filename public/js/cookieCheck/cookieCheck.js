import APIConnector from "../../modules/APIConnector.js";
import { router } from "../router/router.js";
import { BACKEND_SERVER_URL } from "../../../config/config.js";

export default class CookieCheck {
    constructor() {
        this.urlWithoutCookie = {
            "/app_reg": "/app_reg",
            "/app_login": "/app_login",
            "/emp_reg": "/emp_reg",
            "/emp_login": "/emp_login",
        }
    }

    async checkPathForNoCookie(url) {
        if ((await this.hasCookie()) && url in this.urlWithoutCookie) {
            router.goToLink('/');
            return;
        }
        router.goToLink(url);
    }

    async hasCookie() {
        try {
            const resp = await APIConnector.get(BACKEND_SERVER_URL + "/session");
            return resp.status === 200;
        } catch(err) {
            return false;
        }
    }
}

export const cookie = new CookieCheck();
