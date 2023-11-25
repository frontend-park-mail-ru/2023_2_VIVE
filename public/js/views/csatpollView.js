import View from './view.js';

export default class csatpollView extends View {
    async render() {
        await super.render();

        document.querySelector('.container').innerHTML = Handlebars.templates['csatpoll']();
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
