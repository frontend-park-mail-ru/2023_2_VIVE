import router from '../modules/router/router.js';
import vacsStore from '../stores/VacsStore.js';
import mainView from './mainView.js';

export default class vacsView extends mainView {
  constructor() {
    super();
    this.block_type = 'list';
    this.checked_checkboxes = [];
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

    const pagPrev = document.querySelector('.js-pag-next');
      if (pagPrev) {
      pagPrev.addEventListener('click', async event => {
        if (await vacsStore.pagToNext()) {
          window.scrollTo(0, 0);
        }
      });
    }

    const pagNext = document.querySelector('.js-pag-prev');
    if (pagNext) {
      pagNext.addEventListener('click', async event => {
        if (await vacsStore.pagToPrev()) {
          window.scrollTo(0, 0);
        }
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
        router.goToLink('/vacs' + '?' + searchParams.toString());
      });
    });

    const searchBtnFilters = document.querySelector('.js-search-filters');
    if (searchBtnFilters) {
      searchBtnFilters.addEventListener('click', (e)=> {
        e.preventDefault();
        const inputFilter = searchBtnFilters.parentNode.querySelector('.js-input-filter');
        const inputValue = inputFilter.value;
        if (inputValue !== '') {
          console.log(inputValue);
          const labelCheckbox = searchBtnFilters.parentNode.parentNode.querySelector('label');
          const inputCheckbox = labelCheckbox.querySelector('input');
          const spanChecbox = labelCheckbox.querySelector('span');
          spanChecbox.title = inputValue;
          inputCheckbox.click();
        }
      });
    }

    const rangeInput = document.querySelectorAll(".range-input-field input");
    const priceInput = document.querySelectorAll(".range-input input");
    const progress = document.querySelector(".range-input__slider .range-input__progress");
    const priceGap = rangeInput[0].max / 100;
    
    if (rangeInput) {
      rangeInput.forEach(input => {
        input.addEventListener("input", e => {
          let minVal = parseInt(rangeInput[0].value);
          let maxVal = parseInt(rangeInput[1].value);

          if (maxVal - minVal < priceGap) {
            if (e.target.className === "range-range__min") {
              rangeInput[0].value = maxVal - priceGap;
            } else {
              rangeInput[1].value = minVal + priceGap;
            }
          } else {
            priceInput[0].value = minVal;
            priceInput[1].value = maxVal;
            progress.style.left = (minVal / rangeInput[0].max) * 100 + "%";
            progress.style.right = 100 - (maxVal / rangeInput[1].max) * 100 + "%";
          }
        });
      });
    }

    if (priceInput) {
      priceInput.forEach(input => {
        input.addEventListener("input", e => {
          let minVal = parseInt(priceInput[0].value);
          let maxVal = parseInt(priceInput[1].value);

          if ((maxVal - minVal >= priceGap) && (maxVal <= rangeInput[0].max) && (minVal > 0)) {
            if (e.target.classList.contains("range-input__min")) {
              rangeInput[0].value = minVal;
              progress.style.left = (minVal / rangeInput[0].max) * 100 + "%";
            } else {
              rangeInput[1].value = maxVal;
              progress.style.right = 100 - (maxVal / rangeInput[1].max) * 100 + "%";
            }
          }
        });
      });
    }

    const dropFilters = document.querySelector('.js-button-drop-filters');
    if (dropFilters) {
      dropFilters.addEventListener('click', () => {
        this.checked_checkboxes = [];
        router.goToLink('/vacs');
      });
    }
  }
  
  filterChecking(filters) {
    const qParam =  new URLSearchParams(router.currentUrl().searchParams);
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
  }

  clear() {
    super.clear();
    document.querySelector('main').innerHTML = "";
  }
}
