export default class resViewView {
  /**
   * Асинхронный метод для отображения страницы
   */
  async render() {
    // eslint-disable-next-line no-undef
    const template = Handlebars.templates['res_view'];
    document.querySelector('main').innerHTML = template({
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
