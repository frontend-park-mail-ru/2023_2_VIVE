import router from '../modules/router/router.js';
import resStore from '../stores/ResStore.js';
import User from '../stores/UserStore.js';
import mainView from './mainView.js';
import Handlebars from 'handlebars';

class resumesView extends mainView {
  constructor() {
    super();
    this.block_type = 'list';
    this.checked_checkboxes = [];
    this.is_open_filters = false;
  }

  async updateInnerData(data) {
    return resStore.updateInnerData(data);
  }

  async render() {
    await super.render();

    const template = require('@pages/resume/resumes.handlebars');
    document.querySelector('main').innerHTML = template(
      this.getFullContext({
        'block_type': this.block_type,
        'resumes': await resStore.getAllResumes(),
        'filters': resStore.getFilters(),
        'qObj': resStore.qObj,
        'cvs': resStore.cvs,
        'checked_checkboxes': this.checked_checkboxes,
      })
    );

    this.addEventListeners();
  }

  addEventListeners() {
    super.addEventListeners();

    const buttonListView = document.querySelector('[data-name="list-view"]');
    const buttonBlockView = document.querySelector('[data-name="block-view"]');
    // const sortingDateButton = document.querySelector('[name="sorting-date-btn"]');

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

    const pagPrev = document.querySelector('.js-pag-next');
    if (pagPrev) {
      pagPrev.addEventListener('click', async event => {
        if (await resStore.pagToNext()) {
          window.scrollTo(0, 0);
        }
      });
    }

    const pagNext = document.querySelector('.js-pag-prev');
    if (pagNext) {
      pagNext.addEventListener('click', async event => {
        if (await resStore.pagToPrev()) {
          window.scrollTo(0, 0);
        }
      });
    }

    this.filtersListner();
  }

  filtersListner() {
    const filters_frame = document.querySelector('.vacs__filters-frame');
    if (this.is_open_filters) {
      filters_frame.classList.remove('vacs__filters-frame-mobile');
    } else {
      filters_frame.classList.add('vacs__filters-frame-mobile');
    }
    const open_filters = document.querySelector('.js-button-open-filters');
    if (open_filters) {
      open_filters.addEventListener('click', event => {
        this.is_open_filters = !this.is_open_filters;
        if (this.is_open_filters) {
          filters_frame.classList.remove('vacs__filters-frame-mobile');
        } else {
          filters_frame.classList.add('vacs__filters-frame-mobile');
        }
      })
    }




    const filters = document.querySelectorAll('.js_filter__label_input_click');

    filters.forEach(element => {
      element.addEventListener('click', (event) => {
        event.stopPropagation();
        this.checked_checkboxes = [];
        const qParam = new URLSearchParams(router.currentUrl().searchParams);
        const filterDict = {
          'q': qParam.get('q') ? qParam.get('q') : '',
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
        router.goToLink('/resumes' + '?' + searchParams.toString());
      });
    });

    const searchBtnFilters = document.querySelector('.js-search-filters');
    if (searchBtnFilters) {
      searchBtnFilters.addEventListener('click', (e) => {
        e.preventDefault();
        const inputFilter = searchBtnFilters.parentNode.querySelector('.js-input-filter');
        const inputValue = inputFilter.value;
        if (inputValue !== '') {
          // // console.log(inputValue);
          const labelCheckbox = searchBtnFilters.parentNode.parentNode.querySelector('label');
          const inputCheckbox = labelCheckbox.querySelector('input');
          const spanChecbox = labelCheckbox.querySelector('span');
          spanChecbox.title = inputValue;
          inputCheckbox.click();
        }
      });
    }

    const dropFilters = document.querySelector('.js-button-drop-filters');
    if (dropFilters) {
      dropFilters.addEventListener('click', () => {
        this.checked_checkboxes = [];
        router.goToLink('/resumes');
      });
    }
  }

}

export default resumesView;
