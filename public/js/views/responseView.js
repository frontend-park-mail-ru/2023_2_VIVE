import router from "../modules/router/router.js";
import responseStore from '../stores/responseStore.js';
import mainView from './mainView.js';

export default class responseView extends mainView {
    constructor() {
        super();
    }

    async render() {
        await super.render();
        
        // eslint-disable-next-line no-undef
        const template = Handlebars.templates['response'];
        document.querySelector('main').innerHTML = template(responseStore.getContext());
    
        this.addEventListeners();
    }

    addEventListeners() {
        super.addEventListeners();

        const cancelResponse = document.querySelector('[data-name="cancel-response"]');
        const sendResponse = document.querySelector('[data-name="send-response"]');

        cancelResponse.addEventListener('click', () => {
            router.goToLink('/vacs');
        });

        sendResponse.addEventListener('click', async () => {
            const vacancyElement = document.querySelector('.vacancie');
            const vacancyID = vacancyElement.id;

            const selectElement = document.querySelector('select[name="resumes"]');
            const resumeID = selectElement.value;

            if (!await responseStore.sendResponse(resumeID, vacancyID)) {
                this.render();
            } else {
                router.goToLink('/vacs');
            }
        });

        const salaryInfo = document.querySelectorAll('[name="vacancy-salary"]');
        const experienceInfo = document.querySelectorAll('[name="vacancy-experience"]');
        const employmentInfo = document.querySelectorAll('[name="vacancy-employment"]');
        const locationInfo = document.querySelectorAll('[name="vacancy-location"]');

        salaryInfo.forEach(salary => {
            if (salary.innerText.length > 15) {
                salary.innerText = salary.innerText.substring(0, 15) + "...";
            }
        });
    
        experienceInfo.forEach(experience => {
            if (experience.innerText.length > 10) {
                experience.innerText = experience.innerText.substring(0, 10) + "...";
            }
        });
    
        employmentInfo.forEach(employment => {
            if (employment.innerText.length > 10) {
                employment.innerText = employment.innerText.substring(0, 10) + "...";
            }
        });
    
        locationInfo.forEach(location => {
            if (location.innerText.length > 10) {
                location.innerText = location.innerText.substring(0, 10) + "...";
            }
        });
    }    

    async updateInnerData(data) {
        return await responseStore.updateInnerData(data);
    }
}
