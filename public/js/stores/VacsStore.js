import { BACKEND_SERVER_URL } from "../../../config/config.js";
import APIConnector from "../modules/APIConnector.js";
import Store from "./Store.js";
import User from "./UserStore.js";
import vacancyStore from "./VacancyStore.js";

class VacsStore extends Store {
    constructor() {
        super();
        this.vacs = [];
        this.sorted = false;
    }

    async getContext() {
        return {
            user: await User.getUser(),
            sorted: this.sorted,
            data: this.vacs
        }
    }

    async updateInnerData() {
        await super.updateInnerData();
        try {
            this.vacs = this.sortVacanciesByDateToOld(await this.getVacancies());
            this.vacs = this.processVacanciesData(this.vacs);
            return true;
        } catch(error) {
            return false;
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

    sortVacancies() {
        if (this.sorted) {
            this.vacs = this.sortVacanciesByDateToOld(this.vacs);
        } else {
            this.vacs = this.sortVacanciesByDateToNew(this.vacs);
        }
        this.sorted = !this.sorted;
    }

    sortVacanciesByDateToNew(vacancies) {
        return vacancies.sort(function(a, b) {
            return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
        });
    }

    sortVacanciesByDateToOld(vacancies) {
        return vacancies.sort(function(a, b) {
            return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
        });
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
