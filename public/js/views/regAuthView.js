import { BACKEND_SERVER_URL } from '../../../config/config.js';
import APIConnector from '../modules/APIConnector.js';
import router from '../modules/router.js';
import { getHrefFromLink, getFormObject } from '../utils.js';
import View from './view.js';
import mainView from './mainView.js';
import regAuthStore from '../stores/RegAuthStore.js';

export default class regAuthView extends mainView {
    /**
     * Конструктор для создания класса, который обрабатывает страницу
     * @constructor
     * @param {string} type - роль пользователя('auth', 'reg')
     * @param {string} role - роль пользователя('app', 'emp')
     */
    constructor(type, role) {
        super();
        this.form_type = type;
        this.role = role;

    }

    /**
     * Основной метод класса, который отображает все необходимое после открытия страницы
     */
    async render() {
        super.render();
        regAuthStore.sendView(this);

        const template = Handlebars.templates['form_login_reg'];
        document.querySelector('main').innerHTML = template(regAuthStore.getContext());

        this.addEventListeners();
    }


    /**
     * Метод, добавляющий обработчики событий на страницу
     */
    addEventListeners() {
        super.addEventListeners();

        const form = document.querySelector('.reg_auth__form');
        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            if (await regAuthStore.checkAndSendForm(getFormObject(new FormData(form)))) {
                this.render();
            }
        });
    }

    clear() {
        super.clear();
    }
}
