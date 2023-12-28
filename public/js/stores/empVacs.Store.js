import { BACKEND_SERVER_URL } from "../../../config/config.js";
import APIConnector from "../modules/APIConnector.js";
import Store from "./Store.js";
import User from "./UserStore.js";
import vacancyStore from "./VacancyStore.js";

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
            emp: this.emp,
            user: User.getUser(),
        }
    }

    async updateInnerData(data) {
        try {
            const resp = await APIConnector.get(BACKEND_SERVER_URL + "/vacancies/employer/" + data.id);
            const resp_json = await resp.json();
            console.log(resp_json);
            this.emp = resp_json;
            this.emp.vacancies.forEach(element => {
                element.salary_view = vacancyStore.processVacanciesSalary(element);
                element.employment_view = vacancyStore.processVacanciesEmployment(element);
                element.expirience_view = vacancyStore.processVacanciesExperience(element);
            });

            return true;
        } catch (error) {
            // // console.log(error);
            return false;
        }
    }
}

const empVacsStore = new EmpVacsStore();
export default empVacsStore;
