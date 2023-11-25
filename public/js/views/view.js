import router from "../modules/router/router.js";
import pollStore from '../stores/PollStore.js';
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
        console.log('render view');
        if (!pollStore.isclose) {
            pollStore.isclose = true;
            // console.log(window.parent.location.href, window.location.href);
            if (poll_block.innerHTML == '') {
                poll_block.innerHTML = '<iframe class="js-csat-poll poll__iframe" src="http://212.233.90.231:8086/csatpoll" frameborder="0"></iframe>';
            }
        } else {
            if (poll_block.innerHTML != '') {
                poll_block.innerHTML = '';
            }
        }
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

        // const iframe = document.querySelector('.js-csat-poll');
        // if (iframe) { // если iframe только у внешней страницы
        //     console.log(iframe)
        //     iframe.contentWindow.addEventListener('load', event => {
        //         const ifrdoc = iframe.contentWindow.document;
        //         console.log(ifrdoc);
        //         console.log(window.parent.location.href);
        //         const closeBtn = document.querySelector('.js-close-poll')
        //         console.log(closeBtn);
        //         closeBtn.addEventListener('click', event => {
        //             console.log('click');
        //         })
        //     })
        // }
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
