import { cookie } from './cookieCheck/cookieCheck.js';
import { registerHelpers } from './handlebars/helpers.js';

registerHelpers();

let cur_path = window.location.pathname;
await cookie.checkPathForNoCookie(cur_path);
