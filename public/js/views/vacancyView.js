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
        const refactorDescButton = document.querySelector('[data-name="desc-refactoring"]');
        const cancelRefactoring = document.querySelector('[data-name="cancel-refactoring"]');
        const sendRefactoringButton = document.querySelector('[data-name="send-refactoring"]');

        if (showResponsesButton) {
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

        if (cancelRefactoring) {
            cancelRefactoring.addEventListener('click', () => {
                const refactoringForm = document.querySelector('.vacancie-refactor');
                const mainInfo = document.querySelector('.vacancie');
                refactoringForm.classList.add('d-none');
                mainInfo.classList.remove('d-none');
            });
        }

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

                // console.log(formData);

                if(vacancyStore.checkForm(formData, 'main')) {
                    if (!await vacancyStore.sendData(formData, 'main')) {
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

    getSelectedRadioValue(selector) {
        const selectedRadio = document.querySelector(`${selector}:checked`);
        return selectedRadio && selectedRadio.value !== "-1" ? selectedRadio.value : '';
    }
}
