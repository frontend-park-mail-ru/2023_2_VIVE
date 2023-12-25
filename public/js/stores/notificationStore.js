import { BACKEND_SERVER_URL, NOTIF_WS_SERVER_URL } from "../../../config/config.js";
import APIConnector from "../modules/APIConnector.js";
import Store from "./Store.js";
import mp3File from '../../mp3/notification.mp3'
import router from "../modules/router/router.js";
import { getHrefFromLink } from "../utils.js";

class NotificationStore extends Store {
    constructor() {
        super();
        this.notifications = [];
        this.notificationSocket = null;
    }

    async updateData(user) {
       this.updateSocket(user);
        await this.updateNotifications(user);
    }

    getNotifications() {
        return this.notifications;
    }

    pushNotification(data) {
        this.notifications.push(data);
    }

    updateSocket(user) {
        if (this.notificationSocket !== null) {
            return;
        } else if (user === null) {
            if (this.notificationSocket !== null) {
                this.notificationSocket.close();
            }
            this.notificationSocket = null;
            return;
        }

        // this.createSocket();
    }

    createSocket() {
        this.notificationSocket = new WebSocket(NOTIF_WS_SERVER_URL);

        this.notificationSocket.addEventListener('open', () => {
            console.log('socket open!');
        });

        this.notificationSocket.addEventListener('message', async (event) => {
            const notification = JSON.parse(event.data);

            this.notifications.push(notification);

            var audio = new Audio(mp3File);
            audio.play();

            const notificationItem = document.createElement('div');
            notificationItem.classList.add('notification__item');

            const notificationImg = document.createElement('img');
            notificationImg.classList.add('notification__img');
            notificationImg.src = '/images/img/vk-company.png';

            const notificationMainInfo = document.createElement('div');
            notificationMainInfo.classList.add('notification__main-info');

            const notificationLink = document.createElement('a');
            notificationLink.classList.add('js-nav-link', 'link-btn_blue-without-bd', 'common-text', 'common-text--medium');
            if (notification.message === 'New response') {
                notificationLink.href = `/resume/${notification.cv_id}`;
                notificationLink.textContent = 'Новый отклик!';
            } else {
                notificationLink.href = `/vacancy/${notification.vacancy_id}`;
                notificationLink.textContent = 'Просмотр резюме!';
            }

            notificationLink.addEventListener('click', async event => {
                event.preventDefault();
                if (!event['processed']) {
                    router.goToLink(getHrefFromLink(notificationLink))
                    event['processed'] = true;
                }
            })

            const notificationText = document.createElement('span');
            notificationText.classList.add('secondary-text', 'text-dark-regular');
            if (notification.message === 'New response') {
                notificationText.textContent = 'На вашу вакансию откликнулся соискатель';
            } else {
                notificationText.textContent = 'Ваш отклик просмотрел работодатель';
            }

            notificationMainInfo.appendChild(notificationLink);
            notificationMainInfo.appendChild(notificationText);

            notificationItem.appendChild(notificationImg);
            notificationItem.appendChild(notificationMainInfo);

            const circleElement = document.querySelector('.navbar__item__btn circle');
            circleElement.classList.remove('d-none');

            const notificationFrame = document.querySelector('.notification__today');
            notificationFrame.appendChild(notificationItem);
        });

        this.notificationSocket.addEventListener('close', function (event) {
            if (event.wasClean) {
                console.log(`Соединение закрыто чисто, код: ${event.code}, причина: ${event.reason}`);
            } else {
                setTimeout(notificationStore.createSocket(), 6000);
            }
        });
    }

    async updateNotifications(user) {
        if (user === null) {
            this.notifications = [];
            return;
        }

        try {
            const resp = await APIConnector.get(BACKEND_SERVER_URL + `/notifications/${user.id}`);
            this.notifications = (await resp.json()).notifications;
            this.notifications = this.notifications ? this.notifications : [];
        } catch(error) {
            console.error(error);
        }
    }
}

const notificationStore = new NotificationStore();
export default notificationStore;
