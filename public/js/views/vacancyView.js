export default class profileView {
    /**
     * Асинхронный метод для отображения страницы
     */
    async render() {
        // eslint-disable-next-line no-undef
        const template = Handlebars.templates['vac_app'];
        document.querySelector('main').innerHTML = template();

        this.addEventListeners();
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
