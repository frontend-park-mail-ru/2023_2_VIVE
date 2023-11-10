import Store from './Store.js';

class ResCreationStore extends Store {
    constructor() {
        super();
        this.page = 3;
    }

    get pageFormFieldsMeta() {
        return [[
            {
                name: "profession",
                type: "text",
                required: true,
            },
            {
                name: "first_name",
                type: "text",
                required: true,
                count_words: 1,
                nodigits: true,
            },
            {
                name: "last_name",
                type: "text",
                required: true,
                count_words: 1,
                nodigits: true,
            },
            {
                name: "gender",
                type: "radio",
                required: true,
            },
            {
                name: "birthday",
                type: "date",
                required: true,
                digits: true,
            },
            {
                name: "location",
                type: "text",
                required: true,
            },
        ],
        [
            {
                name: "education_level",
                type: "radio",
                required: true,
            },
            {
                name: "education_institution_name",
                type: "text",
                required: true,
            },
            {
                name: "major_field_name",
                type: "text",
                required: true,
            },
            {
                name: "education_graduation_year",
                type: "text",
                digits: true,
                required: true,
            },
        ],
        [
            ...this.getExpFieldsMeta()
        ],
        [
            {
                name: "description",
                type: "text",
                required: true,
            },
        ],
        ][this.page - 1];
    }

    getExpFieldsMeta() {
        const is_exp = true;
        const is_end_date = true;
        if (!is_exp) {
            return [];
        }
        
        return [{
            name: "expirience_organization_name",
            type: "text",
            required: true,
        },
        {
            name: "expirience_position",
            type: "text",
            required: true,
        },
        {
            name: "expirience_start_date",
            type: "date",
            required: true,
        },
        {
            name: "expirience_end_date",
            type: "date",
        },
        {
            name: "expirience_description",
            type: "text",
            required: true,
        },]


    }
}

const resCreationStore = new ResCreationStore();
export default resCreationStore;
