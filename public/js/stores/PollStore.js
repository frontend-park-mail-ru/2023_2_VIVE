import Store from './Store.js';

class PollStore extends Store {
  isclose = false;
}

const pollStore = new PollStore(); 
export default pollStore;
