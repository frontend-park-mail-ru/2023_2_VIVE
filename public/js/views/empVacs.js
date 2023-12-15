import empVacsStore from '../stores/empVacs.Store.js';
import mainView from './mainView.js';
import Handlebars from 'handlebars';

export default class empVacs extends mainView {
    constructor() {
        super();
    }


    async render() {
        await super.render();

        if (screen.width < 768) {
            const footer = document.querySelector("footer");
            if (footer !== null) {
                footer.remove();
            }
        }

        const template = Handlebars.templates['empVacs'];
        document.querySelector('main').innerHTML = template(empVacsStore.getContext());

        this.addEventListeners();
    }

    async updateInnerData(data) {
        return empVacsStore.updateInnerData(data);
    }

    addEventListeners() {
        super.addEventListeners();
    }
}
