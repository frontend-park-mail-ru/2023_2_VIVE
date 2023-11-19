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
    'DENY_EMPLOYER': 103
}

const isValidParam = (param) => {
    const allowedParams = Object.values(UrlParams);
    return allowedParams.includes(param);
};

class Router {
    constructor() {
        this.prevView = undefined;
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
    }

    async goToLink(path) {
        path = (path == '/') ? '/vacs' : path;
        await this.urlWork(path);
    }

    back() {

    }

    forward() {

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

    async urlWork(path) {
        for (const element of urls) {
            const url = element[UrlParams.URL];
            const routeRegex = new RegExp(`^${url.replace(/:\w+/g, '(\\d+)')}(#)?$`);
            if (routeRegex.test(path)) {
                const status = await this.paramsWork(element);
                if (status != null) {
                    console.log(status);
                    return;
                }

                if (!await this.updateInnerData(url, path)) {
                    console.log(error);
                }
                this.render(url);
            }
        }
    }

    async updateInnerData(url, facUrl) {
        const idMatch = facUrl.match(/\d+/);
        const id = idMatch ? parseInt(idMatch[0]) : null;
        this.prevView = urls.find(urlObject => urlObject.url === url).view;
        if (!await this.prevView.updateInnerData({url: facUrl, 'id': id})) {
            return false;
        }
        return true;
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

    async paramsWork(url) {
        for (const el in url) {
            switch(el) {
                case UrlParams.DENY_WITH_AUTH:
                    if (await this.authCheck()) {
                        return {code: StatusCode.DENY_AUTH};
                    }
                    break;
                case UrlParams.LOGIN_REQUIRED:
                    if (!await this.authCheck()) {
                        return {code: StatusCode.NEED_AUTH};
                    }
                    break;
                case UrlParams.FOR_APPLICANT:
                    const role = await this.getRole();
                    if (role === null) {
                        return {code: StatusCode.NEED_AUTH};
                    } else if (role === 'employer') {
                        return {code: StatusCode.DENY_EMPLOYER};
                    }
                    break;
                case UrlParams.FOR_EMPLOYER:
                    role = await this.getRole();
                    if (role === null) {
                        return {code: StatusCode.NEED_AUTH};
                    } else if (role === 'applicant') {
                        return {code: StatusCode.DENY_APPLICANT};
                    }
                    break;
                default:
                    break;
            }
        }

        return null;
    }

    async authCheck() {
        try {
            const resp = await APIConnector.get(BACKEND_SERVER_URL + "/current_user");
            return true;
        } catch(error) {
            return false;
        }
    }

    async getRole() {
        try {
            const user = await APIConnector.get(BACKEND_SERVER_URL + "/current_user");
            return user.role;
        } catch(error) {
            return null;
        }
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
