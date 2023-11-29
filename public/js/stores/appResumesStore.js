import { BACKEND_SERVER_URL } from "../../../config/config.js";
import APIConnector from "../modules/APIConnector.js";
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
      first_name: this.first_name,
      last_name: this.last_name,
      user: User.getUser(),
      cvs: this.cvs,
    }
  }

  async updateInnerData(data) {
    console.log(data);
    try {
      const resp = await APIConnector.get(BACKEND_SERVER_URL + "/cvs/applicant/" + data.id);
      const resp_json = await resp.json();
      console.log(resp_json);

      this.first_name = resp_json.first_name;
      this.last_name = resp_json.last_name;
      this.cvs = resp_json.cvs;
      this.user = User.getUser();
      
      return true;
    } catch (error) {
      console.log(error);
      return false;
    }
  }
}

const appResumesStore = new AppResumesStore();
export default appResumesStore;
