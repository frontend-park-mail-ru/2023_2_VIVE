import { BACKEND_SERVER_URL } from '../../../config/config.js';
import APIConnector from '../modules/APIConnector.js';
import { validateForm } from '../modules/constraints.js';
import router from "../modules/router/router.js";
import { getFormObject, getMetaPlusDataObj, isObjEmpty } from '../utils.js';
import Store from './Store.js';
import User from './UserStore.js';
import { saveAs } from 'file-saver';

class ResStore extends Store {
    constructor() {
        super();
        this.clear();
    }

    clear() {
        this.page = 0;
        //========== Edit =======
        this.is_edit = [
            false,
            false,
            false,
            false,
        ]

        //=======================
        this.pages_errors = [
            {},
            {
                "institutions": [],
            },
            {
                "companies": [],
            },
            {},
        ]
        this.pages_data = [
            {},
            {

            },
            {
                is_exp: false,
                is_end_date: [],
            },
            {},
        ];
        this.forms_data = [
            {
                "gender": "male",
            },
            {
                "education_level": "nothing",
                "institutions": [],
            },
            {
                "companies": [],
            },
            {
            }
        ];

        this.filters = [];
    }

    getFilters() {
        return this.filters;
    }

    get form_data() {
        return this.forms_data[this.page];
    }

    set form_data(val) {
        this.forms_data[this.page] = val;
    }

    get page_data() {
        return this.pages_data[this.page];
    }

    get page_errors() {
        return this.pages_errors[this.page];
    }

    formSteps() {
        return [
            "Основная информация",
            "Информация об образовании",
            "Информация об опыте работы",
            "Информация о Вас",
        ]
    }

    pageFormFieldsMeta() {
        return [{
            "profession_name": {
                type: "text",
                required: true,
            },
            "first_name": {
                type: "text",
                required: true,
                count_words: 1,
                no_digits: true,
            },
            "last_name": {
                type: "text",
                required: true,
                count_words: 1,
                no_digits: true,
            },
            "middle_name": {
                type: "text",
                // required: true,
                // count_words: 1,
                no_digits: true,
            },
            "gender": {
                type: "radio",
                required: true,
                data: "",
            },
            "birthday": {
                type: "date",
                required: true,
                digits: true,
            },
            "city": {
                type: "text",
                required: true,
            },
        },
        {
            "education_level": {
                type: "radio",
                required: true,
                data: "",
            },
            "name": {
                type: "text",
                required: true,
            },
            "major_field": {
                type: "text",
                required: true,
            },
            "graduation_year": {
                type: "text",
                required: true,
                digits: true,
                min_len: 4,
                max_len: 4,
            },
        },
        {
            "name": {
                type: "text",
                required: true,
            },
            "job_position": {
                type: "text",
                required: true,
            },
            "start_date": {
                type: "date",
                required: true,
            },
            "end_date": {
                type: "date",
                required: true,
            },
            "description": {
                type: "text",
                required: true,
            }
        },
        {
            "skills": {
                type: "text",
            },
            "description": {
                type: "text",
                required: true,
            },
        },
        ][this.page];
    }



    getContext() {
        return {
            user: User.getUser(),
            steps: this.formSteps(),
            page: this.page,
            errors: this.page_errors,
            data: this.form_data,
            page_data: this.page_data,
            main_error: this.main_error,


            //========editing
            is_edit: this.is_edit,
            forms_data: this.forms_data,
            is_my_resume: this.isMyResume(),
        };
    }

    isMyResume() {
        const user = User.getUser();
        if (user && this.resume && user['applicant_id'] && user['applicant_id'] == this.resume['applicant_id']) {
            return true;
        }
        return false;
    }


    // ================ Education 

    eduPageIsEdu(edu_value) {
        const is_dif = this.form_data["education_level"] != edu_value;
        if (this.form_data["education_level"] == 'nothing') {
            this.eduPageAddForm();
        } else if (edu_value == 'nothing') {
            this.eduPageClear();
        }
        this.form_data["education_level"] = edu_value;
        return is_dif;
    }

    eduPageAddForm() {
        this.form_data["institutions"].push({});
        this.page_errors["institutions"].push({});
        return true;
    }

    eduPageDelForm(num) {
        this.form_data["institutions"].splice(num, 1);
        this.page_errors["institutions"].splice(num, 1);
        return true;
    }

