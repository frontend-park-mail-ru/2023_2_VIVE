import { cookie } from './modules/cookieCheck.js';
import { registerHelpers } from './handlebars/helpers.js';

registerHelpers();

const cur_path = window.location.pathname;
await cookie.checkPathForNoCookie(cur_path);
