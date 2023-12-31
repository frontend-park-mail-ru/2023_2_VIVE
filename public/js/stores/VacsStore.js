import { BACKEND_SERVER_URL } from "../../../config/config.js";
import APIConnector from "../modules/APIConnector.js";
import router from '../modules/router/router.js';
import Store from "./Store.js";
import User from "./UserStore.js";
import vacancyStore from "./VacancyStore.js";

class VacsStore extends Store {
    constructor() {
        super();
        this.filters = [];
        this.vacs = [];
        this.sorted = false;
    }

    async getContext() {
        this.vacs.forEach(vac => {
            vac.salary_view = vacancyStore.processVacanciesSalary(vac);
            vac.employment_view = vacancyStore.processVacanciesEmployment(vac);
            vac.expirience_view = vacancyStore.processVacanciesExperience(vac);
        });
        return {
            user: await User.getUser(),
            sorted: this.sorted,
            data: this.vacs,
            qObj: this.qObj,
            vacancies: this.vacancies,
            filters: this.filters,
        }
    }

    parseQueryToDict(qParams) {
        const qObj = {};
        for (const key of qParams.keys()) {
            qObj[key] = qParams.get(key);
        }
        return qObj;
    }

    async updateInnerData(data) {
        this.qObj = this.parseQueryToDict(data['urlObj'].searchParams);
        if (!this.qObj.page_num || !this.qObj.results_per_page) {
            this.qObj['page_num'] = 1;
            this.qObj['results_per_page'] = 10;
        }

        try {
            this.vacs = this.sortVacanciesByDateToOld(await this.getVacancies());
            this.vacs = this.processVacanciesData(this.vacs);
            return true;
        } catch (error) {
            return false;
        }
    }

    processVacanciesData(vacancies) {
        vacancies.forEach(vacancy => {
            const salary = vacancyStore.processVacanciesSalary(vacancy);
            delete vacancy.salary_lower_bound; delete vacancy.salary_upper_bound;
            Object.assign(vacancy, { ['salary']: salary });
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
        return vacancies.sort(function (a, b) {
            return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
        });
    }

    sortVacanciesByDateToOld(vacancies) {
        return vacancies.sort(function (a, b) {
            return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
        });
    }

    async pagToNext() {
        // // console.log(this.qObj, this.vacancies);
        if (this.qObj.page_num * this.qObj.results_per_page >= this.vacancies.count) {
            return false;
        }
        this.qObj.page_num++;
        await router.goToLink('/vacs?' + decodeURIComponent(new URLSearchParams(this.qObj).toString()));
        return true;
    }

    async pagToPrev() {
        if (this.qObj.page_num == 1) {
            return false;
        }
        this.qObj.page_num--;
        await router.goToLink('/vacs?' + decodeURIComponent(new URLSearchParams(this.qObj).toString()));
        return true;
    }

    async getVacancies() {

        if (!this.qObj['q']) {
            this.qObj['q'] = '';
        }

        const q_str = decodeURIComponent(new URLSearchParams(this.qObj).toString());
        try {
            const resp = await APIConnector.get(BACKEND_SERVER_URL + '/vacancies/search' + '?' + q_str);
            const data = await resp.json();
            // // console.log(data);
            this.vacancies = data['vacancies'];
            this.filters = data['filters'];
            return data['vacancies']['list'];
        } catch (err) {
            // console.error(err);
            return undefined;
        }
    }

    async getFavouriteVacs() {
        try {
            const resp = await APIConnector.get(BACKEND_SERVER_URL + '/vacancies/favourite');
            this.vacs = await resp.json();
            return true;
        } catch (error) {
            // console.error(error);
            this.vacs = [];
            return false;
        }
    }

    async removeFavouriteVac(vac_id) {
        if (User.isLoggedIn()) {
            if (User.getUser().role == User.ROLES.emp) {
                return false;
            }
        } else {
            router.goToLink('/app_auth');
            return false;
        }

        try {
            const resp = await APIConnector.delete(BACKEND_SERVER_URL + '/vacancies/favourite/' + vac_id);
            return true;
        } catch (error) {
            // console.error(error);
            return false;
        }
    }

    async setFavouriteVac(vac_id) {
        if (User.isLoggedIn()) {
            if (User.getUser().role == User.ROLES.emp) {
                return false;
            }
        } else {
            router.goToLink('/app_auth');
            return false;
        }

        try {
            const resp = await APIConnector.post(BACKEND_SERVER_URL + '/vacancies/favourite/' + vac_id);
            return true;
        } catch (error) {
            // console.error(error);
            return false;
        }
    }
}

const vacsStore = new VacsStore;
export default vacsStore;
