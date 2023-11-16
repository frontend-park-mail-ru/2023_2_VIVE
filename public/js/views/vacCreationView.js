import vacancyStore from '../stores/VacancyStore.js';
import { getFormObject } from '../utils.js';
import mainView from './mainView.js'

export default class vacCreationView extends mainView {
  async render() {
    vacancyStore.clear();
    this.rerender();
  }

  async rerender() {
    await super.render();
    const template = Handlebars.templates['vac_creation'];
    document.querySelector('main').innerHTML = template(vacancyStore.getCreationContext());

    this.addEventListeners();
  }

  addEventListeners() {
    super.addEventListeners();

    if (vacancyStore.cur_input) {
      const cur_input = document.querySelector('[name=' + vacancyStore.cur_input.name + ']');
      if (cur_input) {
        cur_input.focus();
        cur_input.select();
        window.getSelection().collapseToEnd();
      }
    }

    const form = document.querySelector('.vaccr__form');

    const form_input_btns = document.querySelectorAll('.res__form__input');
    form_input_btns.forEach(form_input => {
      form_input.addEventListener('input', event => {
        if (vacancyStore.checkAndSaveInput(form_input.name, form_input.value)) {
          this.rerender();
        }
      })
    })

    const back_btn = document.querySelector('.js-vaccr-back');
    if (back_btn) {
      back_btn.addEventListener('click', event => {
        event.preventDefault();
        if (vacancyStore.prevForm()) {
          this.rerender();
        }
      })
    }

    const save_cont_btn = document.querySelector('.js-vaccr-save-continue');
    if (save_cont_btn) {
      save_cont_btn.addEventListener('click', event => {
        event.preventDefault();
        if (vacancyStore.saveFormAndContinue(getFormObject(new FormData(form)))) {
          this.rerender();
        }
      })
    }

    const submit_btn = document.querySelector(".js-vaccr-submit");
    if (submit_btn) {
      submit_btn.addEventListener('click', async event => {
        event.preventDefault();
        if (await vacancyStore.checkAndSendForm(getFormObject(new FormData(form)))) {
          this.rerender();
        }
      })
    }


  }





}
