import { BACKEND_SERVER_URL } from '../../../config/config.js';
import APIConnector from '../modules/APIConnector.js';
import { validateForm } from '../modules/constraints.js';
import router from "../modules/router/router.js";
import { getMetaPlusDataObj, isObjEmpty } from '../utils.js';
import Store from "./Store.js";
import User from './UserStore.js';

class VacancyStore extends Store {
    constructor() {
        super();
        this.user = {};
        this.state = 'description';
        this.vacancy = {};
        this.responses = [];
        this.errors = {};
        this.organization = null;
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
                    max_len: 9,
                },
                "salary_upper_bound": {
                    type: "text",
                    only_digits: true,
                    max_len: 9,
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
                    required: true,
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
        // const responses = this.responses;
        this.errors = {};
        // this.responses = [];

        if (this.vacancy === undefined) {
            return null;
        }

        this.vacancy.salary_view = this.processVacanciesSalary(this.vacancy);
        this.vacancy.employment_view = this.processVacanciesEmployment(this.vacancy);
        this.vacancy.experience_view = this.processVacanciesExperience(this.vacancy);
        return {
            responses: this.responses,
            errors: errors,
            state: this.state,
            user: this.user,
            vacancy: this.vacancy,
            organization: this.organization
        }
    }

    processVacanciesSalary(vacancy) {
        const formatSalary = (amount) => new Intl.NumberFormat('ru-RU').format(amount);

        if (vacancy.salary_lower_bound && vacancy.salary_upper_bound) {
            return `От ${formatSalary(vacancy.salary_lower_bound)} до ${formatSalary(vacancy.salary_upper_bound)} рублей`;
        } else if (vacancy.salary_lower_bound) {
            return `От ${formatSalary(vacancy.salary_lower_bound)} рублей`;
        } else if (vacancy.salary_upper_bound) {
            return `До ${formatSalary(vacancy.salary_upper_bound)} рублей`;
        } else {
            return 'Не указано';
        }
    }

    processVacanciesEmployment(vacancy) {
        if (!vacancy.employment) {
            return 'Не указано';
        }

        switch (vacancy.employment) {
            case 'full-time':
                return 'Полная занятость';
            case 'part-time':
                return 'Частичная занятость';
            case 'one-time':
                return 'Разовая работа или проект';
            case 'volunteering':
                return 'Волонтерство';
            case 'internship':
                return 'Стажировка';
            default:
                return 'Не указано';
        }
    }

    processVacanciesExperience(vacancy) {
        if (!vacancy.experience) {
            return 'Не указано';
        }

        switch (vacancy.experience) {
            case 'no_experience':
                return 'Без опыта';
            case 'one_three_years':
                return 'От 1 до 3-х лет';
            case 'three_six_years':
                return 'От 3-х до 6-ти лет';
            case 'six_more_years':
                return 'Более 6-ти лет';
            default:
                return 'Не указано';
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
            this.vacancy = (await this.getData(`/vacancies/${data.id}`));
            
            this.user = User.getUser();
            this.responses = [];

            switch(data.url.split('/').slice(1)[2]) {
                case 'responses':
                    this.setState('responses');
                    break;
                case 'description':
                case undefined:
                    this.setState('description');
                    break;
                default:
                    break;
            }
            
            if (User.getUser().role === User.ROLES.emp && User.getUser().employer_id === this.vacancy.employer_id) {
                const cvIds = await this.getData(`/vacancies/${data['id']}/applicants`);
                if (cvIds) {
                    for (const cv of cvIds) {
                        const cvId = cv.cv_id;
                        data = await this.getData(`/cv/${cvId}`);
                        data.profession_name = data.profession_name.slice(0, 50) + "...";
                        this.responses.push(data);
                    }
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
            "experience": "none",
            "employment": "none",
            "education_type": "nothing",
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


    checkAndSaveInput(input_node) {
        this.cur_input = input_node;
        console.log(input_node);

        this.form_data[input_node.name] = input_node.value;

        const errors = validateForm(getMetaPlusDataObj(this.pageFormFieldMeta(), this.form_data));
        this.form_errors = {};
        if (!isObjEmpty(errors)) {
            Object.assign(this.form_errors, errors);
        }
        return true;
    }


    isValidFormData() {
        this.form_errors = {};
        const errors = validateForm(getMetaPlusDataObj(this.pageFormFieldMeta(), this.form_data));
        Object.assign(this.form_errors, errors);
        return isObjEmpty(errors);
    }

    saveFormAndContinue(form_data) {
        Object.assign(this.form_data, form_data);
        if (this.isValidFormData()) {
            this.page++;
        }
        return true;
    }

    async checkAndSendForm(form_data) {
        Object.assign(this.form_data, form_data);
        if (this.isValidFormData()) {
            return await this.sendForm();
        }
        return true;
    }

    async deleteVacancie() {
        try {
            const resp = await APIConnector.delete(
                BACKEND_SERVER_URL + `/vacancies/${this.vacancy.id}`,
            );
            return true;
        } catch(error) {
            console.log(error);
            return false;
        }
    }

    beforeSending() {
        this.form_data['salary_lower_bound'] = Number(this.form_data['salary_lower_bound']);
        this.form_data['salary_upper_bound'] = Number(this.form_data['salary_upper_bound']);
    }

    async sendForm() {
        console.log("sending...");
        console.log(this.form_data);
        this.beforeSending();
        try {
            const resp = await APIConnector.post(
                BACKEND_SERVER_URL + '/vacancies',
                this.form_data,
            );
            const data = await resp.json();
            this.clear();
            router.goToLink('/vacancy/' + data.id);        
        } catch(error) {
            console.error(error);
            return false;
        }
    }
}

const vacancyStore = new VacancyStore();
export default vacancyStore;
