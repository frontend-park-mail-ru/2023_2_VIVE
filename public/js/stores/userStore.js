import { BACKEND_SERVER_URL } from '../../../config/config.js';
import APIConnector from '../modules/APIConnector.js';
import router from '../modules/router.js';
import Store from './store.js';

class UserStore extends Store {
    constructor() {
        super();
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
            data['role'] = 'applicant';
            console.log(data);
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
