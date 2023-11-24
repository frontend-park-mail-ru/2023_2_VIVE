import router from "../modules/router/router.js";
import User from '../stores/UserStore.js';
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

        const profileDropdown = document.querySelector('[name="drop-btn-profile"]');
        const profileContentDropdown = document.querySelector('.dropdown__content__profile');

        const addInfoDropdown = document.querySelector('[name="drop-btn-add"');
        const addInfoContentDropdown = document.querySelector('.dropdown__content-add-info');
        const addInfoNav = document.querySelector('.navbar__item__drp-menu');

        if (profileDropdown) {
            profileDropdown.addEventListener('click', function (event) {
                const isContentVisible = !profileContentDropdown.classList.contains('d-none');

                if (isContentVisible) {
                    profileDropdown.classList.remove('dropdown__img--rotate');
                    profileDropdown.classList.add('dropdown__img--rotate-secondary');
                    profileContentDropdown.classList.add('d-none');
                } else {
                    profileDropdown.classList.remove('dropdown__img--rotate-secondary');
                    profileDropdown.classList.add('dropdown__img--rotate');
                    profileContentDropdown.classList.remove('d-none');
                }

                event.stopPropagation();
            });

            document.addEventListener('click', function (event) {
                if (!profileContentDropdown.contains(event.target) && !profileDropdown.contains(event.target)) {
                    profileDropdown.classList.remove('dropdown__img--rotate');
                    profileDropdown.classList.add('dropdown__img--rotate-secondary');
                    profileContentDropdown.classList.add('d-none');
                }
            });
            
            const switchBtn = document.querySelector('[name="switch"]');
            const leaveBtn = document.querySelector('[name="leave"]');

            switchBtn.addEventListener('click', async (e) => {
                e.preventDefault();
                try {
                    await User.logout();
                    if (User.getUser().role === User.ROLES.app) {
                        router.goToLink('/app_auth');
                    } else {
                        router.goToLink('/emp_auth');
                    }
                } catch (err) {
                    console.error('logout: ', err);
                }
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

        if (addInfoDropdown) {
            addInfoDropdown.addEventListener('click', function (event) {
                const isContentVisible = !addInfoContentDropdown.classList.contains('d-none');

                if (isContentVisible) {
                    addInfoContentDropdown.classList.add('d-none');
                    addInfoNav.classList.remove('minus');
                } else {
                    addInfoContentDropdown.classList.remove('d-none');
                    addInfoNav.classList.add('minus');
                }

                event.stopPropagation();
            });

            document.addEventListener('click', function (event) {
                if (!addInfoContentDropdown.contains(event.target) && !addInfoDropdown.contains(event.target)) {
                    addInfoNav.classList.remove('minus');
                    addInfoContentDropdown.classList.add('d-none');
                }
            });
        }
    }

    clear() {
        document.querySelector('header').innerHTML = "";
        document.querySelector('footer').innerHTML = "";
    }
}
