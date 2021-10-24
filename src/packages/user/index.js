import App from "./App";
import connector from "../../utils/connector";
import routerOption from "./router-option"

export default connector({
    App,
    routerOption,
    beforeEach: (from, to, next) => {
        next()
    },
    afterEach: () => {
        console.log("afterEach");
    }
})
