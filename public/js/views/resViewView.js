import { BACKEND_SERVER_URL } from '../../../config/config.js';
import APIConnector from '../modules/APIConnector.js';
import resStore from '../stores/ResStore.js';
import User from '../stores/UserStore.js';
import View from './view.js';

export default class resViewView extends View {
  constructor() {
    super();
  }

  setResumeId(id) {
    resStore.loadResume(id);
    resStore.loadPage(3);
  }

  /**
   * Асинхронный метод для отображения страницы
   */
  async render() {
    super.render();
    this.setResumeId();
    const template = Handlebars.templates['res_view'];
    document.querySelector('main').innerHTML = template(resStore.getContext());

    this.addEventListeners();
  }

  addEventListeners() {
    super.addEventListeners();

    const edit_btns = document.querySelectorAll('.js-edit-page');
    edit_btns.forEach(edit_btn => {
      // if (Re)
    }) 

  }

}
