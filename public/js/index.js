import compiledTemplates from "./templates/templates.precompiled.js";
import compiledPartials from "./templates/partials.precompiled.js";
import '../css/main.css';

import { registerHelpers } from './handlebars/helpers.js';
import router from './modules/router/router.js';

registerHelpers();

try {
    router.start();
} catch(error) {
    console.log(error);
}

router.goToLink(window.location.pathname + window.location.search);
