import csatStatStore from "../stores/csatStatStore.js";
import mainView from "./mainView.js";

export default class csatStatView extends mainView {
    constructor() {
        super();
    }

    async render() {
        await super.render();

        const template = Handlebars.templates['csat_stat'];
        document.querySelector('main').innerHTML = template(csatStatStore.getContext());

        this.addEventListeners();
    }

    async updateInnerData(data) {
        return await csatStatStore.updateInnerData();
    }

    addEventListeners() {
        
    }
}