import {router } from "./router/router.js";

let cur_path = window.location.pathname
router.goToLink(cur_path);
