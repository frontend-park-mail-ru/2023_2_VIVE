import { cookie } from "./cookieCheck/cookieCheck.js";
import { registerHelpers } from "./handlebars/helpers.js";
import router from "./router/router.js";

registerHelpers();

let cur_path = window.location.pathname;
cookie.checkPathForNoCookie(cur_path);
router.goToLink(cur_path)
