import { Constraints, validateForm } from '../modules/constraints.js';
import resStore from '../stores/ResStore.js';
import User from '../stores/UserStore.js';
import { getFormObject, getMetaPlusDataObj } from '../utils.js';
import View from './view.js';

export default class resCreationView extends View {
  constructor() {
    super();
  }

  get page() {
    return resStore.page;
  }

  get page_data() {
    return resStore.page_data;
  }

  get form_data() {
    return resStore.form_data;
  }

  get page_errors() {
    return resStore.errors;
  }

  get page_funcs() {
    return resStore.page_funcs;
  }
  /**
   * Асинхронный метод для отображения страницы
   */
  async render() {
    await super.render();
    
    const template = Handlebars.templates['res_creation'];

    document.querySelector('main').innerHTML = template(resStore.getContext());

    this.addEventListeners();
    this.addEventListenersToPage();
  }
  
  remove() {
    resStore.clear();
  }

  addEventListeners() {
    this.form = document.querySelector('.rescr__form')

    const form_input_btns = document.querySelectorAll('.res__form__input');
    form_input_btns.forEach(form_input => {
      form_input.addEventListener('blur', event => {
        if (resStore.checkAndSaveInput(form_input.name, form_input.value)) {
          this.render();
        }
      })
    })

    const save_cont_btn = document.querySelector('.js-rescr-save-continue');
    if (save_cont_btn) {
      save_cont_btn.addEventListener('click', event => {
        event.preventDefault();
        if (resStore.saveFormAndContinue(getFormObject(new FormData(this.form)))) {
          this.render();
        }
      })
    }

    const back_btn = document.querySelector('.js-rescr-back');
    if (back_btn) {
      back_btn.addEventListener('click', event => {
        event.preventDefault();
        if (resStore.prevForm()) {
          this.render();
        }
      })
    }

    const submit_btn = document.querySelector(".js-rescr-submit");
    if (submit_btn) {
      submit_btn.addEventListener('click', async event => {
        event.preventDefault();
        if (resStore.saveForm(getFormObject(new FormData(this.form)))) {
          this.render();
        } else {
          if (resStore.sendForms()) {
            this.render();
          }
        }
      })
    }
  }

  addEventListenersToPage() {
    if (this.page == 0) {
      const gender_btns = document.querySelectorAll(".js-gender");
      gender_btns.forEach(gender =>
        gender.addEventListener('change', event => {
          event.preventDefault();
          if (resStore.checkAndSaveInput(gender.name, gender.value)) {
            this.render();
          }
        })
      )
    }
    if (this.page == 1) {
      const edu_level_btns = document.querySelectorAll(".js-education-level");
      edu_level_btns.forEach(edu_level =>
        edu_level.addEventListener('change', event => {
          event.preventDefault();
          if (resStore.eduPageIsEdu(edu_level.value)) {
            this.render();
          }
        })
      )

      if (this.form_data.institutions.length > 0) {
        const add_inst = document.querySelector(".js-add-institute");
        add_inst.addEventListener('click', event => {
          event.preventDefault();
          if (resStore.eduPageAddForm()) {
            this.render();
          }
        })

        if (this.form_data.institutions.length > 1) {
          const del_inst_btns = document.querySelectorAll(".js-del-institute");
          del_inst_btns.forEach(del_inst => {
            del_inst.addEventListener('click', event => {
              event.preventDefault();
              if (resStore.eduPageDelForm(del_inst.dataset.num)) {
                this.render();
              }
            })
          })
        }
      }
    }
    else if (this.page == 2) {
      const is_exp = document.querySelector(".js-name-is-experience");
      is_exp.addEventListener('change', event => {
        if (resStore.expPageIsExp(is_exp.checked)) {
          this.render();
        }
      })
      if (this.page_data.is_exp) {
        if (this.form_data.companies.length > 0) {
          const add_company = document.querySelector(".js-add-company");
          add_company.addEventListener('click', event => {
            event.preventDefault();
            if (resStore.expPageAddForm()) {
              this.render();
            }
          })

          if (this.form_data.companies.length > 1) {
            const del_company_btns = document.querySelectorAll(".js-del-company");
            del_company_btns.forEach(del_company => {
              del_company.addEventListener('click', event => {
                event.preventDefault();
                if (resStore.expPageDelForm(del_company.dataset.num)) {
                  this.render();
                }
              })
            })
          }
        }

        const is_end_date_btns = document.querySelectorAll(".js-name-is-expirience_end_date");
        is_end_date_btns.forEach(is_end_date => {
          is_end_date.addEventListener('change', event => {
            if (resStore.expPageIsEndDate(is_end_date.dataset.num, is_end_date.checked)) {
              this.render();
            }
          })
        })
      }
    }
  }
}
