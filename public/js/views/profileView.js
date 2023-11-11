import { BACKEND_SERVER_URL } from '../../../config/config.js';
import APIConnector from '../modules/APIConnector.js';
import router from '../modules/router.js';
import User from '../stores/UserStore.js';
import View from './view.js';

export default class profileView extends View {
  constructor() {
    super();
    this.state = 'settings';
    this.data = {};
    this.user = {};
    this.allStatus = {
      'searching': 'Доступно для просмотра',
      'not searching': 'Скрыто для просмотра',
    }
  }

  /**
   * Асинхронный метод для отображения страницы
   */
  async render() {
    // eslint-disable-next-line no-undef
    const template = Handlebars.templates['profile'];
    document.querySelector('main').innerHTML = template({state: this.state, user: this.user, data: this.data});

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
    const buttonsWithResumeId = document.querySelectorAll('[resume-id]');

    // Добавить обработчик событий для каждой кнопки
    buttonsWithVacancyId.forEach(button => {
      button.addEventListener('click',() => {
        const vacId = button.getAttribute('vacancy-id');
        router.goToLink(`/vacancy/${vacId}`)
      });
    });

    buttonsWithResumeId.forEach(button => {
      button.addEventListener('click', () => {
        const resId = button.getAttribute('resume-id');
        router.goToLink(`/resume/${resId}`);
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

  async getUserResumes() {
    try {
      const resp = await APIConnector.get(BACKEND_SERVER_URL + "/current_user/cvs");
      const data = await resp.json();
      return data;
    } catch(err) {
      return undefined;
    }
  }

  async updateInnerData(url) {
    this.user = await User.getUser();

    const parts = url.split('/');
    this.state = parts[2] ? parts[2] : 'settings';

    if ((this.state == 'resumes' || this.state == 'responses') && this.user.role == 'employer') {
      return false;
    } else if (this.state == 'vacancies' && this.user.role == 'applicant') {
      return false;
    }

    if (this.state == 'vacancies') {
      this.data = await this.getUserVacancies();
    } else if (this.state == 'resumes') {
      this.data = await this.getUserResumes();
    }

    return true;
  }
}
