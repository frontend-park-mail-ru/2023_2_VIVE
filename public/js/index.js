import { registerHelpers } from './handlebars/helpers.js';
import router from './modules/router/router.js';

registerHelpers();

router.start();
