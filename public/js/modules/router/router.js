import urls from "./urls.js";

class Router {
    constructor() {
        this.routes = {};
    }

    //MAIN FUNCTIONS

    register(url) {

    }

    start() {
        urls.forEach(url => {
            console.log(url);
        });
    }

    goToLink(path) {

    }

    back() {

    }

    forward() {

    }


    //HELPER FUNCTIONS\
    

}

const router = new Router();
export default router;
