import { BACKEND_SERVER_URL, FRONTEND_SERVER_PORT } from '../../../config/config.js';
import APIConnector from '../modules/APIConnector.js';

class CsatStore {
    constructor() {
        this.questions = this.getQuestionsFromMain();
        this.current_iter = 0;
        this.clearData();
    }

    setStars(cnt) {
        this.stars = Number(cnt);
    }

    setComment(value) {
        this.comment = value;
    }

    getContext() {
        return {
            question: this.questions[this.current_iter],

            end: (this.current_iter === this.questions.length) ? true : false
        };
    }


    clearData() {
        this.stars = 0;
        this.comment = '';
    }

    nextQuestion() {
        this.current_iter++;
        this.clearData();
        if (this.current_iter == this.questions.length) {
            window.parent.postMessage('close', 'http://212.233.90.231:8085');
            // setTimeout(window.parent.postMessage, 1000, 'close', 'http://212.233.90.231:' + FRONTEND_SERVER_PORT);
        }
    }

    sendForm() {
        console.log(
            {
                'comment': this.comment,
                'starts': this.stars,
            }
        );
    }

    //===================Main site

    getQuestionsFromMain() {
        return [
            "Насколько вы удовлетворены использованием сервиса?",
            "Куришь?",
            "Паришь?"
        ]
    }


    async sendFormFromMain(question) {
        try {
            const resp = await APIConnector.get(BACKEND_SERVER_URL + '/vacancies');
            const data = await resp.json();
            return data;
          } catch (err) {
            console.error(err);
            return undefined;
          }
    }

}

const csatStore = new CsatStore();
export default csatStore;