    eduPageClear() {
        this.form_data["institutions"] = [];
        this.page_errors["institutions"] = [];
    }

    // ============ Expirience

    expPageIsExp(is_exp) {
        this.page_data.is_exp = is_exp;
        if (!is_exp) {
            this.expPageClear();
        } else {
            this.expPageAddForm();
        }
        return true;
    }

    expPageAddForm() {
        this.page_data.is_end_date.push(false);
        this.form_data["companies"].push({});
        this.page_errors["companies"].push({});
        return true;
    }

    expPageDelForm(num) {
        this.page_data.is_end_date.splice(num, 1);
        this.form_data["companies"].splice(num, 1);
        this.page_errors["companies"].splice(num, 1);
        return true;
    }

    expPageClear() {
        this.page_data.is_end_date = [];
        this.form_data["companies"] = [];
        this.page_errors["companies"] = [];
        return true;
    }

    expPageIsEndDate(num, is_end_date) {
        this.page_data.is_end_date[num] = is_end_date;
        return true
    }

    // ============ nav 

    prevForm() {
        this.page--;
        return true;
    }


    // ============ Save, check, send

    checkInput(input_name, input_value) {
        const arr = input_name.split('#')
        const name = arr[0];
        let errors = this.page_errors;
        for (let i = 1; i < arr.length; i += 2) {
            errors = errors[arr[i]][arr[i + 1]];
        }

        const validate_obj = {};
        validate_obj[name] = input_value;
        const error = validateForm(getMetaPlusDataObj(this.pageFormFieldsMeta(), validate_obj));
        if (!isObjEmpty(error)) {
            Object.assign(errors, error);
            return true
        } else if (errors[name]) {
            delete errors[name];
            return true;
        }
        return false;
    }

    saveInput(input_name, input_value) {
        const arr = input_name.split('#')
        const name = arr[0];
        let data = this.form_data;
        for (let i = 1; i < arr.length; i += 2) {
            data = data[arr[i]][arr[i + 1]];
        }
        data[name] = input_value;
    }

    checkAndSaveInput(input_name, input_value) {
        const is_render = this.checkInput(input_name, input_value);
        this.saveInput(input_name, input_value);

        return is_render
    }

    saveForm(form_data) {
        let is_render = false;
        if ('skills' in form_data) {
            if (form_data['skills'].length === 0) {
                form_data['skills'] = [];
            } else {
                form_data['skills'] = form_data['skills'].split(';');
            }
            form_data['skills'] = form_data['skills'].map(entry => entry.trim());
            form_data['skills'] = form_data['skills'].filter(entry => entry != '');
        }
        for (const key in form_data) {
            if (this.checkAndSaveInput(key, form_data[key])) {
                is_render = true;
            }
        }
        return is_render;
    }

    saveFormAndContinue(form_data) {
        if (!this.saveForm(form_data)) {
            this.page++;
        }
        return true;
    }

    async sendForms() {
        // // console.log("sending...");
        const sending_form = {};
        for (const form_data of this.forms_data) {
            Object.assign(sending_form, form_data);
        }
        // // console.log(sending_form);
        //TODO
        try {
            const resp = await APIConnector.post(
                BACKEND_SERVER_URL + '/current_user/cvs',
                sending_form,
            );
            const data = await resp.json();

            this.clear();
            router.goToLink('/resume/' + data.id);
            return true;
        } catch (err) {
            this.main_error = 'Произошла ошибка отправки';
            console.error(err);
            return false;
        }
    }


    //==================== EDITING ============================

    async loadResume(id) {
        this.finals_data = [];

        this.resume = await this.getResume(id);
        if (isObjEmpty(this.resume)) {
            return false;
        }

        for (let i = 0; i < this.forms_data.length; ++i) {
            this.forms_data[i] = structuredClone(this.resume);
            this.finals_data.push({});
            this.finals_data[i] = structuredClone(this.forms_data[i]);
        }
        return true;
    }

    async getResume(id) {
        try {
            const resp = await APIConnector.get(
                BACKEND_SERVER_URL + '/cv/' + id);

            const data = await resp.json();

            // // console.log("received(resume): ", data);
            return data;
        } catch (err) {
            console.error(err);
            return {};
        }
    }

