import { BACKEND_SERVER_URL } from "../../../config/config.js";
import APIConnector from "../modules/APIConnector.js";

class CsatStatStore {
    constructor() {
        this.data = [];
    }

    async updateInnerData() {
        try {
            const resp = await APIConnector.get(BACKEND_SERVER_URL + "/statistics");
            this.data = await resp.json();
            return true;
        } catch (error) {
            return false;
        }
    }

    getContext() {
        // // console.log(this.data);
        return {
            data: this.data.statisticsList.map(item => ({
                name: item.question_text,
                avg_star: item.avgStars,
                five_stars_count: item.starsNumList.find(item => item.starsNum === 5)?.count || 0,
                four_stars_count: item.starsNumList.find(item => item.starsNum === 4)?.count || 0,
                three_stars_count: item.starsNumList.find(item => item.starsNum === 3)?.count || 0,
                two_stars_count: item.starsNumList.find(item => item.starsNum === 2)?.count || 0,
                one_stars_count: item.starsNumList.find(item => item.starsNum === 1)?.count || 0,
                comments: item.questionCommentList,
            }))
        }
    }
}

const csatStatStore = new CsatStatStore();
export default csatStatStore;
