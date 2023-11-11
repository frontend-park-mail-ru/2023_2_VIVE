import User from '../stores/UserStore.js';
import View from './view.js';

export default class footerView extends View {

  /**
   * Асинхронный метод для отображения меню
   */
  async render() {
    await super.render();
    await this.compileTemplates();
    super.addEventListeners();
  }

  /**
   * Метод, который компилирует шаблон с данными
   */
  async compileTemplates() {
    // eslint-disable-next-line no-undef
    const template = Handlebars.partials['footer'];
    document.querySelector('footer').innerHTML = template({user: await User.getUser() });
  }

  clear() {
    document.querySelector('footer').innerHTML = "";
  }
}
