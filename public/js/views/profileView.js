import router from '../modules/router.js';
import profileStore from '../stores/profileStore.js';
import mainView from './mainView.js';

export default class profileView extends mainView {
  constructor() {
    super();
  }

  /**
   * Асинхронный метод для отображения страницы
   */
  async render() {
    await super.render();
    
    // eslint-disable-next-line no-undef
    const template = Handlebars.templates['profile'];
    document.querySelector('main').innerHTML = template(profileStore.getContext());

    this.addEventListeners();
  }

  /*
   * Метод, добавляющий обработчики событий на страницу
   */
  addEventListeners() {
    super.addEventListeners();
    
    const profileButtons = document.querySelectorAll('.profile__btn');
    const settingButtons = document.querySelectorAll('[data-name="changing"]');
    const cancelButtons = document.querySelectorAll('[data-name="cancel-changing"]');
    const sendButtons = document.querySelectorAll('[data-name="send-form"]');
    
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
        const type = fields[0].getAttribute('name');

        if (profileStore.checkForm(fields, type)) {
          if (!await profileStore.sendData(fields)) {
            this.render();
          }
        } else {
            this.render();
        }
      });
    });
  }

  async updateInnerData(url) {
    return profileStore.updateInnerData(url);
  }
}
