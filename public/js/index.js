import appAuthView from "./jsviews/appAuthView.js"
import empAuthView from "./jsviews/empAuthView.js";
import menuView from "./jsviews/menuView.js";

export const objs = {
  appAuth: new appAuthView(),
  empAuth: new empAuthView(),
  menu: new menuView(),
}

const urls = {
  '/app_login': objs['appAuth'], 
  '/emp_login': objs['empAuth'],
};

let cur_path = window.location.pathname
if (cur_path in urls) {
  urls[cur_path].render();
}

objs['menu'].render();


