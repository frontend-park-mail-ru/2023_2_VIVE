// import compiledTemplates from "./templates/templates.precompiled.js";
// import compiledPartials from "./templates/partials.precompiled.js";
import '../css/main.css';

// import { registerHelpers } from './handlebars/helpers.js';
import router from './modules/router/router.js';
import { log } from 'handlebars';

// registerHelpers();

try {
    router.start();
} catch(error) {
    console.log(error);
}

router.goToLink(window.location.pathname + window.location.search);


// ===========SW==========

// if ('serviceWorker' in navigator) {
//     navigator.serviceWorker.register('workers/sw.js', {
//         scope: '/',
//     }).then((reg) => {
//         console.log(reg);
//     }).catch(error => {
//         console.log('SW reg failed', error);

//     })
// }

// console.log(...performance.getEntriesByType('resource').map((r) => r.name));
