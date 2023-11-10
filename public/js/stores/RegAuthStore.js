import { BACKEND_SERVER_URL } from '../../../config/config.js';
import APIConnector from '../modules/APIConnector.js';
import { Constraints, validateForm } from '../modules/constraints.js';
import { isObjEmpty } from '../utils.js';
import regAuthView from '../views/regAuthView.js';
import Store from './Store.js';

const FORM_TYPES = {
    auth: 'auth',
    reg: 'reg',
}

const ROLES = {
    app: 'applicant',
    emp: 'employer',
}

class RegAuthStore extends Store {
    constructor() {
        super();
        this.sendType("", "");
        this.errors = {};
    }

    sendType(form_type, role) { // ("auth", "reg") / ("app", "emp")
        const is_change = this.form_type != form_type || this.role != role;
        this.form_type = form_type;
        this.role = role;

        // очищаем данные при смене формы
        if (is_change) { 
            this.form_data = {};
            this.form_error = null;
            this.errors = {};
        }
    }

    pageFormFieldsMeta() {
        if (this.form_type == FORM_TYPES.reg) {
            const common = {
                "first_name": {

                },
                "last_name": {

                },
                "email": {

                },
                "password": {

                },
                "repeat_password": {

                },
            }
            if (this.role == ROLES.emp) {
                return Object.assign(common,
                    {
                        "company_name": {

                        }
                    })
            }
            return common;
        }
        else if (this.form_type == FORM_TYPES.auth) {
            return {
                "email": {

                },
                "password": {

                }
            }
        }
        else {
            throw new Error("wrong type");
        }
    }

    getContext() {
        return {
            ROLES: ROLES,
            FORM_TYPES: FORM_TYPES,
            role: this.role,
            form_type: this.form_type,
            errors: this.errors,
            data: this.form_data,
            form_error: this.form_error,
        }
    }

    sendForm(form_data) {
        // this.errors = validateForm(this.pageFormFieldsMeta(), form_data);
        this.errors = {
            "first_name": "Ошибка!",
        }

        this.form_data = form_data;

        if (isObjEmpty(this.errors)) {
            this.send();
        } else {

        }
        // if (this.) {
        //     errors = validator.validateRegistrationForm(data);
        //   } else if (is_login) {
        //     errors = validator.validateAuthForm(data);
        //   }
        // if (formIsValid(form, formData, { is_login: true })) {
        //     if (await this.sendForm(formData)) {
        //       router.goToLink('/');
        //     } else {
        //       const form_error = form.querySelector('.form__error');
        //       form_error.textContent = 'Неверная электронная почта или пароль';
        //       if (form_error.classList.contains('d-none')) {
        //         form_error.classList.remove('d-none');
        //       }
        //     }
        //   }
    }

    send() {
        if (this.form_type == FORM_TYPES.reg) {

        }
        console.log(this.form_data);
    }

    async temp(formData) {
        delete formData['remember_password'];
        // formData['role'] = this.role == 'app' ? 'applicant' : 'employer';
        console.log(formData);

        try {
            const resp = await APIConnector.post(
                BACKEND_SERVER_URL + '/session',
                formData,
            );
            console.log(resp.status);
            return true;
        } catch (err) {
            console.error("hello!", err);
            return false;
        }
    }

}

const regAuthStore = new RegAuthStore();
export default regAuthStore;

