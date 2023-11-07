import { BACKEND_SERVER_URL } from '../../../config/config.js';
import APIConnector from '../modules/APIConnector.js';
import router from '../modules/router.js';

export default class profileView {
  constructor() {
    this.state = 'settings';
  }

  /**
   * Асинхронный метод для отображения страницы
   */
  async render() {

    const data = await this.getUser()

    // eslint-disable-next-line no-undef
    const template = Handlebars.templates['profile_app'];
    document.querySelector('main').innerHTML = template({state: this.state, data: data});

    this.addEventListeners();
  }

  async getUser() {
    try {
      const resp = await APIConnector.get(BACKEND_SERVER_URL + '/current_user');
      return await resp.json();
    } catch (err) {
      console.error(err);
      return undefined;
    }
  }

  /*
   * Метод, добавляющий обработчики событий на страницу
   */
  addEventListeners() {
    const profileButtons = document.querySelectorAll('.profile__btn');
    const settingButtons = document.querySelectorAll('[data-name="changing"]');
    const cancelButtons = document.querySelectorAll('[data-name="cancel-changing"]');

    profileButtons.forEach(button => {
      button.addEventListener('click', () => {
        const buttonName = button.getAttribute('data-name');
        this.changeStateAndRender(buttonName);
      });
    });

    settingButtons.forEach(button => {
      button.addEventListener('click', () => {
        const buttonName = button.getAttribute('type');
        const changingBlock = document.querySelector(`[data-name="changing-${buttonName}"]`);
        const nonVisibleBlock = document.querySelector(`[data-name="setting-${buttonName}"]`);
        changingBlock.classList.remove('ch-i__d-none');
        nonVisibleBlock.classList.add('ch-i__d-none');
      });
    });

    cancelButtons.forEach(button => {
      button.addEventListener('click', () => {
        const changingBlock = button.parentNode.parentNode;
        const defaultBlock = changingBlock.nextElementSibling;
        changingBlock.classList.add('ch-i__d-none');
        defaultBlock.classList.remove('ch-i__d-none');
      });
    });
  }
  
  changeStateAndRender(newState) {
    this.state = newState;
    router.goToLink(`/profile/${newState}`)
  }

  /**
   * Метод, удаляющий обработчики событий
   */
  removeEventListeners() {}

  /**
   * Основной метод, который вызывается при закрытии страницы
   */
  remove() {
    this.removeEventListeners();
  }
}
