import router from "../modules/router/router.js";
import searchStore from '../stores/SearchStore.js';
import User from '../stores/UserStore.js';
import { getFormObject } from '../utils.js';
import View from './view.js';


export default class mainView extends View {
    /**
       * Асинхронный метод для отображения меню
       */
    async render() {
        await super.render();

        
        document.querySelector('header').innerHTML = Handlebars.partials['header'](
            { 
                user: await User.getUser(), 
                search_type: searchStore.getType() 
            });
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
        this.mobileDropListener();
        this.mobileSearchListener();
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
                searchStore.setResume();
                searchType.innerHTML = 'Резюме';
            })

            vacancySearch.addEventListener('click', () => {
                vacancySearch.classList.add('dropdown-search__item_active');
                resumeSearch.classList.remove('dropdown-search__item_active');
                searchStore.setVacancy();
                searchType.innerHTML = 'Вакансия';
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

    mobileSearchListener() {
        const searchDropdownMobile = document.querySelector('[name="search-dropdown-mobile"]');
        const searchContentDropdownMobile = document.querySelector('.dropdown__content-search-mobile');
        const searchSvgIconMobile = document.querySelector('[name="search-svg-icon-mobile"]');
        const searchTypeMobile = document.querySelector('[name="search-type-mobile"]');


        if (searchDropdownMobile) {
            searchDropdownMobile.addEventListener('click', function(event) {
                const isContentVisible = !searchContentDropdownMobile.classList.contains('d-none');

                if (isContentVisible) {
                    searchSvgIconMobile.classList.remove('rotate-180');
                    searchContentDropdownMobile.classList.add('d-none');
                } else {
                    searchSvgIconMobile.classList.add('rotate-180');
                    searchContentDropdownMobile.classList.remove('d-none');
                }

                event.stopPropagation();
            });

            document.addEventListener('click', function (event) {
                if (!searchContentDropdownMobile.contains(event.target) && !searchDropdownMobile.contains(event.target)) {
                    searchSvgIconMobile.classList.remove('rotate-180');
                    searchContentDropdownMobile.classList.add('d-none');
                }
            });

            const resumeSearchMobile = document.querySelector('[name="resume-search-mobile"]');
            const vacancySearchMobile = document.querySelector('[name="vacancy-search-mobile"]');

            resumeSearchMobile.addEventListener('click', () => {
                resumeSearchMobile.classList.add('dropdown-search__item_active');
                vacancySearchMobile.classList.remove('dropdown-search__item_active');
                searchStore.setResume();
                searchTypeMobile.innerHTML = 'Резюме';
            })

            vacancySearchMobile.addEventListener('click', () => {
                vacancySearchMobile.classList.add('dropdown-search__item_active');
                resumeSearchMobile.classList.remove('dropdown-search__item_active');
                searchStore.setVacancy();
                searchTypeMobile.innerHTML = 'Вакансия';
            });
        }

        const form = document.querySelector('.js-search-form-mobile');
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
            
            const switchBtn = document.querySelectorAll('[name="switch"]');
            const leaveBtn = document.querySelectorAll('[name="leave"]');

            switchBtn.forEach(element => {
                element.addEventListener('click', async (e) => {
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
            });

            leaveBtn.forEach(element => {
                element.addEventListener('click', async (e) => {
                    e.preventDefault();
                    try {
                        await User.logout();
                        router.goToLink('/');
                    } catch (err) {
                        console.error('logout: ', err);
                    }
                });
            });
        }
    }
    
    mobileDropListener() {
        const mobileDropdown = document.querySelectorAll('[name="drop-btn-mobile"]');
        const mobileContentDropdown = document.querySelectorAll('.dropdown__content__mobile');

        for (let i = 0; i < mobileDropdown.length; i++) {
            mobileDropdown[i].addEventListener('click', ()=> {
                const isContentVisible = !mobileContentDropdown[i].classList.contains('d-none');

                if (isContentVisible) {
                    mobileDropdown[i].classList.remove('dropdown__img--rotate');
                    mobileDropdown[i].classList.add('dropdown__img--rotate-secondary');
                    mobileContentDropdown[i].classList.add('d-none');
                } else {
                    mobileDropdown[i].classList.remove('dropdown__img--rotate-secondary');
                    mobileDropdown[i].classList.add('dropdown__img--rotate');
                    mobileContentDropdown[i].classList.remove('d-none');
                }
            });

            document.addEventListener('click', function (event) {
                if (!mobileContentDropdown[i].contains(event.target) && !mobileDropdown[i].contains(event.target)) {
                    mobileDropdown[i].classList.remove('dropdown__img--rotate');
                    mobileDropdown[i].classList.add('dropdown__img--rotate-secondary');
                    mobileContentDropdown[i].classList.add('d-none');
                }
            });
        }

        const paddingSearchBtn = document.querySelector('[name="paddint-search-btn"]');
        const searchContentMobile = document.querySelector('.navbar__search-mobile');

        paddingSearchBtn.addEventListener('click', ()=> {
            const isContentVisible = !searchContentMobile.classList.contains('d-none');

            if (isContentVisible) {
                searchContentMobile.classList.add('d-none');
            } else {
                searchContentMobile.classList.remove('d-none');
            }

            document.addEventListener('click', function (event) {
                if (!searchContentMobile.contains(event.target) && !paddingSearchBtn.contains(event.target)) {
                    searchContentMobile.classList.add('d-none');
                }
            });
        });
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
