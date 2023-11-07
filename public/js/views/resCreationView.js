import User from '../stores/userStore.js';
import { getFormObject } from '../utils.js';
import View from './view.js';

export default class resCreationView extends View {
  constructor() {
    super();
    this.page = 1;
    this.data = {};
  }
  /**
   * Асинхронный метод для отображения страницы
   */
  async render() {
    super.render();
    // eslint-disable-next-line no-undef
    const template = Handlebars.templates['res_creation'];
    document.querySelector('main').innerHTML = template({ 
      user: await User.getUser(), 
      page: this.page 
    });

    this.addEventListeners();
    this.addEventListenersToPage();
  }

  addEventListeners() {
    const form = document.querySelector('.rescr__form')
    const save_cont_btn = document.querySelector('.js-rescr-save-continue');
    save_cont_btn.addEventListener('click', event => {
      event.preventDefault();
      this.page++;
      this.render();
      const data = getFormObject(new FormData(form));
      // TODO валидация формы
      console.log(data);
      
    })

    const back_btn = document.querySelector('.js-rescr-back');
    if (back_btn) {
      back_btn.addEventListener('click', event => {
        event.preventDefault();
        this.page--;
        this.render();
      })
    }
  }

  addEventListenersToPage() {
    
  }

}
