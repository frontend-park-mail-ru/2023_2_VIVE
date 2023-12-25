import { BACKEND_SERVER_URL } from "../../../config/config.js";
import APIConnector from "../modules/APIConnector.js";
import router from "../modules/router/router.js";
import resStore from "../stores/ResStore.js";
import searchStore from '../stores/SearchStore.js';
import User from '../stores/UserStore.js';
import vacsStore from "../stores/VacsStore.js";
import notificationStore from "../stores/notificationStore.js";
import { getFormObject } from '../utils.js';
import View from './view.js';

import Handlebars from 'handlebars';


export default class mainView extends View {
    /**
       * Асинхронный метод для отображения меню
       */
    async render() {
        await super.render();

        document.querySelector('.container').innerHTML = require('@pages/main.handlebars')();

        if (!document.querySelector('header')) {
            const headerElement = document.createElement('header');
            document.querySelector('.container').insertBefore(headerElement, document.querySelector('main'));
        }
        if (!document.querySelector('footer')) {
            const footerElement = document.createElement('footer');
            document.querySelector('.container').appendChild(footerElement);
        }
        let qObj = '';
        if (router.currentUrl().pathname === '/vacs') {
            qObj = vacsStore.qObj ? vacsStore.qObj.q : null;
        } else {
            qObj = resStore.qObj ? resStore.qObj.q : null;
        }

        document.querySelector('header').innerHTML = require('@pages/header.handlebars')(
            {
                user: await User.getUser(),
                search_type: searchStore.getType(),
                qObj: qObj,
                notifications: notificationStore.getNotifications(),
            });
        document.querySelector('footer').innerHTML = require('@pages/footer.handlebars')({ user: await User.getUser() });
    }

    /**
     * Метод, добавляющий обработчики событий на страницу
     */
    addEventListeners() {
        super.addEventListeners();

        this.addDropListener();
        this.profileDropListener();
        this.searchTypeListener();
        this.notificationListener();
    }

