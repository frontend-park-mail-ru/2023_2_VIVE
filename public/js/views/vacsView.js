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

    if (buttonListView)  {
      buttonListView.addEventListener('click', () => {
        if (this.block_type != 'list') {
          this.block_type = 'list';
          this.render();
        }
      });
    }

    if (buttonBlockView) {
      buttonBlockView.addEventListener('click', () => {
        if (this.block_type != 'block') {
          this.block_type = 'block';
          this.render();
        }
      });
    }

    if (sortingDateButton) {
      sortingDateButton.addEventListener('click', () => {
        vacsStore.sortVacancies();
        this.render();
      });
    }

    this.filtersListener();
  }

  filtersListener() {
    const filters = document.querySelectorAll('.js_filter__label_input_click');

    filters.forEach(element => {
      element.addEventListener('click', (event) => {
        event.stopPropagation();
        filters.forEach(filter => {
          if (filter.checked == true) {
            const filterName = filter.name;
            const filetValue = filter.parentNode.nextElementSibling.title;
            console.log(`${filterName}=${filetValue}`);
          }
        })
      });
    });
  }

  clear() {
    super.clear();
    document.querySelector('main').innerHTML = "";
  }
}
