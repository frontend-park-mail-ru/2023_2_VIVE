import Store from './Store.js';

class SearchStore extends Store {
    constructor() {
        super();
        this.type = this.SEARCH_TYPE.VACANCY;
    }

    SEARCH_TYPE = {
        VACANCY: 'vacancy',
        RESUME: 'resume'
    }
    
    
    getType() {
        return this.type;
    }

    setResume() {
        this.type = this.SEARCH_TYPE.RESUME;
    }

    setVacancy() {
        this.type = this.SEARCH_TYPE.VACANCY;
    }
}

const searchStore = new SearchStore();
export default searchStore;
