import User from "./UserStore.js";


export default class Store {
    async updateInnerData() {
        await User.updateUser();
    }
}
