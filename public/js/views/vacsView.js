import vacsStore from '../stores/VacsStore.js';
import mainView from './mainView.js';

export default class vacsView extends mainView {
  constructor() {
    super();
    this.block_type = 'list';
  }

  async updateInnerData(data) {
    return vacsStore.updateInnerData(data);
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

  clear() {
    super.clear();
    document.querySelector('main').innerHTML = "";
  }
}
