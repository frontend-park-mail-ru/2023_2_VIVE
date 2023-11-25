import csatStore from '../stores/csatStore.js';
import View from './view.js';

export default class csatpollView extends View {
    async render() {
        await super.render();

        document.querySelector('.main__poll').innerHTML = Handlebars.templates['csatpoll'](csatStore.getContext());
        this.addEventListeners();
    }

    addEventListeners() {
        super.addEventListeners();
        const closeBtn = document.querySelector('.js-close-poll');
        closeBtn.addEventListener('click', event => {
            const winpar = window.parent;
            winpar.postMessage('close', 'http://212.233.90.231:8085');

        });


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
    
    remove() {
        super.remove();
        // document.querySelector('main').innerHTML = "";
    }
}
