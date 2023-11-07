import Store from './store.js';


export default class resCreationStore extends Store {
    constructor() {
        super();
        this.form_fields = [
            [
                {
                    name: "profession",
                    type: "text",
                    required: true,
                },
                {
                    name: "first_name",
                    type: "text",
                    count_words: 1,
                    digits: false,
                    required: true,
                },
                {
                    name: "last_name",
                    type: "text",
                    count_words: 1,
                    digits: false,
                    required: true,
                },
                {
                    name: "gender",
                    type: "radio",
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
                    required: true,
                },
            ],
            [
                {
                    name: "is_expirience",
                    type: "checkbox",
                    required: false,
                }
                {
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
                    required: false,
                },
            ]
        ]
    }


}
