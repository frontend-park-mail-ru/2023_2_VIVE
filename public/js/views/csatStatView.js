import csatStatStore from "../stores/csatStatStore.js";
import mainView from "./mainView.js";
import Handlebars from 'handlebars';

export default class csatStatView extends mainView {
    constructor() {
        super();
    }

    async render() {
        await super.render();

        const template = require('@pages/polls/csat_stat.handlebars');
        document.querySelector('main').innerHTML = template(csatStatStore.getContext());

        this.addEventListeners();
    }

    async updateInnerData(data) {
        return await csatStatStore.updateInnerData();
    }

    addEventListeners() {
        
    }
}
