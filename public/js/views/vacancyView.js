import { BACKEND_SERVER_URL } from '../../../config/config.js';
import APIConnector from '../modules/APIConnector.js';
import router from '../modules/router.js';
import User from '../stores/userStore.js';
import View from './view.js';

export default class profileView extends View {
    constructor() {
        super();
        this.state = 'description';
    }

    /**
     * Асинхронный метод для отображения страницы
     */
    async render() {
        const user = await User.getUser();

        console.log(this.id);

        let type = '';
        let vacancy = await this.getVacancyData(this.id);

        if (user['role'] === 'applicant') {
            type = 'vac_app';
        } else {
            type = 'vac_emp';
        }

        // eslint-disable-next-line no-undef
        const template = Handlebars.templates[type];
        document.querySelector('main').innerHTML = template({state: this.state, vacancy: vacancy});

        this.addEventListeners();
    }

    async getVacancyData(id) {
        try {
            const resp = await APIConnector.get(BACKEND_SERVER_URL + "/vacancies/" + id);
            const data = await resp.json();
            return data;
        } catch(err) {
            return undefined;
        }
    }

    async updateInnerData(data) {
        try {
            const resp = await APIConnector.get(`${BACKEND_SERVER_URL}/vacancies/${data['id']}`);
            this.id = data['id'];
            return true;
        } catch(err) {
            return false;
        }
    }

    addEventListeners() {
        const showResponsesButton = document.querySelector('[data-name="responses"]');
        const showDescriptionButton = document.querySelector('[data-name="description"]');
        const refactorMainButton = document.querySelector('[data-name="refactoring"]');
        const cancelRefactoring = document.querySelector('[data-name="cancel-refactoring"]');
        const sendRefactoringButton = document.querySelector('[data-name="send-refactoring"]');

        showDescriptionButton.addEventListener('click', () => {
            showDescriptionButton.classList.add('d-none');
            showResponsesButton.classList.remove('d-none');
            this.state = 'description';
            router.goToLink(`/vacancy/${this.id}/description`);
        });

        showResponsesButton.addEventListener('click', () => {
            showResponsesButton.classList.add('d-none');
            showDescriptionButton.classList.remove('d-none');
            this.state = 'responses';
            router.goToLink(`/vacancy/${this.id}/responses`);
        });

        refactorMainButton.addEventListener('click', () => {
            const refactoringForm = document.querySelector('.vacancie-refactor');
            const mainInfo = document.querySelector('.vacancie');
            refactoringForm.classList.remove('d-none');
            mainInfo.classList.add('d-none');
        });

        cancelRefactoring.addEventListener('click', () => {
            const refactoringForm = document.querySelector('.vacancie-refactor');
            const mainInfo = document.querySelector('.vacancie');
            refactoringForm.classList.add('d-none');
            mainInfo.classList.remove('d-none');
        });

        sendRefactoringButton.addEventListener('click', async () => {
            try {
                let data = await this.getVacancyData(this.id);

                // const vacancyName = document.querySelector('[name="vacancy_name"]').value;
                // const location = document.querySelector('[name="location"]').value;
                // const incomeFrom = document.querySelector('[name="fromMoney"]').value;
                // const incomeTo = document.querySelector('[name="toMoney"]').value;
                // const experience = document.querySelector('[name="experience"]:checked').value;
                // const busyness = document.querySelector('[name="busyness"]:checked').value;

                // data.name = vacancyName;
                // data.location = location;
                // data.salary_lower_bound = incomeFrom;
                // data.salary_upper_bound = incomeTo;
                // data.experience_lower_bound = experience;

                console.log(data);
                const resp = await APIConnector.put(
                    BACKEND_SERVER_URL + '/vacancies/' + this.id,
                    data,
                );
                router.goToLink(`/vacancy/${this.id}/description`);
                console.log(resp.status);
            } catch (error) {
                console.error('Error: ', error);
            }
        });
    }
}