    searchTypeListener() {
        const mobileSearchBtn = document.querySelector('[name="mobile-search-btn"]');
        const searchDropdown = document.querySelector('[name="search-dropdown"]');
        const searchContentDropdown = document.querySelector('.dropdown__content-search');
        const searchSvgIcon = document.querySelector('[name="search-svg-icon"]');
        const searchType = document.querySelector('[name="search-type"]');

        if (mobileSearchBtn) {
            const searchMobileField = mobileSearchBtn.nextElementSibling;
            mobileSearchBtn.addEventListener('touchstart', function (event) {
                const isContentVisible = !searchMobileField.classList.contains('navbar__search');

                if (isContentVisible) {
                    searchMobileField.classList.add('navbar__search');
                    searchMobileField.classList.remove('navbar__search_dropdown');
                } else {
                    searchMobileField.classList.remove('navbar__search');
                    searchMobileField.classList.add('navbar__search_dropdown');
                }
            });

            document.addEventListener('click', function (event) {
                if (!searchMobileField.contains(event.target) && !mobileSearchBtn.contains(event.target)) {
                    searchMobileField.classList.add('navbar__search');
                    searchMobileField.classList.remove('navbar__search_dropdown');
                }
            });
        }

        if (searchDropdown) {
            searchDropdown.addEventListener('click', function (event) {
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
                searchStore.setResume();
                searchType.innerHTML = `<div class="search-type__main-var">
                <div class="mobile__search-type">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
                        <path d="M0.729445 2.62325H19.2705C19.5398 2.62325 19.7581 2.84152 19.7581 3.11081V16.8892C19.7581 17.1585 19.5398 17.3768 19.2705 17.3768H0.729445C0.460152 17.3768 0.241882 17.1585 0.241882 16.8892V3.11081C0.241882 2.84152 0.460152 2.62325 0.729445 2.62325ZM4.17947 9.43047C4.17947 10.072 3.20411 10.072 3.20411 9.43047C3.20411 8.66298 3.56128 7.94109 4.16506 7.47171C4.12703 7.41809 4.0916 7.36258 4.05924 7.30541C3.90687 7.03494 3.82018 6.7236 3.82018 6.39289C3.82018 5.36366 4.65452 4.52933 5.68374 4.52933C6.71272 4.52933 7.54729 5.36366 7.54729 6.39289C7.54729 6.78005 7.42706 7.15683 7.20217 7.47171C7.80619 7.94109 8.16336 8.66298 8.16336 9.43047C8.16336 10.072 7.188 10.072 7.188 9.43047C7.188 8.87676 6.8906 8.37455 6.40516 8.10951C6.17862 8.20542 5.92964 8.25644 5.68374 8.25644C5.43783 8.25644 5.18861 8.20542 4.96208 8.10951C4.47688 8.37455 4.17947 8.87676 4.17947 9.43047ZM2.87694 11.6035H8.49029C8.75959 11.6035 8.97809 11.822 8.97809 12.0913V14.9829C8.97809 15.2522 8.75959 15.4707 8.49029 15.4707H2.87694C2.60765 15.4707 2.38938 15.2522 2.38938 14.9829V12.0913C2.38938 11.822 2.60765 11.6035 2.87694 11.6035ZM8.00273 12.5788H3.36474V14.4953H8.00273V12.5788ZM5.68374 5.50469C5.1931 5.50469 4.79554 5.90225 4.79554 6.39289C4.79554 6.89108 5.19476 7.28108 5.68374 7.28108C6.17319 7.28108 6.57193 6.88683 6.57193 6.39289C6.57193 5.90225 6.17413 5.50469 5.68374 5.50469ZM10.0213 6.19257C9.37991 6.19257 9.37991 5.21721 10.0213 5.21721H17.123C17.7644 5.21721 17.7644 6.19257 17.123 6.19257H10.0213ZM11.127 14.7828C10.4854 14.7828 10.4854 13.8072 11.127 13.8072H17.123C17.7644 13.8072 17.7644 14.7828 17.123 14.7828H11.127ZM10.0213 8.34007C9.37991 8.34007 9.37991 7.3647 10.0213 7.3647H17.123C17.7644 7.3647 17.7644 8.34007 17.123 8.34007H10.0213ZM11.127 10.4876C10.4854 10.4876 10.4854 9.5122 11.127 9.5122H17.123C17.7644 9.5122 17.7644 10.4876 17.123 10.4876H11.127ZM11.127 12.6353C10.4854 12.6353 10.4854 11.6597 11.127 11.6597H17.123C17.7644 11.6597 17.7644 12.6353 17.123 12.6353H11.127ZM18.7827 3.59861H1.21724V16.4014H18.7827V3.59861Z" fill="black"/>
                    </svg>
                </div>
                <div class="mobile__d-none">
                    Резюме
                </div>
            </div>`;
            })

            vacancySearch.addEventListener('click', () => {
                vacancySearch.classList.add('dropdown-search__item_active');
                resumeSearch.classList.remove('dropdown-search__item_active');
                searchStore.setVacancy();
                searchType.innerHTML = `<div class="search-type__main-var">
                <div class="mobile__search-type">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
                        <mask id="mask0_2386_16403" style="mask-type:alpha" maskUnits="userSpaceOnUse" x="0" y="0" width="20" height="20">
                            <rect width="20" height="20" fill="#D9D9D9"/>
                        </mask>
                        <g mask="url(#mask0_2386_16403)">
                            <path d="M3.33334 17.5C2.87501 17.5 2.48264 17.3368 2.15626 17.0104C1.82987 16.684 1.66667 16.2917 1.66667 15.8333V6.66667C1.66667 6.20833 1.82987 5.81597 2.15626 5.48958C2.48264 5.1632 2.87501 5 3.33334 5H6.66667V3.33333C6.66667 2.875 6.82987 2.48264 7.15626 2.15625C7.48264 1.82986 7.87501 1.66667 8.33334 1.66667H11.6667C12.125 1.66667 12.5174 1.82986 12.8438 2.15625C13.1701 2.48264 13.3333 2.875 13.3333 3.33333V5H16.6667C17.125 5 17.5174 5.1632 17.8438 5.48958C18.1701 5.81597 18.3333 6.20833 18.3333 6.66667V15.8333C18.3333 16.2917 18.1701 16.684 17.8438 17.0104C17.5174 17.3368 17.125 17.5 16.6667 17.5H3.33334ZM3.33334 15.8333H16.6667V6.66667H3.33334V15.8333ZM8.33334 5H11.6667V3.33333H8.33334V5Z" fill="#1C1B1F"/>
                        </g>
                    </svg>
                </div>
                <div class="mobile__d-none">
                    Вакансия
                </div>
            </div>`;
            });
        }

        const form = document.querySelector('.js-search-form');
        if (form) {
            form.addEventListener('submit', event => {
                event.preventDefault();
                const q = getFormObject(new FormData(form))['q'].trim();
                const data = {
                    'q': q,
                }
                const searchParams = new URLSearchParams(data);
                const input_field = form.elements['q'];
                input_field.value = '';
                const main_link = (searchStore.getType() == searchStore.SEARCH_TYPE.RESUME) ? '/resumes' : '/vacs';
                router.goToLink(main_link + '?' + searchParams.toString());
            })
        }
    }

