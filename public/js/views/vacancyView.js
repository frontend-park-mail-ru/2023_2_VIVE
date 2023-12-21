import router from "../modules/router/router.js";
import vacancyStore from '../stores/VacancyStore.js';
import vacsStore from "../stores/VacsStore.js";
import mainView from './mainView.js';
import Handlebars from 'handlebars';

export default class profileView extends mainView {
    constructor() {
        super();
    }

    /**
     * Асинхронный метод для отображения страницы
     */
    async render() {
        await super.render();
        
        // eslint-disable-next-line no-undef
        const template = require('@pages/vac/vac.handlebars');
        document.querySelector('main').innerHTML = template(this.getFullContext(vacancyStore.getContext()));

        this.addEventListeners();
    }

    async updateInnerData(data) {
        return vacancyStore.updateInnerData(data);
    }

    addEventListeners() {
        super.addEventListeners();

        const showResponsesButton = document.querySelector('[data-name="responses"]');
        const showDescriptionButton = document.querySelector('[data-name="description"]');
        const refactorMainButton = document.querySelector('[data-name="refactoring"]');
        const cancelMainRefactoring = document.querySelector('[data-name="cancel-refactoring"]');
        const refactorDescButton = document.querySelector('[data-name="desc-refactoring"]');
        const cancelDescRefactoring = document.querySelector('[data-name="cancel-desc-refactoring"]');
        const sendRefactoringButton = document.querySelector('[data-name="send-refactoring"]');
        const sendDescRefactoringButton = document.querySelector('[data-name="send-desc-refactoring"]');
        const deleteVacancyButton = document.querySelector('[data-name="delete-vacancy"]');

        if (showDescriptionButton) {
            showDescriptionButton.addEventListener('click', () => {
                showDescriptionButton.classList.add('d-none');
                showResponsesButton.classList.remove('d-none');
                vacancyStore.setState('description');
                router.goToLink(`/vacancy/${vacancyStore.getContext().vacancy.id}/description`);
            });
        }

        if (showResponsesButton) {
            showResponsesButton.addEventListener('click', () => {
                showResponsesButton.classList.add('d-none');
                showDescriptionButton.classList.remove('d-none');
                vacancyStore.setState('responses');
                router.goToLink(`/vacancy/${vacancyStore.getContext().vacancy.id}/responses`);
            });
        }

        if (refactorMainButton) {
            refactorMainButton.addEventListener('click', () => {
                const refactoringForm = document.querySelector('.vacancie-refactor');
                const mainInfo = document.querySelector('.vacancie');
                refactoringForm.classList.remove('d-none');
                mainInfo.classList.add('d-none');
            });
        }

        if (refactorDescButton) {
            refactorDescButton.addEventListener('click', () => {
                const refactoringDescForm = document.querySelector('.full-job-info__refactor');
                const descInfo = document.querySelector('.full-job-info');
                refactoringDescForm.classList.remove('d-none');
                descInfo.classList.add('d-none');
            });
        }

        if (cancelDescRefactoring) {
            cancelDescRefactoring.addEventListener('click', () => {
                const refactoringDescForm = document.querySelector('.full-job-info__refactor');
                const descInfo = document.querySelector('.full-job-info');
                refactoringDescForm.classList.add('d-none');
                descInfo.classList.remove('d-none');
            });
        }

        if (deleteVacancyButton) {
            deleteVacancyButton.addEventListener('click', (e) => {
                const template = require('@pages/confirm_action.handlebars');
                document.querySelector('main').innerHTML += template({'action': 'vacancy-del'});
                
                const confirmActionFrame = document.querySelector('.confirm-action__frame');
                const cancelAction = document.querySelectorAll('[data-name="cancel-action"]');
                const confirmAction = document.querySelector('[data-name="confirm-action"]');

                confirmActionFrame.addEventListener('click',(event) => {
                    if (!event.target.matches('.confirm-action__field')) {
                        this.render();
                    }
                })
        
                cancelAction.forEach(action =>
                    action.addEventListener('click', () => {
                        this.render();
                    })
                )

                confirmAction.addEventListener('click', async () => {
                    if  (await vacancyStore.deleteVacancie()) {
                        router.goToLink('/profile/vacancies');
                    } else {
                        this.render();
                    }
                })
            });
        }

        if (cancelMainRefactoring) {
            cancelMainRefactoring.addEventListener('click', () => {
                const refactoringForm = document.querySelector('.vacancie-refactor');
                const mainInfo = document.querySelector('.vacancie');
                refactoringForm.classList.add('d-none');
                mainInfo.classList.remove('d-none');
            });
        }

        if (sendDescRefactoringButton) {
            sendDescRefactoringButton.addEventListener('click', async () => {
                try {
                    const formData = {
                        description: document.querySelector('.input.res__form__field textarea[name="description"]').value
                    };
                    
                    if(vacancyStore.checkForm(formData, 'desc')) {
                        if (!await vacancyStore.sendData(formData)) {
                            this.render();
                        }
                    } else {
                        this.render();
                    }
                } catch(error) {
                    console.error('Error: ', error);
                }
            });
        }

        if (sendRefactoringButton) {
            sendRefactoringButton.addEventListener('click', async () => {
                try {
                    const formData = {
                        name: document.querySelector('.vacancie-refactor input[name="name"]').value,
                        experience: this.getSelectedRadioValue('.vacancie-refactor input[name="experience"]'),
                        employment: this.getSelectedRadioValue('.vacancie-refactor input[name="employment"]'),
                        location: document.querySelector('.vacancie-refactor input[name="location"]').value
                    };

                    if (document.querySelector('.vacancie-refactor input[name="salary_lower_bound"]').value !== "") {
                        Object.assign(formData, {["salary_lower_bound"]: document.querySelector('.vacancie-refactor input[name="salary_lower_bound"]').value});
                    }

                    if (document.querySelector('.vacancie-refactor input[name="salary_upper_bound"]').value !== "") {
                        Object.assign(formData, {["salary_upper_bound"]: document.querySelector('.vacancie-refactor input[name="salary_upper_bound"]').value});
                    }

                    if(vacancyStore.checkForm(formData, 'main')) {
                        if (!await vacancyStore.sendData(formData)) {
                            this.render();
                        }
                    } else {
                        this.render();
                    }
                } catch (error) {
                    console.error('Error: ', error);
                }
            });
        }

        const remFavouriteBtn = document.querySelector('.js-remove-fav-vac');
        if (remFavouriteBtn) {
            remFavouriteBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.removeFavVacLogic(remFavouriteBtn);
            });
        }

        const addFavouriteBtn = document.querySelector('.js-add-fav-vac');
        if (addFavouriteBtn) {
            addFavouriteBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.addFavVacLogic(addFavouriteBtn);
            });
        }
    }

    async removeFavVacLogic(remFavouriteBtn) {
        const svgBlock = remFavouriteBtn.parentNode;
        const vacId = svgBlock.id;
        if (await vacsStore.removeFavouriteVac(vacId)) {
          remFavouriteBtn.remove();
          const newBtn = this.appendAddFavouriteVac(svgBlock);
    
          newBtn.addEventListener('click', (e) => {
            e.preventDefault();
            this.addFavVacLogic(newBtn);
          });
        }
      }
    
      async addFavVacLogic(addFavouriteBtn) {
        const svgBlock = addFavouriteBtn.parentNode;
        const vacId = svgBlock.id;
        if (await vacsStore.setFavouriteVac(vacId)) {
          addFavouriteBtn.remove();
          const newBtn = this.appendRemoveFavouriteVac(svgBlock);
    
          newBtn.addEventListener('click', (e) => {
            e.preventDefault();
            this.removeFavVacLogic(newBtn);
          });
        }
      }
    
      appendAddFavouriteVac(block) {
        const addButton = document.createElement('button');
        addButton.className = 'link-btn js-add-fav-vac vacs__list__item__feed__fav__btn br-10 link-svg_blue--bg d-block';
    
        const svgElement = document.createElementNS("http://www.w3.org/2000/svg", "svg");
        svgElement.setAttribute("xmlns", "http://www.w3.org/2000/svg");
        svgElement.setAttribute("width", "22");
        svgElement.setAttribute("height", "18");
        svgElement.setAttribute("viewBox", "0 0 22 18");
        svgElement.setAttribute("fill", "none");
    
        const pathElement = document.createElementNS("http://www.w3.org/2000/svg", "path");
        pathElement.setAttribute("d", "M10 18L6.825 15.15C5.625 14.0667 4.59583 13.1 3.7375 12.25C2.87917 11.4 2.17083 10.6 1.6125 9.85C1.05417 9.1 0.645833 8.375 0.3875 7.675C0.129167 6.975 0 6.24167 0 5.475C0 3.90833 0.525 2.60417 1.575 1.5625C2.625 0.520833 3.93333 0 5.5 0C6.36667 0 7.19167 0.183333 7.975 0.55C8.75833 0.916667 9.43333 1.43333 10 2.1C10.5667 1.43333 11.2417 0.916667 12.025 0.55C12.8083 0.183333 13.6333 0 14.5 0C15.85 0 16.9833 0.379167 17.9 1.1375C18.8167 1.89583 19.4417 2.85 19.775 4H17.65C17.35 3.33333 16.9083 2.83333 16.325 2.5C15.7417 2.16667 15.1333 2 14.5 2C13.65 2 12.9167 2.22917 12.3 2.6875C11.6833 3.14583 11.1083 3.75 10.575 4.5H9.425C8.90833 3.75 8.32083 3.14583 7.6625 2.6875C7.00417 2.22917 6.28333 2 5.5 2C4.55 2 3.72917 2.32917 3.0375 2.9875C2.34583 3.64583 2 4.475 2 5.475C2 6.025 2.11667 6.58333 2.35 7.15C2.58333 7.71667 3 8.37083 3.6 9.1125C4.2 9.85417 5.01667 10.7208 6.05 11.7125C7.08333 12.7042 8.4 13.9 10 15.3C10.4333 14.9167 10.9417 14.475 11.525 13.975C12.1083 13.475 12.575 13.0583 12.925 12.725L14.35 14.15C13.9833 14.4833 13.5167 14.8958 12.95 15.3875C12.3833 15.8792 11.8833 16.3167 11.45 16.7L10 18ZM17 14V11H14V9H17V6H19V9H22V11H19V14H17Z");
        pathElement.setAttribute("fill", "#0496FF");
    
        svgElement.appendChild(pathElement);
        addButton.appendChild(svgElement);
        block.appendChild(addButton);
    
        return addButton;
    }
    
      appendRemoveFavouriteVac(block) {
        const addButton = document.createElement('button');
        addButton.className = 'link-btn js-remove-fav-vac vacs__list__item__feed__fav__btn br-10 link-svg_blue--bg d-block';
    
        const svgElement = document.createElementNS("http://www.w3.org/2000/svg", "svg");
        svgElement.setAttribute("width", "22");
        svgElement.setAttribute("height", "18");
        svgElement.setAttribute("viewBox", "0 0 22 18");
        svgElement.setAttribute("fill", "none");
    
        const pathElement = document.createElementNS("http://www.w3.org/2000/svg", "path");
        pathElement.setAttribute("d", "M10 18L6.825 15.15C5.625 14.0667 4.59583 13.1 3.7375 12.25C2.87917 11.4 2.17083 10.6 1.6125 9.85C1.05417 9.1 0.645833 8.375 0.3875 7.675C0.129167 6.975 0 6.24167 0 5.475C0 3.90833 0.525 2.60417 1.575 1.5625C2.625 0.520833 3.93333 0 5.5 0C6.36667 0 7.19167 0.183333 7.975 0.55C8.75833 0.916667 9.43333 1.43333 10 2.1C10.5667 1.43333 11.2417 0.916667 12.025 0.55C12.8083 0.183333 13.6333 0 14.5 0C15.9 0 17.175 0.491667 18.325 1.475C19.475 2.45833 20.05 3.79167 20.05 5.475C20.05 5.70833 20.0333 5.95417 20 6.2125C19.9667 6.47083 19.9167 6.73333 19.85 7H17.725C17.8083 6.7 17.875 6.41667 17.925 6.15C17.975 5.88333 18 5.63333 18 5.4C18 4.15 17.5833 3.27083 16.75 2.7625C15.9167 2.25417 15.1667 2 14.5 2C13.65 2 12.9167 2.22917 12.3 2.6875C11.6833 3.14583 11.1083 3.75 10.575 4.5H9.425C8.90833 3.75 8.32083 3.14583 7.6625 2.6875C7.00417 2.22917 6.28333 2 5.5 2C4.55 2 3.72917 2.32917 3.0375 2.9875C2.34583 3.64583 2 4.475 2 5.475C2 6.025 2.11667 6.58333 2.35 7.15C2.58333 7.71667 3 8.37083 3.6 9.1125C4.2 9.85417 5.01667 10.7208 6.05 11.7125C7.08333 12.7042 8.4 13.9 10 15.3C10.4333 14.9167 10.9417 14.475 11.525 13.975C12.1083 13.475 12.575 13.0583 12.925 12.725L14.35 14.15C13.9833 14.4833 13.5167 14.8958 12.95 15.3875C12.3833 15.8792 11.8833 16.3167 11.45 16.7L10 18ZM14 11V9H22V11H14Z");
        pathElement.setAttribute("fill", "#0496FF");
    
        svgElement.appendChild(pathElement);
        addButton.appendChild(svgElement);
        block.appendChild(addButton);
    
        return addButton;
    }

    getSelectedRadioValue(selector) {
        const selectedRadio = document.querySelector(`${selector}:checked`);
        return selectedRadio && selectedRadio.value !== "-1" ? selectedRadio.value : '';
    }
}
