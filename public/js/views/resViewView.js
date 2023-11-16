import { BACKEND_SERVER_URL } from '../../../config/config.js';
import APIConnector from '../modules/APIConnector.js';
import resStore from '../stores/ResStore.js';
import User from '../stores/UserStore.js';
import { getFormObject } from '../utils.js';
import View from './view.js';

export default class resViewView extends View {
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

  async updateInnerData(url_data) {
    // url_data = {id:12};
    return await resStore.loadResume(url_data.id);

  }

  /**
   * Асинхронный метод для отображения страницы
   */
  async render() {
    await super.render();
    
    this.rerender();
  }

  rerender() {
    super.render();
    const template = Handlebars.templates['res_view'];
    document.querySelector('main').innerHTML = template(resStore.getContext());

    this.addEventListeners();
  }

  remove() {
    resStore.clear();
  }

  addEventListeners() {
    super.addEventListeners();

    const edit_btns = document.querySelectorAll('.js-edit-page');
    edit_btns.forEach(edit_btn => {
      edit_btn.addEventListener('click', event => {
        event.preventDefault();
        resStore.page = edit_btn.dataset.page;
        if (resStore.changeMode()) {
          this.rerender();
        }
      })
    })

    const cancel_edit_btns = document.querySelectorAll('.js-cancel-edit');
    cancel_edit_btns.forEach(edit_btn => {
      edit_btn.addEventListener('click', event => {
        event.preventDefault();
        resStore.page = edit_btn.dataset.page;
        if (resStore.changeMode()) {
          this.rerender();
        }
      })
    })

    const forms = document.querySelectorAll('.js-edit-form');
    // console.log(forms[])
    forms.forEach(form => {
      form.addEventListener('submit', async event => {
        event.preventDefault();
        resStore.page = form.dataset.page;
        if (await resStore.saveEdit(getFormObject(new FormData(form)))) {
          this.rerender();
        }
      })



      const form_input_btns = form.querySelectorAll('.res__form__input');
      form_input_btns.forEach(form_input => {
        form_input.addEventListener('blur', event => {
          resStore.page = form.dataset.page;
          if (resStore.checkAndSaveInput(form_input.name, form_input.value)) {
            this.rerender();
          }
        })
      })


      if (form.dataset.page == 0) {

        const gender_btns = form.querySelectorAll(".js-gender");
        gender_btns.forEach(gender =>
          gender.addEventListener('change', event => {
            event.preventDefault();
            resStore.page = form.dataset.page;
            if (resStore.checkAndSaveInput(gender.name, gender.value)) {
              this.rerender();
            }
          })
        )
      }

      if (form.dataset.page == 1) {
        const edu_level_btns = form.querySelectorAll(".js-education-level");
        edu_level_btns.forEach(edu_level =>
          edu_level.addEventListener('change', event => {
            event.preventDefault();
            resStore.page = form.dataset.page;
            if (resStore.eduPageIsEdu(edu_level.value)) {
              this.rerender();
            }
          })
        )

        const add_inst = form.querySelector(".js-add-institute");

        if (add_inst) {
          add_inst.addEventListener('click', event => {
            event.preventDefault();
            resStore.page = form.dataset.page;
            if (resStore.eduPageAddForm()) {
              this.rerender();
            }
          })
        }

        const del_inst_btns = document.querySelectorAll(".js-del-institute");
        del_inst_btns.forEach(del_inst => {
          del_inst.addEventListener('click', event => {
            event.preventDefault();
            resStore.page = form.dataset.page;
            if (resStore.eduPageDelForm(del_inst.dataset.num)) {
              this.rerender();
            }
          })
        })

      }


      if (form.dataset.page == 2) {

        const is_exp = document.querySelector(".js-name-is-experience");
        if (is_exp) {
          is_exp.addEventListener('change', event => {
            event.preventDefault();
            resStore.page = form.dataset.page;
            if (resStore.expPageIsExp(is_exp.checked)) {
              this.rerender();
            }
          })
        }

        const add_company = document.querySelector(".js-add-company");
        if (add_company) {
          add_company.addEventListener('click', event => {
            event.preventDefault();
            resStore.page = form.dataset.page;
            if (resStore.expPageAddForm()) {
              this.rerender();
            }
          })
        }

        const del_company_btns = document.querySelectorAll(".js-del-company");
        del_company_btns.forEach(del_company => {
          del_company.addEventListener('click', event => {
            event.preventDefault();
            resStore.page = form.dataset.page;
            if (resStore.expPageDelForm(del_company.dataset.num)) {
              this.rerender();
            }
          })
        })

        const is_end_date_btns = document.querySelectorAll(".js-name-is-expirience_end_date");
        is_end_date_btns.forEach(is_end_date => {
          is_end_date.addEventListener('change', event => {
            event.preventDefault();
            resStore.page = form.dataset.page;
            if (resStore.expPageIsEndDate(is_end_date.dataset.num, is_end_date.checked)) {
              this.rerender();
            }
          })
        })

      }



    })


  }
}
