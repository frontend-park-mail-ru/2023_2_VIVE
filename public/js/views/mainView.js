import { BACKEND_SERVER_URL } from '../../../config/config.js';
import APIConnector from '../modules/APIConnector.js';
import router from '../modules/router.js';
import User from '../stores/UserStore.js';
import { getHrefFromLink } from '../utils.js';
import View from './view.js';

export default class mainView extends View {
    /**
       * Асинхронный метод для отображения меню
       */
    async render() {
        await super.render();
        
        document.querySelector('header').innerHTML = Handlebars.partials['header']({ user: await User.getUser() });
        document.querySelector('footer').innerHTML = Handlebars.partials['footer']({ user: await User.getUser() });
    }

    /**
     * Метод, добавляющий обработчики событий на страницу
     */
    addEventListeners() {
        super.addEventListeners();

        const dropdownBtn = document.querySelector('.dropdown__padd-btn');
        const content = document.querySelector('.dropdown__content');

        if (dropdownBtn) {
            dropdownBtn.addEventListener('click', function (event) {
                const isContentVisible = !content.classList.contains('d-none');

                if (isContentVisible) {
                    dropdownBtn.classList.remove('dropdown__img--rotate');
                    dropdownBtn.classList.add('dropdown__img--rotate-secondary');
                    content.classList.add('d-none');
                } else {
                    dropdownBtn.classList.remove('dropdown__img--rotate-secondary');
                    dropdownBtn.classList.add('dropdown__img--rotate');
                    content.classList.remove('d-none');
                }

                event.stopPropagation();
            });

            document.addEventListener('click', function (event) {
                if (!content.contains(event.target) && !dropdownBtn.contains(event.target)) {
                    dropdownBtn.classList.remove('dropdown__img--rotate');
                    dropdownBtn.classList.add('dropdown__img--rotate-secondary');
                    content.classList.add('d-none');
                }
            });

            const profileBtn = document.querySelector('[name="profile"]');
            const settingBtn = document.querySelector('[name="settings"]');
            const switchBtn = document.querySelector('[name="switch"]');
            const leaveBtn = document.querySelector('[name="leave"]');

            profileBtn.addEventListener('click', () => {
                router.goToLink('/profile');
            });

            settingBtn.addEventListener('click', () => {
                router.goToLink('/profile/settings');
            });

            leaveBtn.addEventListener('click', async (e) => {
                e.preventDefault();
                try {
                    await User.logout();
                    router.goToLink('/');
                } catch (err) {
                    console.error('logout: ', err);
                }
            });
        }
    }

    clear() {
        document.querySelector('header').innerHTML = "";
        document.querySelector('footer').innerHTML = "";
    }
}
