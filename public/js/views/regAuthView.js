import { getFormObject } from '../utils.js';
import mainView from './mainView.js';
import regAuthStore from '../stores/RegAuthStore.js';
import Handlebars from 'handlebars';

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
        await super.render();
        regAuthStore.sendView(this);

        if (screen.width < 768) {
            const header = document.querySelector("header");
            const footer = document.querySelector("footer");
            if (header !== null && footer !== null) {
                header.remove();
                footer.remove();
            }
        }
        
        const template = require('@pages/form_login_reg.handlebars');
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
