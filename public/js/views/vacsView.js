import vacsStore from '../stores/VacsStore.js';
import mainView from './mainView.js';

export default class vacsView extends mainView {
  constructor() {
    super();
    this.block_type = 'list';
  }

  async render() {
    await super.render();

    const data = await vacsStore.getContext();
    Object.assign(data, {['block_type']: this.block_type});

    // eslint-disable-next-line no-undef
    const template = Handlebars.templates['vacs'];
    document.querySelector('main').innerHTML = template(data);

    this.addEventListeners();
  }
  
  addEventListeners() {
    super.addEventListeners();

    if (this.block_type === 'list') {
      this.ListEventListeners();
    } else if (this.block_type === 'block') {
      this.BlockEventListeners();
    }

    const buttonListView = document.querySelector('[data-name="list-view"]');
    const buttonBlockView = document.querySelector('[data-name="block-view"]');
    const sortingDateButton = document.querySelector('[name="sorting-date-btn"]');

    buttonListView.addEventListener('click', () => {
      if (this.block_type != 'list') {
        this.block_type = 'list';
        this.render();
      }
    });

    buttonBlockView.addEventListener('click', () => {
      if (this.block_type != 'block') {
        this.block_type = 'block';
        this.render();
      }
    });

    sortingDateButton.addEventListener('click', () => {
      vacsStore.sortVacancies();
      this.render();
    });
  }

  ListEventListeners() {
    const salaryInfo = document.querySelectorAll('[name="vacancy-salary"]');
    const experienceInfo = document.querySelectorAll('[name="vacancy-experience"]');
    const employmentInfo = document.querySelectorAll('[name="vacancy-employment"]');
    const locationInfo = document.querySelectorAll('[name="vacancy-location"]');
    const descriptionText = document.querySelectorAll('[name="vacancy-description"]');

    salaryInfo.forEach(salary => {
      if (salary.innerText.length > 10) {
        salary.innerText = salary.innerText.substring(0, 10) + "...";
      }
    });

    experienceInfo.forEach(experience => {
      if (experience.innerText.length > 10) {
        experience.innerText = experience.innerText.substring(0, 10) + "...";
      }
    });

    employmentInfo.forEach(employment => {
      if (employment.innerText.length > 10) {
        employment.innerText = employment.innerText.substring(0, 10) + "...";
      }
    });

    locationInfo.forEach(location => {
      if (location.innerText.length > 10) {
        location.innerText = location.innerText.substring(0, 10) + "...";
      }
    });

    descriptionText.forEach(description => {
      description.innerText = description.innerText.substring(0, 400) + "...";
    })
  }

  BlockEventListeners() {
    const salaryInfo = document.querySelectorAll('[name="vacancy-salary"]');
    const locationInfo = document.querySelectorAll('[name="vacancy-location"]');
    const descriptionText = document.querySelectorAll('[name="vacancy-description"]');

    salaryInfo.forEach(salary => {
      if (salary.innerText.length > 10) {
        salary.innerText = salary.innerText.substring(0, 10) + "...";
      }
    });

    locationInfo.forEach(location => {
      if (location.innerText.length > 10) {
        location.innerText = location.innerText.substring(0, 10) + "...";
      }
    });

    descriptionText.forEach(description => {
      description.innerText = description.innerText.substring(0, 300) + "...";
    })
  }

  async updateInnerData(data) {
    return vacsStore.updateInnerData();
  }

  clear() {
    super.clear();
    document.querySelector('main').innerHTML = "";
  }
}
