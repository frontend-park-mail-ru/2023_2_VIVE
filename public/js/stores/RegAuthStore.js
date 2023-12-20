import { BACKEND_SERVER_URL } from '../../../config/config.js';
import APIConnector from '../modules/APIConnector.js';
import { Constraints, validateForm } from '../modules/constraints.js';
import router from "../modules/router/router.js";
import { getMetaPlusDataObj, isObjEmpty } from '../utils.js';
import regAuthView from '../views/regAuthView.js';
import UserStore from './UserStore.js'
import Store from './Store.js';
import User from './UserStore.js';



class RegAuthStore extends Store {
    constructor() {
        super();
        this.clear();
    }

    FORM_TYPES = {
        auth: 'auth',
        reg: 'reg',
    }

    clear() {
        this.view = null;
        this.forms_data = {};
        this.forms_errors = {};
        this.errors = {};
    }

    sendView(view) {
        const is_change = this.view != view;
        this.view = view;
        return is_change;
    }

    get error() {
        if (!this.errors[this.view.form_type]) {
            this.errors[this.view.form_type] = {};
        }
        if (!this.errors[this.view.form_type][this.view.role]) {
            this.errors[this.view.form_type][this.view.role] = "";
        }
        return this.errors[this.view.form_type][this.view.role];
    }

    set error(value) {
        if (!this.errors[this.view.form_type]) {
            this.errors[this.view.form_type] = {};
        }
        this.errors[this.view.form_type][this.view.role] = value;
    }

    get form_errors() {
        if (!this.forms_errors[this.view.form_type]) {
            this.forms_errors[this.view.form_type] = {};
        }
        if (!this.forms_errors[this.view.form_type][this.view.role]) {
            this.forms_errors[this.view.form_type][this.view.role] = {};
        }
        return this.forms_errors[this.view.form_type][this.view.role];
    }

    get form_data() {
        if (!this.forms_data[this.view.form_type]) {
            this.forms_data[this.view.form_type] = {};
        }
        if (!this.forms_data[this.view.form_type][this.view.role]) {
            this.forms_data[this.view.form_type][this.view.role] = {};
        }
        return this.forms_data[this.view.form_type][this.view.role];
    }

    set form_errors(value) {
        if (!this.forms_errors[this.view.form_type]) {
            this.forms_errors[this.view.form_type] = {};
        }
        if (!this.forms_errors[this.view.form_type][this.view.role]) {
            this.forms_errors[this.view.form_type][this.view.role] = {};
        }
        this.forms_errors[this.view.form_type][this.view.role] = value;
    }
    

    pageFormFieldsMeta() {
        if (this.view.form_type == this.FORM_TYPES.reg) {
            const common = {
                "first_name": {
                    type: "text",
                    required: true,
                    count_words: 1,
                    no_digits: true,
                    max_len: 20,
                },
                "last_name": {
                    type: "text",
                    required: true,
                    count_words: 1,
                    no_digits: true,
                    max_len: 20,
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
            if (this.view.role == UserStore.ROLES.emp) {
                return Object.assign(common,
                    {
                        "organization_name": {
                            type: "text",
                            required: true,
                        }
                    })
            }
            return common;
        }
        else if (this.view.form_type == this.FORM_TYPES.auth) {
            return {
                "email": {
                    type: "text",
                    required: true,
                    count_words: 1,
                    email: true,
                },
                "password": {
                    type: "password",
                    // required: true,
                    // password: true,
                },
            }
        }
        else {
            throw new Error("wrong type");
        }
    }

    getContext() {
        return {
            ROLES: UserStore.ROLES,
            FORM_TYPES: this.FORM_TYPES,
            role: this.view.role,
            form_type: this.view.form_type,
            form_errors: this.form_errors,
            data: this.form_data,
            error: this.error,
        }
    }

    saveAndCheckInput(input_name, input_value) {
        const data_obj = {};
        data_obj[input_name] = input_value;
        Object.assign(this.form_data, data_obj);

        const errors = validateForm(getMetaPlusDataObj(this.pageFormFieldsMeta(), data_obj));
        if (!isObjEmpty(errors)) {
            Object.assign(this.form_errors, errors);
            return true;
        } else if (this.form_errors[input_name]) {
            delete this.form_errors[input_name];
            return true;
        }
        return false;
    }

    checkAndSendForm(form_data) {
        this.form_errors = validateForm(getMetaPlusDataObj(this.pageFormFieldsMeta(), form_data));
        Object.assign(this.form_data, form_data);

        if (isObjEmpty(this.form_errors)) {
            return this.sendForm();
        } 
        return true;
    }

    convertError(mes) {
        const conv_d = {
            'The entered email-address is not a real one': 'Домен введенной почты недоступен',
            'An account with given email already exists': 'Аккаунт с введенной почтой уже существует'
        }
        return conv_d[mes];
    }

    async sendForm() {
        const send_form_data = {};
        Object.assign(send_form_data, this.form_data);
        send_form_data['role'] = this.view.role;
        if (this.view.form_type == this.FORM_TYPES.reg) {
            delete send_form_data['repeat_password'];
            console.log(this.form_data);
            let resp;
            try {
                resp = await APIConnector.post(
                    BACKEND_SERVER_URL + '/users',
                    send_form_data,
                );
                this.clear();
                await User.updateUser();
                router.goToLink('/');
            } catch (err) {
                this.error = this.convertError(JSON.parse(err.message).message);
            }
        } else {
            try {
                const resp = await APIConnector.post(
                    BACKEND_SERVER_URL + '/session',
                    send_form_data,
                );
                this.clear();
                await User.updateUser();
                router.goToLink('/');
            } catch (err) {
                this.error = "Неверный логин или пароль";
            }
        }
        return true;
    }
}

const regAuthStore = new RegAuthStore();
export default regAuthStore;

