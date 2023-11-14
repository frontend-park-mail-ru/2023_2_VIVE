import router from '../modules/router.js';
import vacancyStore from '../stores/VacancyStore.js';
import View from './view.js';

export default class profileView extends View {
    constructor() {
        super();
    }

    /**
     * Асинхронный метод для отображения страницы
     */
    async render() {
        // eslint-disable-next-line no-undef
        const template = Handlebars.templates['vac'];
        document.querySelector('main').innerHTML = template(vacancyStore.getContext());

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
    }

    getSelectedRadioValue(selector) {
        const selectedRadio = document.querySelector(`${selector}:checked`);
        return selectedRadio && selectedRadio.value !== "-1" ? selectedRadio.value : '';
    }
}
