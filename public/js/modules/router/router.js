import User from "../../stores/UserStore.js";
import urls from "./urls.js";

const UrlParams = {
    URL: 'url',
    DENY_WITH_AUTH: 'deny_with_auth',
    LOGIN_REQUIRED: 'login_required',
    FOR_APPLICANT: 'for_applicant',
    FOR_EMPLOYER: 'for_employer',
    VIEW: 'view'
};

const StatusCode = {
    'NEED_AUTH': 100,
    'DENY_AUTH': 101,
    'DENY_APPLICANT': 102,
    'DENY_EMPLOYER': 103,
}

const isValidParam = (param) => {
    const allowedParams = Object.values(UrlParams);
    return allowedParams.includes(param);
};

class Router {
    constructor() {
        this.prevView = undefined;
        this.curUrl = '';
    }

    //MAIN FUNCTIONS

    register(route) {
        try {
            this.processUrl(route);
            Object.assign(urls, route);
        } catch(error) {
            console.log(error);
        }
    }

    start() {
        urls.forEach(element => {
            try {
                this.processUrl(element);
            } catch(error) {
                console.log(error);
            }
        });
        this.popStateCheck();
    }

    async goToLink(url) {
        this.curUrl = url;
        url = (url == '/') ? '/vacs' : url;
        await this.urlWork(url);
        history.pushState({url: url}, null, url);
    }

    currentUrl() {
        return new URL(this.getPrefUrl() + this.curUrl);
    }

    back() {
        history.back();
    }

    forward() {
        history.forward();
    }

    // HELPER FUNCTIONS
    processUrl(urlObject) {
        if (!urlObject.hasOwnProperty(UrlParams.URL) || !urlObject.hasOwnProperty(UrlParams.VIEW)) {
            throw new Error(`Parameters URL or VIEW are undefined for one of the URL`);
        }

        const isValid = this.isValidUrlObject(urlObject);
        
        if (!isValid) {
            throw new Error(`Invalid parameters for URL: ${urlObject[UrlParams.URL]}`);
        }
    }

    popStateCheck() {
        window.addEventListener('popstate', (e) => {
            this.urlWork(e.state.url);
        });
    }

    getPrefUrl() {
        return window.location.protocol + '//' + window.location.host;
    }

    async urlWork(path) {
        const urlObj = new URL(this.getPrefUrl() + path);
        
        path = urlObj.pathname;

        this.deleteLastRender();
        await User.updateUser();
        for (const element of urls) {
            const url = element[UrlParams.URL];
            const routeRegex = new RegExp(`^${url.replace(/:\w+/g, '(\\d+)')}(#)?$`);
            if (routeRegex.test(path)) {
                const status = await this.paramsWork(element);
                if (status != null) {
                    this.statusProccesing(status);
                    return;
                }

                if (!await this.updateInnerData(url, urlObj)) {
                    // this.render404();
                    // return;
                }

                this.render(url);
                return;
            }
        }

        this.render404();
    }

    async updateInnerData(url, urlObj) {
        const facUrl = urlObj.pathname;
        const idMatch = facUrl.match(/\d+/);
        const id = idMatch ? parseInt(idMatch[0]) : null;
        this.prevView = urls.find(urlObject => urlObject.url === url).view;
        if (!await this.prevView.updateInnerData(
            {
                url: facUrl, 
                'id': id, 
                urlObj: urlObj,
            })) {
            return false;
        }
        return true;
    }

    statusProccesing(status) {
        switch(status) {
            case StatusCode.DENY_AUTH:
            case StatusCode.DENY_APPLICANT:
            case StatusCode.DENY_EMPLOYER:
                this.goToLink('/vacs');
                break;
            case StatusCode.NEED_AUTH:
                this.goToLink('/app_auth');
                break;
            default:
                throw Error("Unexpected status")
        }
    }

    async paramsWork(url) {
        for (const el in url) {
            switch(el) {
                case UrlParams.DENY_WITH_AUTH:
                    if (User.isLoggedIn()) {
                        return StatusCode.DENY_AUTH;
                    }
                    break;
                case UrlParams.LOGIN_REQUIRED:
                    if (!User.isLoggedIn()) {
                        return StatusCode.NEED_AUTH;
                    }
                    break;
                case UrlParams.FOR_APPLICANT:
                    if (User.getUser() === null) {
                        return StatusCode.NEED_AUTH;
                    } else if (User.getUser().role === 'employer') {
                        return StatusCode.DENY_EMPLOYER;
                    }
                    break;
                case UrlParams.FOR_EMPLOYER:
                    if (User.getUser() === null) {
                        return StatusCode.NEED_AUTH;
                    } else if (User.getUser().role === 'applicant') {
                        return StatusCode.DENY_APPLICANT;
                    }
                    break;
                default:
                    break;
            }
        }

        return null;
    }

    deleteLastRender() {
        if (this.prevView) {
          this.prevView.remove();
        }
    }

    clearLastRender() {
        if (this.prevView) {
            this.prevView.clear();
        }
    }

    render404() {
        this.clearLastRender();
        this.prevView = urls.find(urlObject => urlObject.url === '/page404').view;
        this.prevView.render();
    }

    render(url) {
        this.prevView.render();
    }
    
    isValidUrlObject(urlObject) {
        for (const key in urlObject) {
            if (!isValidParam(key)) {
                return false;
            }
        }
        return true;
    }
}

const router = new Router();
export default router;
