import { BACKEND_SERVER_URL } from "../../../config/config.js";
import APIConnector from "../modules/APIConnector.js";
import Store from "./Store.js";

class VacsStore extends Store {
    constructor() {
        super();
        this.user = {};
        this.vacs = [];
    }

    async getContext() {
        let vacancies = await this.getVacancies();
        vacancies = this.processVacanciesData(vacancies);
        return {
            data: vacancies
        }
    }

    processVacanciesData(vacancies) {
        vacancies.forEach(vacancy => {
            const salary = this.processVacanciesSalary(vacancy);
            delete vacancy.salary_lower_bound; delete vacancy.salary_upper_bound;
            Object.assign(vacancy, {['salary']: salary});
            vacancy.employment = this.processVacanciesEmployment(vacancy);
            vacancy.experience = this.processVacanciesExperience(vacancy);
            vacancy.location = vacancy.location ? vacancy.location : 'Не указано';
        });

        return vacancies;
    }

    processVacanciesSalary(vacancy) {
        if (vacancy.salary_lower_bound && vacancy.salary_upper_bound) {
            return `От ${vacancy.salary_lower_bound} до ${vacancy.salary_upper_bound} рублей`;
        } else if (vacancy.salary_lower_bound) {
            return `От ${vacancy.salary_lower_bound} рублей`;
        } else if (vacancy.salary_upper_bound) {
            return `До ${vacancy.salary_upper_bound} рублей`;
        } else {
            return 'Не указано';
        }
    }

    processVacanciesEmployment(vacancy) {
        if (!vacancy.employment) {
            return 'Не указано';
        }

        switch (vacancy.employment) {
            case 'full-time':
                return 'Полная занятость';
            case 'part-time':
                return 'Частичная занятость';
            case 'one-time':
                return 'Разовая работа или проект';
            case 'volunteering':
                return 'Волонтерство';
            case 'internship':
                return 'Стажировка';
            default:
                return 'Не указано';
        }
    }

    processVacanciesExperience(vacancy) {
        if (!vacancy.experience) {
            return 'Не указано';
        }

        switch (vacancy.experience) {
            case 'no_experience':
                return 'Без опыта';
            case 'one_three_years':
                return 'От 1 до 3-х лет';
            case 'three_six_years':
                return 'От 3-х до 6-ти лет';
            case 'six_more_years':
                return 'Более 6-ти лет';
            default:
                return 'Не указано';
        }
    }

    async getVacancies() {
        try {
          const resp = await APIConnector.get(BACKEND_SERVER_URL + '/vacancies');
          const data = await resp.json();
          return data;
        } catch (err) {
          console.error(err);
          return undefined;
        }
    }
}

const vacsStore = new VacsStore;
export default vacsStore;
