import { BACKEND_SERVER_URL } from "../../../config/config.js";
import APIConnector from "../modules/APIConnector.js";
import Store from "./Store.js";
import User from "./UserStore.js";
import vacancyStore from "./VacancyStore.js";

class VacsStore extends Store {
    constructor() {
        super();
        this.vacs = [];
    }

    async getContext() {
        let vacancies = await this.getVacancies();
        vacancies = this.processVacanciesData(vacancies);
        return {
            user: await User.getUser(),
            data: vacancies
        }
    }

    processVacanciesData(vacancies) {
        vacancies.forEach(vacancy => {
            const salary = vacancyStore.processVacanciesSalary(vacancy);
            delete vacancy.salary_lower_bound; delete vacancy.salary_upper_bound;
            Object.assign(vacancy, {['salary']: salary});
            vacancy.employment = vacancyStore.processVacanciesEmployment(vacancy);
            vacancy.experience = vacancyStore.processVacanciesExperience(vacancy);
            vacancy.location = vacancy.location ? vacancy.location : 'Не указано';
        });

        return vacancies;
    }

    async getVacancies() {
        try {
          const resp = await APIConnector.get(BACKEND_SERVER_URL + '/vacancies');
          const data = await resp.json();
          return data;
        } catch (err) {
          console.error(err);
          return undefined;
        }
    }
}

const vacsStore = new VacsStore;
export default vacsStore;
