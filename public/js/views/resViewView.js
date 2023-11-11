import { BACKEND_SERVER_URL } from '../../../config/config.js';
import APIConnector from '../modules/APIConnector.js';
import User from '../stores/UserStore.js';
import View from './view.js';

export default class resViewView extends View {
  constructor() {
    super();
    this.data = {};
  }
  
  /**
   * Асинхронный метод для отображения страницы
   */
  async render() {
    super.render();

    // const user = await User.getUser();
    // let role = ''; 

    // if(!user) {
    //     role = 'applicant';
    // } else if (user['role'] == 'applicant') {
    //     role = 'applicant';
    // } else {
    //     role = 'employer';
    // }
    // eslint-disable-next-line no-undef
    const template = Handlebars.templates['res_view'];
    document.querySelector('main').innerHTML = template({data: this.data}, {user: await User.getUser()});

    this.addEventListeners();
  }

  getResumeInfo() {

  }

  addEventListeners() {
    
  }

  async updateInnerData(data) {
    try {
        const resp = await APIConnector.get(`${BACKEND_SERVER_URL}/current_user/cvs/${data['id']}`);
        this.data = await resp.json();
        return true;
    } catch(err) {
        return false;
    }
  }
}
