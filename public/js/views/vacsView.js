import path from 'path';
import router from '../modules/router/router.js';
import vacsStore from '../stores/VacsStore.js';
import mainView from './mainView.js';
import Handlebars from 'handlebars';

export default class vacsView extends mainView {
  constructor() {
    super();
    this.block_type = 'list';
    this.checked_checkboxes = [];
    this.priceFilters = null;
  }

  async updateInnerData(data) {
    return vacsStore.updateInnerData(data);
  }

  async render() {
    await super.render();

    const data = await vacsStore.getContext();
    Object.assign(data, {['block_type']: this.block_type});
    Object.assign(data, {['checked_checkboxes']: this.checked_checkboxes});
    Object.assign(data, {['priceFilters']: this.priceFilters});


    // const template = Handlebars.templates['vacs'];
    const template = require('@pages/vac/vacs.handlebars');
    
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
    const priceGap = (rangeInput.length !== 0) ? rangeInput[0].max / 100 : null;
    
    if (rangeInput.length !== 0) {
      progress.style.left = (parseInt(rangeInput[0].value) / rangeInput[0].max) * 100 + "%";
      progress.style.right = 100 - (parseInt(rangeInput[1].value) / rangeInput[1].max) * 100 + "%";

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

    if (priceInput.length !== 0) {
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

    const priceBtnFilter = document.querySelector('.js-price-filters-btn');
    if (priceBtnFilter) {
      priceBtnFilter.addEventListener('click', e => {
        e.preventDefault();
        const firstVal = rangeInput[0].value; 
        const secondVal = rangeInput[1].value;
        const labelCheckbox = priceBtnFilter.parentNode.parentNode.querySelector('label');
        const inputCheckbox = labelCheckbox.querySelector('input');
        const spanChecbox = labelCheckbox.querySelector('span');
        spanChecbox.title = firstVal + ',' + secondVal;
        this.priceFilters = firstVal + ':' + secondVal;
        inputCheckbox.click();
      });
    }

    const dropFilters = document.querySelector('.js-button-drop-filters');
    if (dropFilters) {
      dropFilters.addEventListener('click', () => {
        this.checked_checkboxes = [];
        this.priceFilters = null;
        router.goToLink('/vacs');
      });
    }

    const remFavouriteBtns = document.querySelectorAll('.js-remove-fav-vac');
    remFavouriteBtns.forEach(remFavouriteBtn => {
      remFavouriteBtn.addEventListener('click', (e) => {
        e.preventDefault();
        this.removeFavVacLogic(remFavouriteBtn);
      });
    });

    const addFavouriteBtns = document.querySelectorAll('.js-add-fav-vac');
    addFavouriteBtns.forEach(addFavouriteBtn => {
      addFavouriteBtn.addEventListener('click', (e) => {
        e.preventDefault();
        this.addFavVacLogic(addFavouriteBtn);
      });
    });
  }

  async removeFavVacLogic(remFavouriteBtn) {
    const svgBlock = remFavouriteBtn.parentNode;
    const vacId = svgBlock.id;
    if (await vacsStore.removeFavouriteVac(vacId)) {
      remFavouriteBtn.remove();
      const newBtn = this.appendAddFavouriteVac(svgBlock);

      newBtn.addEventListener('click', (e) => {
        e.preventDefault();
        this.addFavVacLogic(newBtn);
      });
    }
  }

  async addFavVacLogic(addFavouriteBtn) {
    const svgBlock = addFavouriteBtn.parentNode;
    const vacId = svgBlock.id;
    if (await vacsStore.setFavouriteVac(vacId)) {
      addFavouriteBtn.remove();
      const newBtn = this.appendRemoveFavouriteVac(svgBlock);

      newBtn.addEventListener('click', (e) => {
        e.preventDefault();
        this.removeFavVacLogic(newBtn);
      });
    }
  }

  appendAddFavouriteVac(block) {
    const addButton = document.createElement('button');
    addButton.className = 'link-btn js-add-fav-vac vacs__list__item__feed__fav__btn br-10 link-svg_blue--bg d-block';

    const svgElement = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svgElement.setAttribute("xmlns", "http://www.w3.org/2000/svg");
    svgElement.setAttribute("width", "22");
    svgElement.setAttribute("height", "18");
    svgElement.setAttribute("viewBox", "0 0 22 18");
    svgElement.setAttribute("fill", "none");

    const pathElement = document.createElementNS("http://www.w3.org/2000/svg", "path");
    pathElement.setAttribute("d", "M10 18L6.825 15.15C5.625 14.0667 4.59583 13.1 3.7375 12.25C2.87917 11.4 2.17083 10.6 1.6125 9.85C1.05417 9.1 0.645833 8.375 0.3875 7.675C0.129167 6.975 0 6.24167 0 5.475C0 3.90833 0.525 2.60417 1.575 1.5625C2.625 0.520833 3.93333 0 5.5 0C6.36667 0 7.19167 0.183333 7.975 0.55C8.75833 0.916667 9.43333 1.43333 10 2.1C10.5667 1.43333 11.2417 0.916667 12.025 0.55C12.8083 0.183333 13.6333 0 14.5 0C15.85 0 16.9833 0.379167 17.9 1.1375C18.8167 1.89583 19.4417 2.85 19.775 4H17.65C17.35 3.33333 16.9083 2.83333 16.325 2.5C15.7417 2.16667 15.1333 2 14.5 2C13.65 2 12.9167 2.22917 12.3 2.6875C11.6833 3.14583 11.1083 3.75 10.575 4.5H9.425C8.90833 3.75 8.32083 3.14583 7.6625 2.6875C7.00417 2.22917 6.28333 2 5.5 2C4.55 2 3.72917 2.32917 3.0375 2.9875C2.34583 3.64583 2 4.475 2 5.475C2 6.025 2.11667 6.58333 2.35 7.15C2.58333 7.71667 3 8.37083 3.6 9.1125C4.2 9.85417 5.01667 10.7208 6.05 11.7125C7.08333 12.7042 8.4 13.9 10 15.3C10.4333 14.9167 10.9417 14.475 11.525 13.975C12.1083 13.475 12.575 13.0583 12.925 12.725L14.35 14.15C13.9833 14.4833 13.5167 14.8958 12.95 15.3875C12.3833 15.8792 11.8833 16.3167 11.45 16.7L10 18ZM17 14V11H14V9H17V6H19V9H22V11H19V14H17Z");
    pathElement.setAttribute("fill", "#0496FF");

    svgElement.appendChild(pathElement);
    addButton.appendChild(svgElement);
    block.appendChild(addButton);

    return addButton;
  }

  appendRemoveFavouriteVac(block) {
    const addButton = document.createElement('button');
    addButton.className = 'link-btn js-remove-fav-vac vacs__list__item__feed__fav__btn br-10 link-svg_blue--bg d-block';

    const svgElement = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svgElement.setAttribute("width", "22");
    svgElement.setAttribute("height", "18");
    svgElement.setAttribute("viewBox", "0 0 22 18");
    svgElement.setAttribute("fill", "none");

    const pathElement = document.createElementNS("http://www.w3.org/2000/svg", "path");
    pathElement.setAttribute("d", "M10 18L6.825 15.15C5.625 14.0667 4.59583 13.1 3.7375 12.25C2.87917 11.4 2.17083 10.6 1.6125 9.85C1.05417 9.1 0.645833 8.375 0.3875 7.675C0.129167 6.975 0 6.24167 0 5.475C0 3.90833 0.525 2.60417 1.575 1.5625C2.625 0.520833 3.93333 0 5.5 0C6.36667 0 7.19167 0.183333 7.975 0.55C8.75833 0.916667 9.43333 1.43333 10 2.1C10.5667 1.43333 11.2417 0.916667 12.025 0.55C12.8083 0.183333 13.6333 0 14.5 0C15.9 0 17.175 0.491667 18.325 1.475C19.475 2.45833 20.05 3.79167 20.05 5.475C20.05 5.70833 20.0333 5.95417 20 6.2125C19.9667 6.47083 19.9167 6.73333 19.85 7H17.725C17.8083 6.7 17.875 6.41667 17.925 6.15C17.975 5.88333 18 5.63333 18 5.4C18 4.15 17.5833 3.27083 16.75 2.7625C15.9167 2.25417 15.1667 2 14.5 2C13.65 2 12.9167 2.22917 12.3 2.6875C11.6833 3.14583 11.1083 3.75 10.575 4.5H9.425C8.90833 3.75 8.32083 3.14583 7.6625 2.6875C7.00417 2.22917 6.28333 2 5.5 2C4.55 2 3.72917 2.32917 3.0375 2.9875C2.34583 3.64583 2 4.475 2 5.475C2 6.025 2.11667 6.58333 2.35 7.15C2.58333 7.71667 3 8.37083 3.6 9.1125C4.2 9.85417 5.01667 10.7208 6.05 11.7125C7.08333 12.7042 8.4 13.9 10 15.3C10.4333 14.9167 10.9417 14.475 11.525 13.975C12.1083 13.475 12.575 13.0583 12.925 12.725L14.35 14.15C13.9833 14.4833 13.5167 14.8958 12.95 15.3875C12.3833 15.8792 11.8833 16.3167 11.45 16.7L10 18ZM14 11V9H22V11H14Z");
    pathElement.setAttribute("fill", "#0496FF");

    svgElement.appendChild(pathElement);
    addButton.appendChild(svgElement);
    block.appendChild(addButton);

    return addButton;
  }

  clear() {
    super.clear();
    document.querySelector('main').innerHTML = "";
  }
}
