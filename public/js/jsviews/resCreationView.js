export default class resCreationView {
  /**
   * Асинхронный метод для отображения страницы
   */
  async render() {
    // eslint-disable-next-line no-undef
    const template = Handlebars.templates['res_creation'];
    document.querySelector('main').innerHTML = template({
      page: 4,
    });

    this.addEventListeners();
  }

  /**
   * Метод, добавляющий обработчики событий на страницу
   */
  addEventListeners() {}

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
