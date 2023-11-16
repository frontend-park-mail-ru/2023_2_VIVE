import View from './view.js';

export default class page404View extends View {
    async render() {
        await super.render();

        document.querySelector('main').innerHTML = Handlebars.templates['page404']();
        this.addEventListeners();
    }

    addEventListeners() {
        super.addEventListeners();
    }
    
    remove() {
        super.remove();
        // document.querySelector('main').innerHTML = "";
    }
}
