import { Constraints, validateForm } from '../modules/constraints.js';
import ResCreationStore from '../stores/resCreationStore.js';
import User from '../stores/userStore.js';
import { getFormObject } from '../utils.js';
import View from './view.js';

export default class resCreationView extends View {
  constructor() {
    super();
    this.page = 3;
    this.form_data = {};
    this.errors = {};
    this.pages_data = [
      {},
      {},
      {
        is_exp: false,
        is_end_date: true,
      },
      {},
    ];
  }

  get page_data() {
    return this.pages_data[this.page - 1];
  }
  /**
   * Асинхронный метод для отображения страницы
   */
  async render() {
    super.render();
    const template = Handlebars.templates['res_creation'];

    document.querySelector('main').innerHTML = template({
      // user: await User.getUser(),
      page: this.page,
      errors: this.errors,
      data: this.form_data,
      page_data: this.page_data
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
        const cur_data = getFormObject(new FormData(form));

        this.errors = validateForm(ResCreationStore.form_fields[this.page - 1], cur_data);
        console.log(cur_data);
        console.log("validate result: ", this.errors)

        Object.assign(this.form_data, cur_data);
        if (Object.keys(this.errors).length === 0) {
          console.log("validate OK!:", this.form_data);
          this.page++;
        }
        this.render();
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

  addEventListenersToPage() {
    if (this.page == 3) {
      const is_exp = document.querySelector(".js-name-is-experience");
      is_exp.checked = this.page_data.is_exp;
      is_exp.addEventListener('change', event => {
        this.page_data.is_exp = is_exp.checked;
        this.render();
      })
      if (this.page_data.is_exp) {
        this.addListenersToExpForm();
      }
    }
  }

  addListenersToExpForm() {
    const is_end_date = document.querySelector(".js-name-is-expirience_end_date");
    console.log(is_end_date);
    is_end_date.checked = !this.page_data.is_end_date;
    is_end_date.addEventListener('change', event => {
      this.page_data.is_end_date = !is_end_date.checked;
      console.log(this.page_data.is_end_date);
      this.render();
    })
  }

}
