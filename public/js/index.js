import { cookie } from "./cookieCheck/cookieCheck.js";

let cur_path = window.location.pathname;
await cookie.checkPathForNoCookie(cur_path);
