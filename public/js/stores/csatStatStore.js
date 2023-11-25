import { BACKEND_SERVER_URL } from "../../../config/config.js";
import APIConnector from "../modules/APIConnector.js";

class CsatStatStore {
    constructor() {
        this.data = [
            {name: 'Насколько вы удовлетворены использованием сайта?', avg_star: 4.86, five_stars_count: 200, four_stars_count: 200, three_stars_count: 200, two_stars_count: 200, one_stars_count: 200, comments: ["АВАВФ", "ogpakrpgokr"], cur_iter_comment: 0},
            {name: 'Нормально ли составлены резюме/вакансии?', avg_star: 4.86, five_stars_count: 200, four_stars_count: 200, three_stars_count: 200, two_stars_count: 200, one_stars_count: 200, comments: ["АВАВФ", "ogpakrpgokr"], cur_iter_comment: 0},
            {name: 'еще вопросы?', avg_star: 4.86, five_stars_count: 200, four_stars_count: 200, three_stars_count: 200, two_stars_count: 200, one_stars_count: 200, comments: ["АВАВФ"], cur_iter_comment: 0},
        ];
    }

    async updateInnerData() {
        try {
            const resp = await APIConnector.get(BACKEND_SERVER_URL + "/statistics");
            console.log(await resp.json());
            return true;
        } catch(error) {
            return false;
        }
    }

    getContext() {
        return {
            data : this.data.map(item => ({
                name: item.name,
                avg_star: item.avg_star,
                five_stars_count: item.five_stars_count,
                four_stars_count: item.four_stars_count,
                three_stars_count: item.three_stars_count,
                two_stars_count: item.two_stars_count,
                one_stars_count: item.one_stars_count,
                comment: item.comments[item.cur_iter_comment],
                cur_iter_comment: item.cur_iter_comment,
                end_comments: (item.cur_iter_comment + 1 === item.comments.length) ? true : false,
            }))
        }
    }
};

const csatStatStore = new CsatStatStore();
export default csatStatStore;