    get final_data() {
        return this.finals_data[this.page];
    }

    set final_data(val) {
        this.finals_data[this.page] = val
    }

    loadPage() {
        if (this.page == 1) {
            this.loadEdu()
        }
        if (this.page == 2) {
            this.loadExp();
        }
    }

    loadEdu() {
        this.form_data['institutions'].forEach(function (inst) {
            this.page_errors['institutions'].push({});
        }.bind(this));
    }

    loadExp() {
        this.page_data.is_exp = this.form_data['companies'].length != 0;
        this.form_data['companies'].forEach(function (company) {
            this.page_data.is_end_date.push(company['end_date'] != undefined);
            this.page_errors['companies'].push({});
        }.bind(this));
    }

    changeMode() {
        if (!this.is_edit[this.page]) {
            this.loadPage();
        } else {
            this.form_data = structuredClone(this.final_data);
        }
        this.is_edit[this.page] = !this.is_edit[this.page];
        return true;
    }

    async saveEdit(form_data) {
        const is_render = this.saveForm(form_data);
        if (is_render) {
            return true;
        } else {
            this.final_data = structuredClone(this.form_data);
            return await this.sendEdit();
        }
    }

    async sendEdit() {
        // console.log("sending edit...");
        // console.log(this.final_data);
        try {
            const resp = await APIConnector.put(
                BACKEND_SERVER_URL + '/current_user/cvs/' + this.resume.id, this.final_data);
            this.changeMode();
        } catch (err) {
            console.error(err);
        }
        return true;
    }


    async deleteResume() {
        try {
            const resp = await APIConnector.delete(
                BACKEND_SERVER_URL + `/current_user/cvs/${this.resume.id}`,
            );
            router.goToLink('/profile/resumes');
            return true;
        } catch (error) {
            // console.log(error);
            return false;
        }
    }

    parseQueryToDict(qParams) {
        const qObj = {};
        for (const key of qParams.keys()) {
            qObj[key] = qParams.get(key);
        }
        return qObj;
    }

    updateInnerData(data) {
        this.qObj = this.parseQueryToDict(data['urlObj'].searchParams);
        if (!this.qObj.page_num || !this.qObj.results_per_page) {
            this.qObj['page_num'] = 1;
            this.qObj['results_per_page'] = 10;
        }
    }

    async getResumes() {
        try {
            const resp = await APIConnector.get(
                BACKEND_SERVER_URL + `/current_user/cvs/${this.resume.id}`,
            );
            router.goToLink('/profile/resumes');
            return true;
        } catch (error) {
            // console.log(error);
            return false;
        }
    }

    async pagToNext() {
        if (this.qObj.page_num * this.qObj.results_per_page >= this.cvs.count) {
            return false;
        }
        this.qObj.page_num++;
        await router.goToLink('/resumes?' + decodeURIComponent(new URLSearchParams(this.qObj).toString()));
        return true;
    }

    async pagToPrev() {
        if (this.qObj.page_num == 1) {
            return false;
        }
        this.qObj.page_num--;
        await router.goToLink('/resumes?' + decodeURIComponent(new URLSearchParams(this.qObj).toString()));
        return true;
    }

    async getAllResumes() {
        if (!this.qObj['q']) {
            this.qObj['q'] = '';
        }

        const q_str = decodeURIComponent(new URLSearchParams(this.qObj).toString());
        try {
            const resp = await APIConnector.get(
                BACKEND_SERVER_URL + `/cvs/search?` + q_str,
            );
            const data = await resp.json();
            this.filters = data.filters;
            this.cvs = data.cvs;
            return data.cvs.list;
        } catch (error) {
            // console.log(error);
            return undefined;
        }
    }

    async loadPfdResume() {
        try {
            const resp = await APIConnector.get(
                BACKEND_SERVER_URL + `/current_user/cvs/${this.form_data.id}/pdf`,
            );
            const contentDisposition = await resp.headers.get('Content-Disposition');
            const match = contentDisposition && contentDisposition.match(/filename=(.+)/);
            const fileName = match && match[1] ? match[1] : 'filename.pdf';
            const file = await resp.blob();
            saveAs(file, fileName);
        } catch (error) {
            // console.log(error);
            return false;
        }
    }
}

const resStore = new ResStore();
export default resStore;
