import { BACKEND_SERVER_URL } from '../../../config/config.js';
import APIConnector from '../modules/APIConnector.js';
import { Constraints, validateForm } from '../modules/constraints.js';
import router from '../modules/router.js';
import { getMetaPlusDataObj, isObjEmpty } from '../utils.js';
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
        this.view = null;
        this.errors = {};
    }

    sendView(view) { // ("auth", "reg") / ("app", "emp")
        const is_change = this.view != view;
        this.view = view;

        // очищаем данные при смене формы
        if (is_change) {
            this.form_data = {};
            this.form_error = null;
            this.errors = {};
        }
    }

    pageFormFieldsMeta() {
        if (this.view.form_type == FORM_TYPES.reg) {
            const common = {
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
                "email": {
                    type: "text",
                    required: true,
                    count_words: 1,
                    email: true,
                },
                "password": {
                    type: "password",
                    required: true,
                    password: true,
                    password_repeat: "repeat_password",
                },
                "repeat_password": {
                    type: "password",
                    required: true,
                },
            }
            if (this.view.role == ROLES.emp) {
                return Object.assign(common,
                    {
                        "company_name": {
                            type: "text",
                            required: true,
                        }
                    })
            }
            return common;
        }
        else if (this.view.form_type == FORM_TYPES.auth) {
            return {
                "email": {
                    type: "text",
                    required: true,
                    count_words: 1,
                    email: true,
                },
                "password": {
                    type: "password",
                    required: true,
                    password: true,
                },
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
            role: this.view.role,
            form_type: this.view.form_type,
            errors: this.errors,
            data: this.form_data,
            form_error: this.form_error,
        }
    }

    checkForm(form_data) {
        this.errors = validateForm(getMetaPlusDataObj(this.pageFormFieldsMeta(), form_data));
        this.form_data = form_data;

        if (isObjEmpty(this.errors)) {
            return true;
        } else {
            return false;
        }
    }

    async sendForm() {
        this.form_data['role'] = this.view.role;
        if (this.view.form_type == FORM_TYPES.reg) {
            delete this.form_data['repeat_password'];
            console.log(this.form_data);
            try {
                const resp = await APIConnector.post(
                    BACKEND_SERVER_URL + '/users',
                    this.form_data,
                );
                this.form_data = null;
                router.goToLink('/');
                console.log(resp.status);
            } catch (err) {
                console.error(err);
            }
        } else {
            console.log(this.form_data);
            this.view.render();
            try {
                const resp = await APIConnector.post(
                    BACKEND_SERVER_URL + '/session',
                    this.form_data,
                );
                this.form_data = null;
                router.goToLink('/');
                console.log(resp.status);
            } catch (err) {
                this.form_error = "Ошибка!";
                console.error(err);
            }
        }

    }
}

const regAuthStore = new RegAuthStore();
export default regAuthStore;

