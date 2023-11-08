import User from '../stores/userStore.js';
import View from './view.js';

export default class profileView extends View {
    constructor() {
        super();
        this.state = 'job-description';
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
        document.querySelector('main').innerHTML = template();

        this.addEventListeners();
    }
}
