import resStore from '../stores/ResStore.js';
import { getFormObject } from '../utils.js';
import mainView from './mainView.js';
import Handlebars from 'handlebars';

export default class resView extends mainView {
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
    return await resStore.loadResume(url_data.id);

  }

  /**
   * Асинхронный метод для отображения страницы
   */
  async render() {
    await super.render();

    this.rerender();
  }

  async rerender() {
    await super.render();
    const template = require('@pages/resume/res_view.handlebars');
    document.querySelector('main').innerHTML = template(this.getFullContext(resStore.getContext()));

    this.addEventListeners();
  }

  remove() {
    resStore.clear();
  }

  addEventListeners() {
    super.addEventListeners();

    const loadPdfResume = document.querySelector('.js-load-pf-resume');
    if (loadPdfResume) {
      loadPdfResume.addEventListener('click', () => {
        resStore.loadPfdResume();
      });
    }

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
    // // // console.log(forms[])
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

    const deleteResumeButton = document.querySelector('[data-name="delete-resume"]');
    if (deleteResumeButton) {
      deleteResumeButton.addEventListener('click', (e) => {
        const template = require('@pages/confirm_action.handlebars');
        document.querySelector('main').innerHTML += template({ 'action': 'resume-del' });

        const confirmActionFrame = document.querySelector('.confirm-action__frame');
        const cancelAction = document.querySelectorAll('[data-name="cancel-action"]');
        const confirmAction = document.querySelector('[data-name="confirm-action"]');

        confirmActionFrame.addEventListener('click', (event) => {
          if (!event.target.matches('.confirm-action__field')) {
            this.rerender();
          }
        })

        cancelAction.forEach(action =>
          action.addEventListener('click', () => {
            this.rerender();
          })
        )

        confirmAction.addEventListener('click', async () => {
          if (!await resStore.deleteResume()) {
            this.rerender();
          }
        })
      });
    }
  }
}
