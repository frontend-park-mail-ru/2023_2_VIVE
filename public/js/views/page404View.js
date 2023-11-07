import View from './view.js';

export default class page404View extends View {
    async render() {
        super.render();
        this.compileTemplates();
        this.addEventListeners();
    }

    compileTemplates() {
        document.querySelector('main').innerHTML = Handlebars.templates['page404']();
    }

    addEventListeners() {
        super.addEventListeners();
    }
    
    remove() {
        super.remove();
        document.querySelector('main').innerHTML = "";
    }
}
