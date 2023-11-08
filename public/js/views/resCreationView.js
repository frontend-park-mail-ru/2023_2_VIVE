import { Constraints, validateForm } from '../modules/constraints.js';
import ResCreationStore from '../stores/resCreationStore.js';
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
    if (save_cont_btn) {
      save_cont_btn.addEventListener('click', event => {
        event.preventDefault();
        this.render();
        const cur_data = getFormObject(new FormData(form));
        // TODO валидация формы
        console.log(cur_data);
        console.log("validate result: ",validateForm(ResCreationStore.form_fields[this.page - 1], cur_data))
        Object.assign(this.data, cur_data);
        console.log(this.data);

        this.page++;
      })
    }

    const back_btn = document.querySelector('.js-rescr-back');
    if (back_btn) {
      back_btn.addEventListener('click', event => {
        event.preventDefault();
        this.page--;
        this.render();
      })
    }

    const submit_btn = document.querySelector(".js-rescr-submit");
    if (submit_btn) {
      submit_btn.addEventListener('click', event => {
        event.preventDefault();
        const cur_data = getFormObject(new FormData(form));
        
        console.log(cur_data);
      })
    }
  }

  addListenersToExpForm() {
    const is_end_date = document.querySelector(".js-name-is-expirience_end_date");
    const block_end_date = document.querySelector(".js-block-expirience_end_date");
    if (!is_end_date.checked) {
      block_end_date.innerHTML = Handlebars.partials['res_form_exp_end_date']();
    }
    is_end_date.addEventListener('change', event => {
      if (is_end_date.checked) {
        block_end_date.innerHTML = "";
      } else {
        block_end_date.innerHTML = Handlebars.partials['res_form_exp_end_date']();
      }
    })
  }

  addEventListenersToPage() {
    if (this.page == 3) {
      const is_exp = document.querySelector(".js-name-is-experience");
      const exp_form = document.querySelector(".js-res-form-exp");
      is_exp.addEventListener('change', event => {
        if (is_exp.checked) {
          exp_form.innerHTML = Handlebars.partials['res_form_exp']();
          if (!this.addedListenersToExpForm) {
            this.addedListenersToExpForm = true;
            this.addListenersToExpForm();
          }
        } else {
          exp_form.innerHTML = "";
        }
      })

    }
  }

}
