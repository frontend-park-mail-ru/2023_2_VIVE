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
    document.querySelector('footer').innerHTML = Handlebars.partials['footer']();
  }
}
