import { FRONTEND_POLL_SERVER_PORT, FRONTEND_SERVER_PORT } from '../../../config/config.js';
import router from "../modules/router/router.js";
import User from '../stores/UserStore.js';
import csatStore from '../stores/csatStore.js';
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
                    
                    // poll_block.innerHTML = '<iframe class="js-csat-poll poll__iframe" src="http://212.233.90.231:' + FRONTEND_POLL_SERVER_PORT + '/csatpoll" frameborder="0"></iframe>';
                    // console.log(await csatStore.getQuestionsFromMain());
                }
            } else {
                if (poll_block.innerHTML != '') {
                    poll_block.innerHTML = '';
                }
            }
        }
        window.addEventListener('message', async event => {
            if (event.origin == 'http://212.233.90.231:' + FRONTEND_POLL_SERVER_PORT) {
                if (event.data == 'close') {
                    poll_block.innerHTML = '';
                }
                if (event.data == 'get') {
                    // console.log(JSON.stringify(await csatStore.getQuestionsFromMain()))
                    window.frames[0].postMessage("hello", 'http://212.233.90.231:' + FRONTEND_POLL_SERVER_PORT);
                }
                if (event.data == 'send') {
                    csatStore.sendFormFromMain(event.data);
                }
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
                if (!event['processed']) {
                    router.goToLink(getHrefFromLink(link))
                    event['processed'] = true;
                }
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
