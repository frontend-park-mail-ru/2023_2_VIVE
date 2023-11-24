import router from "../modules/router/router.js";
import User from '../stores/UserStore.js';
import View from './view.js';

const SEARCH_TYPE = {
    VACANCY: 'vacancy',
    RESUME: 'resune'
};

export default class mainView extends View {
    constructor() {
        super();
        this.search_type = SEARCH_TYPE.VACANCY;
    }
    /**
       * Асинхронный метод для отображения меню
       */
    async render() {
        await super.render();
        
        document.querySelector('header').innerHTML = Handlebars.partials['header']({ user: await User.getUser(), search_type: this.search_type });
        document.querySelector('footer').innerHTML = Handlebars.partials['footer']({ user: await User.getUser() });
    }

    /**
     * Метод, добавляющий обработчики событий на страницу
     */
    addEventListeners() {
        super.addEventListeners();

        this.addDropListener();
        this.profileDropListener();
        this.searchTypeListener();
    }

    searchTypeListener() {
        const searchDropdown = document.querySelector('[name="search-dropdown"]');
        const searchContentDropdown = document.querySelector('.dropdown__content-search');
        const searchSvgIcon = document.querySelector('[name="search-svg-icon"]');
        const searchType = document.querySelector('[name="search-type"]');

        if (searchDropdown) {
            searchDropdown.addEventListener('click', function(event) {
                const isContentVisible = !searchContentDropdown.classList.contains('d-none');

                if (isContentVisible) {
                    searchSvgIcon.classList.remove('rotate-180');
                    searchContentDropdown.classList.add('d-none');
                } else {
                    searchSvgIcon.classList.add('rotate-180');
                    searchContentDropdown.classList.remove('d-none');
                }

                event.stopPropagation();
            });

            document.addEventListener('click', function (event) {
                if (!searchContentDropdown.contains(event.target) && !searchDropdown.contains(event.target)) {
                    searchSvgIcon.classList.remove('rotate-180');
                    searchContentDropdown.classList.add('d-none');
                }
            });

            const resumeSearch = document.querySelector('[name="resume-search"]');
            const vacancySearch = document.querySelector('[name="vacancy-search"]');

            resumeSearch.addEventListener('click', () => {
                resumeSearch.classList.add('dropdown-search__item_active');
                vacancySearch.classList.remove('dropdown-search__item_active');
                this.search_type = SEARCH_TYPE.RESUME;
                searchType.innerHTML = 'Резюме';
            })

            vacancySearch.addEventListener('click', () => {
                vacancySearch.classList.add('dropdown-search__item_active');
                resumeSearch.classList.remove('dropdown-search__item_active');
                this.search_type = SEARCH_TYPE.VACANCY;
                searchType.innerHTML = 'Вакансия';
            });
        }
    }

    addDropListener() {
        const profileDropdown = document.querySelector('[name="drop-btn-profile"]');
        const profileContentDropdown = document.querySelector('.dropdown__content__profile');

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
    }

    profileDropListener() {
        const addInfoDropdown = document.querySelector('[name="drop-btn-add"');
        const addInfoContentDropdown = document.querySelector('.dropdown__content-add-info');
        const addInfoNav = document.querySelector('.navbar__item__drp-menu');

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
