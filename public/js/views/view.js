import router from "../modules/router/router.js";
import User from '../stores/UserStore.js';
import { getHrefFromLink } from '../utils.js';

export default class View {
    constructor() {

    }

    /**
   * Асинхронный метод для отображения страницы
   */
    async render() {
        const poll_block = document.querySelector('.poll');
        if (poll_block) { // то есть если мы находимся во внешнем окне, а не в iframe
            if (User.isLoggedIn()) {
                if (poll_block.innerHTML == '') {
                    poll_block.innerHTML = '<iframe class="js-csat-poll poll__iframe" src="http://212.233.90.231:8086/csatpoll" frameborder="0"></iframe>';
                }
            } else {
                if (poll_block.innerHTML != '') {
                    poll_block.innerHTML = '';
                }
            }
        }
        window.addEventListener('message', event=> {
            if (event.data == 'close') {
                poll_block.innerHTML = '';
            }
        })
    }

    /**
    * Метод, добавляющий обработчики событий на страницу
    */
    addEventListeners() {
        const links = document.querySelectorAll('.js-nav-link');

        links.forEach(link => {
            link.addEventListener('click', async event => {
                event.preventDefault();
                router.goToLink(getHrefFromLink(link))
            })
        })
    }

    // eslint-disable-next-line no-unused-vars
    async updateInnerData(data) {
        return true;
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
