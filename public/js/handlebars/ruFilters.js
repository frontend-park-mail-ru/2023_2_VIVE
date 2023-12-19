import Handlebars from 'handlebars'

const ruNames = {
    'none': 'Не указано',
    'nothing': 'Не указано',

    'city': 'Город',
    'salary': 'Уровень дохода',

    'gender': 'Пол',
    'female': 'Женский',
    'male': 'Мужской',

    'experience': 'Опыт работы',
    'no_experience': 'Без опыта',
    'one_three_years': 'От 1 до 3-х лет',
    'three_six_years': 'От 3-х до 6-ти лет',
    'six_more_years': 'Более 6-ти лет',

    'employment': 'Тип занятости',
    'full-time': 'Полная занятость',
    'one-time': 'Разовая работа',
    'volunteering': 'Волонтерство',
    'part-time': 'Частичная занятость',
    'internship': 'Стажировка',

    'education_type': 'Образование',
    'secondary': 'Среднее',
    'secondary_special': 'Среднее специальное',
    'incomplete_higher': 'Незаконченное высшее',
    'higher': 'Высшее',
    'bachelor': 'Бакалавр',
    'master': 'Магистр',
    'phd_junior': 'Кандидат наук',
    'phd': 'Доктор наук',
    'doctor': 'Доктор наук',
};


export default function ruFilters(string) {
    return ruNames[string];
}

Handlebars.registerHelper('ruFilters', ruFilters);

