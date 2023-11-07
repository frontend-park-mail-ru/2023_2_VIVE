import { registerHelpers } from './handlebars/helpers.js';
import router from './modules/router.js';

registerHelpers();

router.goToLink(window.location.pathname);
