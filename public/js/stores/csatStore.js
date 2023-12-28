import { BACKEND_SERVER_URL, FRONTEND_SERVER_PORT } from '../../../config/config.js';
import APIConnector from '../modules/APIConnector.js';

class CsatStore {
    constructor() {
        // // console.log()
        // this.getQuestions();
        this.current_iter = 0;
        this.clearData();
    }

    getQuestions() {
        window.parent.postMessage('get', 'http://212.233.90.231:' + FRONTEND_SERVER_PORT);
    }

    async setQuestions() {
        // // // console.log(data);
        this.questions = (await this.getQuestionsFromMain())['questions'];
        // // console.log(this.questions);
    }

    setStars(cnt) {
        this.stars = Number(cnt);
    }

    setComment(value) {
        this.comment = value;
    }

    getContext() {
        if (this.questions) {
            // // console.log(this.questions);
            return {
                question: this.questions[this.current_iter],
                end: (this.current_iter === this.questions.length) ? true : false
            };
        }
        else {
            return {
                end: true
            };
        }
    }


    clearData() {
        this.stars = 0;
        this.comment = '';
    }

    nextQuestion() {
        this.current_iter++;
        this.clearData();
        if (this.current_iter == this.questions.length) {
            window.parent.postMessage('close', 'http://212.233.90.231:' + FRONTEND_SERVER_PORT);
            // setTimeout(window.parent.postMessage, 1000, 'close', 'http://212.233.90.231:' + FRONTEND_SERVER_PORT);
        }
    }

    sendForm() {
        this.sendFormFromMain({
            'comment': this.comment,
            'starts': this.stars,
        });
    }

    //===================Main site

    async getQuestionsFromMain() {
        try {
            const resp = await APIConnector.get(BACKEND_SERVER_URL + '/statistics/questions');
            const data = await resp.json();
            // // // console.log(data);
            return data;
        } catch (err) {
            // console.error(err);
            return undefined;
        }
        // return [
        //     "Насколько вы удовлетворены использованием сервиса?",
        //     "Куришь?",
        //     "Паришь?"
        // ]
    }


    async sendFormFromMain(question) {
        try {
            const sending = Object.assign(question, this.questions[this.current_iter]);
            delete sending['name'];
            delete sending['question'];
            // // console.log(sending);
            const resp = await APIConnector.post(BACKEND_SERVER_URL + '/statistics/questions', sending);

        } catch (err) {
            // console.error(err);

        }
    }

}

const csatStore = new CsatStore();
export default csatStore;
