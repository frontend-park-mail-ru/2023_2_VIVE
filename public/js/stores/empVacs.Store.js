import { BACKEND_SERVER_URL } from "../../../config/config.js";
import APIConnector from "../modules/APIConnector.js";
import Store from "./Store.js";
import User from "./UserStore.js";

class EmpVacsStore extends Store {
    constructor() {
        super();
        this.full_name = null;
        this.organization = null;
        this.vacancies = [];
        this.user = {};
    }

    getContext() {
        return {
            full_name: this.full_name,
            organization: this.organization,
            vacancies: this.vacancies,
            user: this.user
        }
    }

    async updateInnerData(data) {
        try {
            const resp = await APIConnector.get(BACKEND_SERVER_URL + "/vacancies/employer/" + data.id);
            const resp_json = await resp.json();
            this.organization = resp_json.organization_name;
            this.full_name = resp_json.last_name + " " + resp_json.first_name;
            this.vacancies = resp_json.vacancies;
            this.user = User.getUser();
            return true;
        } catch(error) {
            console.log(error);
            return false;
        }
    }
}

const empVacsStore = new EmpVacsStore();
export default empVacsStore;
