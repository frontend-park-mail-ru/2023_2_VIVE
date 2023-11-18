import { BACKEND_SERVER_URL } from '../../../config/config.js';
import APIConnector from '../modules/APIConnector.js';
import router from "../modules/router/router.js";
import Store from './Store.js';

class UserStore extends Store {
    constructor() {
        super();
        this.login = false;
        this.user = false;
    }

    ROLES = {
        app: 'applicant',
        emp: 'employer',
    }

    async updateUser() {
        await this.reqLogin();
        if (this.login) {
            await this.reqUser();
        } else {
            this.user = undefined;
        }
    }

    async reqLogin() {
        try {
            let resp = await APIConnector.get(BACKEND_SERVER_URL + '/session');
            this.login = resp.ok;
        } catch (err) {
            this.login = false;
        }
    }

    async reqUser() {
        try {
            const resp = await APIConnector.get(BACKEND_SERVER_URL + "/current_user");
            this.user = await resp.json();
        } catch (err) {
            this.user = undefined;
        }
    }

    isLoggedIn() {
        return this.login;
    }
    
    getUser() {
        return this.user;
    }

    async logout() {
        try {
            const resp = await APIConnector.delete(BACKEND_SERVER_URL + '/session');
            return resp.ok;
        } catch (err) {
            console.error(err);
            return false;
        }
    }

    async isUrlAvailable(url) {
        // if (url in this.urlWithoutCookie && (await this.hasCookie())) {
        //     await router.goToLink('/');
        //     return;
        // }
        // await router.goToLink(url);
    }
}


const User = new UserStore();
export default User;
