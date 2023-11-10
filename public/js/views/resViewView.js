import View from './view.js';

export default class resViewView extends View {
  /**
   * Асинхронный метод для отображения страницы
   */
  async render() {
    super.render();
    // eslint-disable-next-line no-undef
    const template = Handlebars.templates['res_view'];
    document.querySelector('main').innerHTML = template({
    });

    this.addEventListeners();
  }
}
