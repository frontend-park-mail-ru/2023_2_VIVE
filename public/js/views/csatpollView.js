import View from './view.js';

export default class csatpollView extends View {
    async render() {
        await super.render();

        document.querySelector('main').innerHTML = Handlebars.templates['csatpoll']();
        this.addEventListeners();
    }

    addEventListeners() {
        super.addEventListeners();
        const closeBtn = document.querySelector('.js-close-poll');
        closeBtn.addEventListener('click', event => {
            const winpar = window.parent;
            winpar.postMessage('close', 'http://212.233.90.231:8085');

        });
    }
    
    remove() {
        super.remove();
        // document.querySelector('main').innerHTML = "";
    }
}