    notificationListener() {
        const notificationsDropdowns = document.querySelectorAll('[name="drop-btn-notifications"]');

        notificationsDropdowns.forEach(notificationsDropdown => {
            const notificationsContentDropdown = notificationsDropdown.parentNode.nextElementSibling;

            notificationsDropdown.addEventListener('click', function (event) {
                const isContentVisible = !notificationsContentDropdown.classList.contains('d-none');

                if (isContentVisible) {
                    notificationsContentDropdown.classList.add('d-none');
                } else {
                    notificationsContentDropdown.classList.remove('d-none');
                }

                event.stopPropagation();
            });


            document.addEventListener('click', function (event) {
                notificationsDropdowns.forEach(notificationsDropdown => {
                    const notificationsContentDropdown = notificationsDropdown.parentNode.nextElementSibling;

                    if (!notificationsContentDropdown.contains(event.target) && !notificationsDropdown.contains(event.target)) {
                        notificationsContentDropdown.classList.add('d-none');
                    }
                });
            });
        });
    }

    notificationAdd(notification) {

    }

    addDropListener() {
        const profileDropdowns = document.querySelectorAll('[name="drop-btn-profile"]');

        profileDropdowns.forEach(profileDropdown => {
            const profileContentDropdown = profileDropdown.parentNode.nextElementSibling;

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
        });

        document.addEventListener('click', function (event) {
            profileDropdowns.forEach(profileDropdown => {
                const profileContentDropdown = profileDropdown.parentNode.nextElementSibling;

                if (!profileContentDropdown.contains(event.target) && !profileDropdown.contains(event.target)) {
                    profileDropdown.classList.remove('dropdown__img--rotate');
                    profileDropdown.classList.add('dropdown__img--rotate-secondary');
                    profileContentDropdown.classList.add('d-none');
                }
            });
        });

        const switchBtns = document.querySelectorAll('[name="switch"]');
        const leaveBtns = document.querySelectorAll('[name="leave"]');

        if (switchBtns) {
            switchBtns.forEach(switchBtn => {
                switchBtn.addEventListener('click', async (e) => {
                    e.preventDefault();
                    try {
                        const user = User.getUser();
                        await User.logout();
                        if (user.role === User.ROLES.app) {
                            router.goToLink('/app_auth');
                        } else {
                            router.goToLink('/emp_auth');
                        }
                    } catch (err) {
                        // console.error('logout: ', err);
                    }
                });
            });
        }

        if (leaveBtns) {
            leaveBtns.forEach(leaveBtn => {
                leaveBtn.addEventListener('click', async (e) => {
                    e.preventDefault();
                    try {
                        await User.logout();
                        router.goToLink('/');
                    } catch (err) {
                        // console.error('logout: ', err);
                    }
                });
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
