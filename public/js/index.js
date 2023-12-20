import '../css/main.less';

import router from './modules/router/router.js';
import { log } from 'handlebars';
import './workers/swload.js'
import User from './stores/UserStore.js';

try {
    router.start();
} catch (error) {
    console.log(error);
}

await User.updateUser();

router.goToLink(window.location.pathname + window.location.search);
