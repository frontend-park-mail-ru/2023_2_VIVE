import { BACKEND_SERVER_URL } from "../../../config/config.js";
import APIConnector from "../modules/APIConnector.js";
import HTTPError from "../modules/HTTPError.js";
import Store from "./Store.js";

class ResponseStore extends Store {
    constructor() {
        super();
        this.form_error = null;
        this.vacancy = {};
        this.resumes = {};
        this.user = {};
    }

    getContext() {
        const form_error = this.form_error;
        this.form_error = null;
        return {
            form_error: form_error,
            vacancy: this.vacancy,
            resumes: this.resumes,
            user: this.user,
        }
    }

    async updateInnerData(data) {
        await super.updateInnerData();
        try {
            this.vacancy = await this.getData(`/vacancies/${data['id']}`);
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
