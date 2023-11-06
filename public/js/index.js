import { registerHelpers } from './handlebars/helpers.js';
import { cookie } from './modules/cookieCheck.js';

registerHelpers();
document.querySelector('footer').innerHTML = Handlebars.partials['footer']();

const cur_path = window.location.pathname;
await cookie.checkPathForNoCookie(cur_path);
