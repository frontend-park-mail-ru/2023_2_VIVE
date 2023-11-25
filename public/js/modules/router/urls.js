import empVacs from "../../views/empVacs.js"
import vacsView from "../../views/vacsView.js"
import regAuthView from "../../views/regAuthView.js"
import profileView from "../../views/profileView.js"
import resView from "../../views/resView.js"
import resCreationView from "../../views/resCreationView.js"
import vacancyView from "../../views/vacancyView.js"
import vacCreationView from "../../views/vacCreationView.js"
import responseView from "../../views/responseView.js"
import page404View from '../../views/page404View.js'
import csatView from '../../views/csatView.js'
import csatStatView from '../../views/csatStatView.js'

const urls = [
    {url: '/csat/statistic', login_required: true, view: new csatStatView()},
    {url: '/csat', view: new csatView()},
    {url: '/page404', view: new page404View()},
    {url: '/vacs', view: new vacsView()},
    {url: '/app_auth', deny_with_auth: true, view: new regAuthView('auth', 'applicant')},
    {url: '/emp_auth', deny_with_auth: true, view: new regAuthView('auth', 'employer')},
    {url: '/app_reg', deny_with_auth: true, view: new regAuthView('reg', 'applicant')},
    {url: '/emp_reg', deny_with_auth: true, view: new regAuthView('reg', 'employer')},
    {url: '/vacancies/profile', view: new empVacs()},
    {url: '/profile', login_required: true, view: new profileView()},
    {url: '/profile/resumes', login_required: true, for_applicant: true, view: new profileView()},
    {url: '/profile/settings', login_required: true, view: new profileView()},
    {url: '/profile/responses', login_required: true, for_applicant: true, view: new profileView()},
    {url: '/profile/vacancies', login_required: true, for_employer: true, view: new profileView()},
    {url: '/resume/:id', view: new resView()},
    {url: '/resume/creation', login_required: true, for_applicant: true, view: new resCreationView()},
    {url: '/vacancy/:id', view: new vacancyView()},
    {url: '/vacancy/:id/description', view: new vacancyView()},
    {url: '/vacancy/:id/responses', login_required: true, for_employer: true, view: new vacancyView()},
    {url: '/vacancy/creation', login_required: true, for_employer: true, view: new vacCreationView()},
    {url: '/vacancy/:id/response', login_required: true, for_applicant: true, view: new responseView()},
];
export default urls;
