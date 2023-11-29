import { BACKEND_SERVER_URL } from "../../../config/config.js";
import APIConnector from "../modules/APIConnector.js";
import HTTPError from "../modules/HTTPError.js";
import Store from "./Store.js";
import vacancyStore from "./VacancyStore.js";

class ResponseStore extends Store {
    constructor() {
        super();
        this.form_error = null;
        this.vacancy = {};
        this.resumes = {};
        this.user = {};
        this.organization = null;
    }

    getContext() {
        const form_error = this.form_error;
        this.form_error = null;
        this.vacancy.salary_view = vacancyStore.processVacanciesSalary(this.vacancy);
        this.vacancy.employment_view = vacancyStore.processVacanciesEmployment(this.vacancy);
        this.vacancy.experience_view = vacancyStore.processVacanciesExperience(this.vacancy);
        return {
            form_error: form_error,
            vacancy: this.vacancy,
            resumes: this.resumes,
            user: this.user,
            organization: this.organization,
        }
    }

    async updateInnerData(data) {
        try {
            const vac_data = await this.getData(`/vacancies/${data['id']}`);
            this.vacancy = vac_data.vacancy;
            this.organization = vac_data.organization_name;
            this.resumes = await this.getData("/current_user/cvs");
            this.user = await this.getData("/current_user");
            return true;
        } catch(err) {
            return false;
        }
    }

    async sendResponse(resumeID, vacancyID) {
        try {
            const resp = await APIConnector.post(BACKEND_SERVER_URL + `/vacancies/${vacancyID}/respond/${resumeID}`);
            return true;
        } catch (error) {
            this.form_error = "Вы уже отправляли отклик на эту вакансию текущим резюме";
            return false;
        }
    }

    async getData(url) {
        try {
            const resp = await APIConnector.get(BACKEND_SERVER_URL + url);
            const data = await resp.json();
            return data;
        } catch(err) {
            throw new HTTPError(err);
        }
    }
}

const responseStore = new ResponseStore();
export default responseStore;
