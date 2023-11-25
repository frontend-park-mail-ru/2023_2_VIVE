import View from './view.js';

export default class csatpollView extends View {
    async render() {
        await super.render();

        document.querySelector('main').innerHTML = Handlebars.templates['csatpoll']();
        this.addEventListeners();
    }

    addEventListeners() {
        super.addEventListeners();
        // console.log("hello!")
    }
    
    remove() {
        super.remove();
        // document.querySelector('main').innerHTML = "";
    }
}
