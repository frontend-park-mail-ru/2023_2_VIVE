import vacancyStore from '../stores/VacancyStore.js';
import mainView from './mainView.js';

export default class vacsView extends mainView {

  async render() {
    await super.render();

    // eslint-disable-next-line no-undef
    const template = Handlebars.templates['vacs'];
    document.querySelector('main').innerHTML = template({
      data: await vacancyStore.getAllVacancies(),
    });

    this.addEventListeners();
  }

  addEventListeners() {
    super.addEventListeners();

    const descriptionText = document.querySelectorAll('.vacs__list__item__desc__prev');

    descriptionText.forEach(description => {
      description.textContent = description.textContent.substring(0, 300) + "...";
    })
  }

  clear() {
    super.clear();
    document.querySelector('main').innerHTML = "";
  }
}
