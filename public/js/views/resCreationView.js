import { Constraints, validateForm } from '../modules/constraints.js';
import ResCreationStore from '../stores/ResCreationStore.js';
import User from '../stores/UserStore.js';
import { getFormObject } from '../utils.js';
import View from './view.js';

export default class resCreationView extends View {
  constructor() {
    super();
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
    return this.pages_data[ResCreationStore.page - 1];
  }
  /**
   * Асинхронный метод для отображения страницы
   */
  async render() {
    super.render();
    const template = Handlebars.templates['res_creation'];

    document.querySelector('main').innerHTML = template({
      // user: await User.getUser(),
      page: ResCreationStore.page,
      errors: this.errors,
      data: this.form_data,
      page_data: this.page_data
    });

    this.addEventListeners();
    this.addEventListenersToPage();
  }

  save() {
    const cur_data = getFormObject(new FormData(this.form));
    Object.assign(this.form_data, cur_data);
    console.log(this.form_data);
    return cur_data
  }

  saveAndCheck() {
    const cur_data = this.save();
    return validateForm(ResCreationStore.pageFormFieldsMeta, cur_data);
  }

  addEventListeners() {
    this.form = document.querySelector('.rescr__form')
    const save_cont_btn = document.querySelector('.js-rescr-save-continue');
    if (save_cont_btn) {
      save_cont_btn.addEventListener('click', event => {
        event.preventDefault();

        this.errors = this.saveAndCheck();
        if (Object.keys(this.errors).length === 0) {
          ResCreationStore.page++;
        }
        this.render();
      })
    }

    const back_btn = document.querySelector('.js-rescr-back');
    if (back_btn) {
      back_btn.addEventListener('click', event => {
        event.preventDefault();
        this.save();
        ResCreationStore.page--;
        this.render();
      })
    }

    const submit_btn = document.querySelector(".js-rescr-submit");
    if (submit_btn) {
      submit_btn.addEventListener('click', event => {
        event.preventDefault();

        this.errors = this.saveAndCheck();
        if (Object.keys(this.errors).length === 0) {
          console.log(this.form_data);
        }
        this.render();
      })
    }
  }

  addEventListenersToPage() {
    if (ResCreationStore.page == 3) {
      const is_exp = document.querySelector(".js-name-is-experience");
      is_exp.checked = this.page_data.is_exp;
      is_exp.addEventListener('change', event => {
        this.page_data.is_exp = is_exp.checked;
        this.save();
        this.render();
      })
      if (this.page_data.is_exp) {
        this.addListenersToExpForm();
      }
    }
  }

  addListenersToExpForm() {
    const is_end_date = document.querySelector(".js-name-is-expirience_end_date");
    is_end_date.checked = !this.page_data.is_end_date;
    is_end_date.addEventListener('change', event => {
      this.page_data.is_end_date = !is_end_date.checked;
      this.save();
      this.render();
    })
  }

}
