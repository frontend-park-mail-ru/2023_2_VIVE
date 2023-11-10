import { BACKEND_SERVER_URL } from '../../../config/config.js';
import APIConnector from '../modules/APIConnector.js';
import router from '../modules/router.js';
import Store from './Store.js';

class ResCreationStore extends Store {
    constructor() {
        super();
        this.page = 1;
        this.pages_data = [
            {},
            {},
            {
                is_exp: false,
                is_end_date: true,
            },
            {},
        ];
    }

    getPageData() {
        return this.pages_data[this.page - 1];
    }

    get page_data() {
        return this.getPageData();
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
            "education_institution_name": {
                type: "text",
                required: true,
            },
            "major_field": {
                type: "text",
                required: true,
            },
            "graduation_year": {
                type: "text",
                digits: true,
                required: true,
            },
        },
        this.getExpFieldsMeta(),
        {
            "description": {
                type: "text",
                required: true,
            },
        },
        ][this.page - 1];
    }

    getExpFieldsMeta() {
        if (!this.page_data.is_exp) {
            return {};
        }

        const without_end_date = {
            "organization_name": {
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
            "expirience_description": {
                type: "text",
                required: true,
            }
        };
        if (this.page_data.is_end_date) {
            return Object.assign(without_end_date, {
                "end_date": {
                    type: "date",
                    required: true,
                }
            });
        }
        return without_end_date;
    }

    async sendForm(form_data) {
        // form_data = Object.assign(form_data, {
        //     "profession_name": "programmist",
        // });
        console.log(form_data);
        try {
            const resp = await APIConnector.post(
                BACKEND_SERVER_URL + '/current_user/cvs',
                form_data,
            );
            router.goToLink('/profile/resumes');
            console.log(resp.status);
        } catch (err) {
            console.error(err);
        }
    }
}

const resCreationStore = new ResCreationStore();
export default resCreationStore;
