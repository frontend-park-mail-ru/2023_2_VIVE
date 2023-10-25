import { cookie } from './modules/cookieCheck.js';
import { registerHelpers } from './handlebars/helpers.js';

// import regPart from './handlebars/partials.js';
// regPart('header_anm', 'views/partials/header_anm.hbs');

// Handlebars.registerPartial("name", )
// Handlebars.partials = Handlebars.templates
// Handlebars.registerPartial('header_anm', Handlebars.templates['header_anm.hbs'])
registerHelpers();

const cur_path = window.location.pathname;
await cookie.checkPathForNoCookie(cur_path);
