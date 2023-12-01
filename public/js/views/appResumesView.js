import appResumesStore from '../stores/appResumesStore.js';
import empVacsStore from '../stores/empVacs.Store.js';
import mainView from './mainView.js';

export default class appResumes extends mainView {
    constructor() {
        super();
    }


    async render() {
        await super.render();

        const template = Handlebars.templates['appResumes'];
        document.querySelector('main').innerHTML = template(appResumesStore.getContext());

        this.addEventListeners();
    }

    async updateInnerData(data) {
        return appResumesStore.updateInnerData(data);
    }

    addEventListeners() {
        super.addEventListeners();
    }
}