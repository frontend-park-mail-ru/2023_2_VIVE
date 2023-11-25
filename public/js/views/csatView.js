import csatStore from "../stores/csatStore.js";

export default class csatView {
    constructor() {

    }

    render() {
        const template = Handlebars.templates['csat'];
        document.querySelector('main').innerHTML = template(csatStore.getContext());

        this.addEventListeners();
    }

    updateInnerData(data) {
        return true;
    }

    addEventListeners() {
        this.starsListener();
        this.skipBtnListener();
        this.nextBtnListener();
    }

    starsListener() {
        const stars = document.querySelectorAll('.csat__star');

        stars.forEach(function(star) {
            star.addEventListener('mouseover', () => {
                const starId = star.id;
                for (let i = 0; i < starId; i++) {
                    stars[i].classList.add('csat__star_active');
                }
            });
        });

        stars.forEach(function(star) {
            star.addEventListener('mouseout', () => {
                const starId = star.id;
                for (let i = 0; i < starId; i++) {
                    stars[i].classList.remove('csat__star_active');
                }
            });
        });

        stars.forEach(function(star) {
            star.addEventListener('click', () => {
                const starId = star.id;
                for (let i = 0; i < starId; i++) {
                    stars[i].classList.remove('csat__star');
                    stars[i].classList.add('csat__star_active');
                }

                for (let i = starId; i < stars.length; i++) {
                    stars[i].classList.add('csat__star');
                    stars[i].classList.remove('csat__star_active');
                }

                const textarea = document.querySelector('.csat__textarea');
                textarea.classList.remove('d-none');

                const nextBtn = document.querySelector('[name="next"]');
                nextBtn.classList.remove('d-none');
            });
        });
    }

    nextBtnListener() {
        const nextBtn = document.querySelector('[name="next"]');

        const textarea = document.querySelector('.csat__textarea');
        console.log(textarea.value);

        nextBtn.addEventListener('click', () => {
            csatStore.sendForm({textare: textarea});
            this.render();
        });
    }

    skipBtnListener() {
        const skipBtn = document.querySelector('[name="skip"]');
        skipBtn.addEventListener('click', () => {
            csatStore.nextQuestion();
            this.render();
        });
    }
}