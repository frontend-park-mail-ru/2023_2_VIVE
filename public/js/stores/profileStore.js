import { BACKEND_SERVER_URL } from '../../../config/config.js';
import APIConnector from '../modules/APIConnector.js';
import router from "../modules/router/router.js";
import Store from "./Store.js";
import { isObjEmpty } from '../utils.js';
import { validateForm } from '../modules/constraints.js';

const ROLES = {
    app: 'applicant',
    emp: 'employer',
}

class ProfileStore extends Store {
    constructor() {
        super();
        this.form_error = null;
        this.errors = {};
        this.state = 'settings';
        this.data = {};
        this.user = {};
        this.allStatus = {
            'searching': 'Доступно для просмотра',
            'not searching': 'Скрыто для просмотра',
        }
    }

    pageFormFieldMeta(type) {
        let common = null;
        if (type === 'last-name') {
            common = {
                "first-name": {
                    type: "text",
                    required: true,
                    count_words: 1,
                    no_digits: true,
                    max_len: 20,
                },
                "last-name": {
                    type: "text",
                    required: true,
                    count_words: 1,
                    no_digits: true,
                    max_len: 20,
                },
            }
        } else if (type === 'email') {
            common = {
                "email": {
                    type: "text",
                    required: true,
                    count_words: 1,
                    email: true,
                }
            }
        } else if (type === 'password') {
            common = {
                "new_password": {
                    type: "password",
                    required: true,
                    password: true,
                    password_repeat: "repeat_password",   
                },
                "repeat_password": {
                    type: "password",
                    required: true,
                }
            }
        }

        return Object.assign(common,
            {
                "password": {
                    type: "paswword",
                    required: true,
                }
        })
    }

    getContext() {
        const errorsFields = this.errors;
        const formError = this.form_error;
        this.form_error = null;
        this.errors = {};
        return {
            form_error: formError,
            errors: errorsFields,
            state: this.state, 
            user: this.user, 
            data: this.data
        }
    }
    
    getDataObj(meta_obj, data_obj) {
        for (const key in data_obj) {
          if (data_obj[key].value !== undefined) {
            meta_obj[data_obj[key].name]["data"] = data_obj[key].value;
          }
        }
        return meta_obj;
    }

    checkForm(form, type) {
        this.errors[type] = validateForm(this.getDataObj(this.pageFormFieldMeta(type), form));
        const firstErrorKey = Object.keys(this.errors)[0];
        if (isObjEmpty(this.errors[firstErrorKey])) {
            return true;
        } else {
            this.errors["data-" + type] = {};
            for (const key in form) {
                if (form[key].value !== undefined) {
                    Object.assign(this.errors["data-" + type], { [form[key].name]: form[key].value });
                }
            }
            console.log(this.errors);
            return false;
        }
    }

    async sendData(fields) {
        let newDataUser = { ...this.user};
        
        delete newDataUser['repeat_password'];

        fields.forEach(input => {
            newDataUser[input.name.replace(/-/g, '_')] = input.value;
        });

        try {
            const resp = await APIConnector.put(
              BACKEND_SERVER_URL + '/current_user',
              newDataUser,
            );
  
            this.form_error = null;
            this.errors = {};


            router.goToLink(`/profile/settings`);
            return true;
  
        } catch (error) {
            this.form_error = 'Неверный пароль';
            return false;
        }
    }

    async updateInnerData(data) {
        await super.updateInnerData();
        this.user = await this.updateData("/current_user");
    
        const parts = data.url.split('/');
        this.state = parts[2] ? parts[2] : 'settings';
    
        if ((this.state == 'resumes' || this.state == 'responses') && this.user.role == 'employer') {
          return false;
        } else if (this.state == 'vacancies' && this.user.role == 'applicant') {
          return false;
        }
    
        if (this.state == 'vacancies') {
            this.data = await this.updateData("/vacancies/current_user");
        } else if (this.state == 'resumes') {
            this.data = await this.updateData("/current_user/cvs");
        }
    
        return true;
    }

    async updateData(url) {
        try {
            const resp = await APIConnector.get(BACKEND_SERVER_URL + url);
            const data = await resp.json();
            return data;
        } catch(err) {
            return undefined;
        }
    }
}

const profileStore = new ProfileStore();
export default profileStore;
