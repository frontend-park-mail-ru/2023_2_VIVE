import View from './view.js';

class resumesView extends View {
  async render() {
    await super.render();

    const data = await vacsStore.getContext();
    Object.assign(data, {['block_type']: this.block_type});

    // eslint-disable-next-line no-undef
    const template = Handlebars.templates['vacs'];
    document.querySelector('main').innerHTML = template(data);

    this.addEventListeners();
  }
  
  
}

export default resumesView;
