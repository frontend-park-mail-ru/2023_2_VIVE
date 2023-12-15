import router from "../modules/router/router.js";
import responseStore from '../stores/responseStore.js';
import mainView from './mainView.js';
import Handlebars from 'handlebars';

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
    }    

    async updateInnerData(data) {
        return await responseStore.updateInnerData(data);
    }
}
