class CsatStore {
    constructor() {
        this.questions = [
            "Насколько вы удовлетворены использованием сервиса?",
            "Куришь?",
            "Паришь?"
        ];
        this.current_iter = 0;
    };

    getContext() {
        return {
            question: this.questions[this.current_iter],
            end: (this.current_iter + 1 === this.questions.length) ? false: true
        };
    }
    
    sendForm(form) {
        console.log(form);
        this.nextQuestion();
    }

    nextQuestion() {
        this.current_iter++;
    }

}

const csatStore = new CsatStore();
export default csatStore;
