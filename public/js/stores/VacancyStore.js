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
        this.responses = [];
        this.errors = {};
    }

    pageFormFieldMeta(type) {
        if (type === 'main' || this.page == 0) {
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
        const responses = this.responses;
        this.errors = {};
        this.responses = [];
        return {
            responses: responses,
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
        let newVacancyData = { ...this.vacancy };

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

            const cvIds = await this.getData(`/vacancies/${data['id']}/applicants`);
            if (cvIds) {
                for (const cv of cvIds) {
                    const cvId = cv.cv_id;
                    data = await this.getData(`/cv/${cvId}`);
                    data.profession_name = data.profession_name.slice(0, 50) + "...";
                    this.responses.push(data);
                }
            }

            return true;
        } catch (err) {
            return false;
        }
    }

    async getData(url) {
        try {
            const resp = await APIConnector.get(BACKEND_SERVER_URL + url);
            const data = await resp.json();
            return data;
        } catch (err) {
            return undefined;
        }
    }

    async getAllVacancies() {
        try {
            const resp = await APIConnector.get(BACKEND_SERVER_URL + '/vacancies');
            const data = await resp.json();
            return data;
        } catch (err) {
            console.error(err);
            return undefined;
        }
    }


    //===============Creation=================

    clear() {
        this.page = 0;
        this.form_data = {
            "experience": "<1",
            "employment": "<1",
        };
        this.form_errors = {};
        this.error = "";
        this.cur_input = undefined;
    }

    formSteps() {
        return [
            "Основная информация",
            "Подробная информация о вакансии",
        ]
    }

    getCreationContext() {
        return {
            page: this.page,
            steps: this.formSteps(),
            data: this.form_data,
            form_errors: this.form_errors,
        }

    }

    prevForm() {
        this.page--;
        return true;
    }


    checkAndSaveInput(input_name, input_value) {
        if (!this.cur_input) {
            this.cur_input = {};
        }
        this.cur_input['name'] = input_name;
        this.cur_input['value'] = input_value;

        this.form_data[input_name] = input_value;

        // const validate_obj = {};
        // validate_obj[input_name] = input_value;

        const errors = validateForm(getMetaPlusDataObj(this.pageFormFieldMeta(), this.form_data));
        console.log(errors);
        this.form_errors = {};
        if (!isObjEmpty(errors)) {
            Object.assign(this.form_errors, errors);
        }
        return true;
    }


    isValidFormData(form_data) {
        const errors = validateForm(getMetaPlusDataObj(this.pageFormFieldMeta(), form_data));
        Object.assign(this.form_errors, errors);
        return isObjEmpty(errors);
    }

    saveFormAndContinue(form_data) {
        if (this.isValidFormData(form_data)) {
            this.page++;
        }
        return true;
    }

    async checkAndSendForm(form_data) {
        if (this.isValidFormData(form_data)) {
            Object.assign(this.form_data, form_data);
            return await this.sendForm();
        }
        return true;
    }

    async sendForm() {
        console.log("sending...");
        console.log(this.form_data);
        try {
            const resp = await APIConnector.post(
                BACKEND_SERVER_URL + '/vacancies',
                this.form_data,
            );
            console.log(resp);
            this.clear();
            // router.goToLink('/');        
        } catch(error) {
            console.log(error);
            return false;
        }
    }
}

const vacancyStore = new VacancyStore();
export default vacancyStore;
