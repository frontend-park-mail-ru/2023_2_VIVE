import { BACKEND_SERVER_URL } from "../../../config/config.js";
import APIConnector from "../modules/APIConnector.js";
import router from '../modules/router/router.js';
import Store from "./Store.js";
import User from "./UserStore.js";

class AppResumesStore extends Store {
  constructor() {
    super();
    this.cvs = [];
    this.user = {};
  }

  getContext() {
    return {
      cvs: this.cv.cvs,
      user: User.getUser(),
    }
  }

  async updateInnerData(data) {
    console.log(data);
    try {
      const resp = await APIConnector.get(BACKEND_SERVER_URL + "/cvs/applicant/" + data.id);
      this.cv = await resp.json();
      return true;
    } catch (error) {
      router.render404();
      console.log(error);
      return false;
    }
  }
}

const appResumesStore = new AppResumesStore();
export default appResumesStore;
