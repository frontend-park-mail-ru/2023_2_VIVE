import { BACKEND_SERVER_URL } from '../../../config/config.js';
import APIConnector from '../modules/APIConnector.js';
import router from '../modules/router.js';
import User from '../stores/userStore.js';
import View from './view.js';

export default class profileView extends View {
  constructor() {
    super();
    this.state = 'settings';
  }

  /**
   * Асинхронный метод для отображения страницы
   */
  async render() {

    const user = await User.getUser();
    let data = {};

    if (this.state == 'vacancies') {
      console.log(200);
      data = await this.getUserVacancies();
    }

    // eslint-disable-next-line no-undef
    const template = Handlebars.templates['profile'];
    document.querySelector('main').innerHTML = template({state: this.state, user: user, data: data});

    this.addEventListeners();
  }

  /*
   * Метод, добавляющий обработчики событий на страницу
   */
  addEventListeners() {
    const profileButtons = document.querySelectorAll('.profile__btn');
    const settingButtons = document.querySelectorAll('[data-name="changing"]');
    const cancelButtons = document.querySelectorAll('[data-name="cancel-changing"]');
    const sendButtons = document.querySelectorAll('[data-name="send-form"]');
    const buttonsWithVacancyId = document.querySelectorAll('[vacancy-id]');

    // Добавить обработчик событий для каждой кнопки
    buttonsWithVacancyId.forEach(button => {
      button.addEventListener('click',() => {
        const vacId = button.getAttribute('vacancy-id');
        router.goToLink(`/vacancy/${vacId}`)
      });
    });
    
    profileButtons.forEach(button => {
      button.addEventListener('click', () => {
        const buttonName = button.getAttribute('data-name');
        this.state = buttonName;
        router.goToLink(`/profile/${buttonName}`)
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

    sendButtons.forEach(button => {
      button.addEventListener('click', async () => {
        const changingFullNameForm = button.closest('.changing-inpute');
        const fields = changingFullNameForm.querySelectorAll('input');

        try {
          const user = await User.getUser();
          
          fields.forEach(input => {
            user[input.name.replace(/-/g, '_')] = input.value;
          });

          const resp = await APIConnector.put(
            BACKEND_SERVER_URL + '/current_user',
            user,
          );

          router.goToLink(`/profile/settings`);

        } catch (error) {
          console.error('Error: ', error);
        }
      });
    });
  }

  async getUserVacancies() {
    try {
      const resp = await APIConnector.get(BACKEND_SERVER_URL + "/vacancies/current_user");
      const data = await resp.json();
      return data;
    } catch(err) {
        return undefined;
    }
  }
}
