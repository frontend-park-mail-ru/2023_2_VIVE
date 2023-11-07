import router from '../modules/router.js';

export default class profileView {
  constructor() {
    this.state = 'settings';
  }

  /**
   * Асинхронный метод для отображения страницы
   */
  async render() {
    // eslint-disable-next-line no-undef
    const template = Handlebars.templates['profile_app'];
    document.querySelector('main').innerHTML = template({state: this.state});

    this.addEventListeners();
  }


  /*
   * Метод, добавляющий обработчики событий на страницу
   */
  addEventListeners() {
    const buttons = document.querySelectorAll('.profile__btn');

    buttons.forEach(button => {
      button.addEventListener('click', () => {
        const buttonName = button.getAttribute('data-name');
        this.changeStateAndRender(buttonName);
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
