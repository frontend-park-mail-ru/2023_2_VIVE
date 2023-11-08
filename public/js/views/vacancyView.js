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
        const data = await User.getUser();

        let type = '';

        if (data['role'] === 'applicant') {
            type = 'vac_app';
        } else {
            type = 'vac_emp';
        }

        // eslint-disable-next-line no-undef
        const template = Handlebars.templates[type];
        document.querySelector('main').innerHTML = template({state: this.state});

        this.addEventListeners();
    }

    addEventListeners() {
        const showResponsesButton = document.querySelector('[data-name="responses"]');
        const showDescriptionButton = document.querySelector('[data-name="description"]');
        const refactorMainButton = document.querySelector('[data-name="refactor-main"]');

        showDescriptionButton.addEventListener('click', () => {
            showDescriptionButton.classList.add('d-none');
            showResponsesButton.classList.remove('d-none');
            this.state = 'description';
            router.goToLink('/vacancy/description');
        });

        showResponsesButton.addEventListener('click', () => {
            showResponsesButton.classList.add('d-none');
            showDescriptionButton.classList.remove('d-none');
            this.state = 'responses';
            router.goToLink('/vacancy/responses');
        });

        refactorMainButton.addEventListener('click', () => {
            
        });
    }
}
