import Store from './Store.js';

class ResCreationStore extends Store {
    constructor() {
        super();
        this.page = 4;
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
            "profession": {
                type: "text",
                required: true,
            },
            "first_name": {
                type: "text",
                required: true,
                count_words: 1,
                nodigits: true,
            },
            "last_name": {
                type: "text",
                required: true,
                count_words: 1,
                nodigits: true,
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
            "location": {
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
            "major_field_name": {
                type: "text",
                required: true,
            },
            "education_graduation_year": {
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
            "expirience_organization_name": {
                type: "text",
                required: true,
            },
            "expirience_position": {
                type: "text",
                required: true,
            },
            "expirience_start_date": {
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
                "expirience_end_date": {
                    type: "date",
                    required: true,
                }
            });
        }
        return without_end_date;
    }

    sendForm(form_data) {
        
    }
}

const resCreationStore = new ResCreationStore();
export default resCreationStore;
