import '../css/main.less';

import router from './modules/router/router.js';
import { log } from 'handlebars';
import './workers/swload.js'

try {
    router.start();
} catch (error) {
    console.log(error);
}

router.goToLink(window.location.pathname + window.location.search);


window.addEventListener('unhandledrejection', function(event) {
    console.log('Ошибка');
});
