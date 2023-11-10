import router from '../modules/router.js';
import { getHrefFromLink } from '../utils.js';

export default class View {
    constructor() {

    }

    /**
   * Асинхронный метод для отображения страницы
   */
    async render() {
    }

    /**
    * Метод, добавляющий обработчики событий на страницу
    */
    addEventListeners() {
        const links = document.querySelectorAll('.js-nav-link');
        links.forEach(link => {
            link.addEventListener('click', event => {
                event.preventDefault();
                router.goToLink(getHrefFromLink(link))
            })
        })
    }

    /**
     * Метод, удаляющий обработчики событий
     */
    removeEventListeners() { }

    /**
     * Основной метод, который вызывается при закрытии страницы
     */
    remove() {
        this.removeEventListeners();
    }

    clear() {
        
    }
}
