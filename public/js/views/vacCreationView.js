import vacancyStore from '../stores/VacancyStore.js';
import { getFormObject } from '../utils.js';
import mainView from './mainView.js'
import Handlebars from 'handlebars';

export default class vacCreationView extends mainView {
  async render() {
    vacancyStore.clear();
    this.rerender();
  }

  async rerender() {
    await super.render();
    const template = require('@pages/vac/vac_creation.handlebars');
    document.querySelector('main').innerHTML = template(vacancyStore.getCreationContext());

    this.addEventListeners();
  }

  addEventListeners() {
    super.addEventListeners();

    // if (vacancyStore.cur_input) {
    //   const cur_input = document.querySelector('[name=' + vacancyStore.cur_input.name + ']');
    //   if (cur_input) {
    //     cur_input.focus();
    //     const cursor_pos = vacancyStore.cur_input.selectionStart;
    //     // // // console.log(cur_input);
    //     if (cur_input.type == 'text' || cur_input.type == 'textarea') {
    //       cur_input.setSelectionRange(cursor_pos, cursor_pos);
    //     }
    //   }
    // }

    const form = document.querySelector('.vaccr__form');

    const form_input_btns = document.querySelectorAll('.res__form__input');
    form_input_btns.forEach(form_input => {
      form_input.addEventListener('change', event => {
        if (vacancyStore.checkAndSaveInput(form_input)) {
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
