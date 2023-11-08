import { BACKEND_SERVER_URL } from '../../../config/config.js';
import APIConnector from '../modules/APIConnector.js';
import router from '../modules/router.js';

class UserStore {
    constructor() {

    }

    async isLoggedIn() {
        try {
            let resp = await APIConnector.get(BACKEND_SERVER_URL + '/session');
            return resp.ok;
        } catch (err) {
            return false;
        }
    }

    async getUser() {
        try {
            const resp = await APIConnector.get(BACKEND_SERVER_URL + "/current_user");
            const data = await resp.json();
            return data;
        } catch(err) {
            return undefined;
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
