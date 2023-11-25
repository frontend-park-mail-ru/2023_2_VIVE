import mainView from "./mainView.js";

export default class csatStatView extends mainView {
    constructor() {
        super();
    }

    async render() {
        await super.render();

        const template = Handlebars.templates['csat_stat'];
        document.querySelector('main').innerHTML = template();

        this.addEventListeners();
    }

    updateInnerData(data) {
        return true;
    }

    addEventListeners() {

    }
}