import resStore from '../stores/ResStore.js';
import mainView from './mainView.js';

class resumesView extends mainView {
  constructor() {
    super();
    this.block_type = 'list';
  }

  async updateInnerData(data) {
    return resStore.updateInnerData(data);
  }

  async render() {
    await super.render();

    const template = Handlebars.templates['resumes'];
    document.querySelector('main').innerHTML = template(
      {
        'block_type': this.block_type,
        'resumes': await resStore.getAllResumes(),
        'filters': resStore.getFilters(),
        'qObj': resStore.qObj,
        'cvs': resStore.cvs,
      }
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
    pagPrev.addEventListener('click', async event => {
      if (await resStore.pagToNext()) {
        window.scrollTo(0, 0);
      }
    });

    const pagNext = document.querySelector('.js-pag-prev');
    pagNext.addEventListener('click', async event => {
      if (await resStore.pagToPrev()) {
        window.scrollTo(0, 0);
      }
    });

    // sortingDateButton.addEventListener('click', () => {
    //   vacsStore.sortVacancies();
    //   this.render();
    // });
  }
  
  
}

export default resumesView;
