import View from './view.js';
import Handlebars from 'handlebars';

export default class page404View extends View {
    async render() {
        await super.render();
        document.querySelector('main').innerHTML = require('@pages/page404.handlebars')();
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
