import mainView from './mainView.js';

export default class profileView extends mainView {
    constructor() {
        super();
    }


    async render() {
        await super.render();

        const template = Handlebars.templates['empVacs'];
        document.querySelector('main').innerHTML = template();

        this.addEventListeners();
    }

    addEventListeners() {
        super.addEventListeners();
    }
}
