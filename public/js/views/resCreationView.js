import View from './view.js';

export default class resCreationView extends View {
  /**
   * Асинхронный метод для отображения страницы
   */
  async render() {
    super.render();
    // eslint-disable-next-line no-undef
    const template = Handlebars.templates['res_creation'];
    document.querySelector('main').innerHTML = template({page: 1});

    this.addEventListeners();
  }

}
