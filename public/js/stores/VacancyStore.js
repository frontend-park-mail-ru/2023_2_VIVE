import { BACKEND_SERVER_URL } from '../../../config/config.js';
import APIConnector from '../modules/APIConnector.js';
import { validateForm } from '../modules/constraints.js';
import router from '../modules/router.js';
import { getMetaPlusDataObj, isObjEmpty } from '../utils.js';
import Store from "./Store.js";

class VacancyStore extends Store {
    constructor() {
        super();
        this.user = {};
        this.state = 'description';
        this.vacancy = {};
        this.errors = {};
    }

    pageFormFieldMeta(type) {
        if (type === 'main') {
            return {
                "name": {
                    type: "text",
                    required: true,
                },
                "salary_lower_bound": {
                    type: "text",
                    only_digits: true,
                },
                "salary_upper_bound": {
                    type: "text",
                    only_digits: true,
                    greater_than: "salary_lower_bound",
                },
                "experience": {
                    type: "radio",
                    required: true,
                    data: "",
                },
                "employment": {
                    type: "radio",
                    required: true,
                    data: "",
                },
                "location": {
                    type: "text",
                    required: false,
                }
            }
        } else {
            return {
                "description": {
                    type: "text",
                    required: true,
                }
            }
        }
    }

    checkForm(form, type) {
        this.errors[type] = validateForm(getMetaPlusDataObj(this.pageFormFieldMeta(type), form));
        const firstErrorKey = Object.keys(this.errors)[0];
        if (isObjEmpty(this.errors[firstErrorKey])) {
            return true;
        } else {
            this.errors["data-" + type] = {};
            for (const key in form) {
                if (form[key] !== undefined) {
                    Object.assign(this.errors["data-" + type], { [key]: form[key] });
                }
            }
            return false;
        }
    }

    getContext() {
        const errors = this.errors;
        this.errors = {};
        return {
            errors: errors,
            state: this.state,
            user: this.user,
            vacancy: this.vacancy,
        }
    }

    setState(state) {
        this.state = state;
    }

    async sendData(form) {
        let newVacancyData = { ...this.vacancy};

        for (const key in form) {
            newVacancyData[key] = form[key];
        }

        if ("salary_lower_bound" in newVacancyData) {
            newVacancyData["salary_lower_bound"] = Number(newVacancyData["salary_lower_bound"]);
        }

        if ("salary_upper_bound" in newVacancyData) {
            newVacancyData["salary_upper_bound"] = Number(newVacancyData["salary_upper_bound"]);
        }

        try {
            const resp = await APIConnector.put(
                BACKEND_SERVER_URL + '/vacancies/' + newVacancyData["id"],
                newVacancyData,
            );

            router.goToLink("/vacancy/" + newVacancyData["id"]);
            return true;
        } catch (error) {
            console.log(error);
            return false;
        }
    }

    async updateInnerData(data) {
        try {
            const resp = await APIConnector.get(`${BACKEND_SERVER_URL}/vacancies/${data['id']}`);
            this.vacancy = await this.getData(`/vacancies/${data['id']}`);
            this.user = await this.getData("/current_user");
            return true;
        } catch(err) {
            return false;
        }
    }

    async getData(url) {
        try {
            const resp = await APIConnector.get(BACKEND_SERVER_URL + url);
            const data = await resp.json();
            return data;
        } catch(err) {
            return undefined;
        }
    }
}

const vacancyStore = new VacancyStore();
export default vacancyStore;
