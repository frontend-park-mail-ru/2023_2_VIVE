import router from '../modules/router/router.js';
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
    Object.assign(data, {['checked_checkboxes']: this.checked_checkboxes});

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
        this.checked_checkboxes = [];
        const qParam =  new URLSearchParams(router.currentUrl().searchParams);
        const filterDict = {
          'q': qParam.get('q'),
        };
        filters.forEach(filter => {
          if (filter.checked == true) {
            const filterName = filter.name;
            const filterValue = filter.parentNode.nextElementSibling.title;
            this.checked_checkboxes.push(filterValue);
            
            if (!filterDict[filterName]) {
              filterDict[filterName] = [filterValue];
            } else {
              filterDict[filterName] += ',' + filterValue;
            }
          }
        });
        const searchParams = new URLSearchParams(filterDict);
        router.goToLink('/vacs' + '?' + searchParams.toString());
      });
    });
  }

  clear() {
    super.clear();
    document.querySelector('main').innerHTML = "";
  }
}
