import App from "./App";
import connector from "../../utils/connector";
import routerOption from "./router-option"

export default connector({
    createInstance: ({store, Vue, VueRouter}) => new Vue({
        render: h => h(App),
        router: new VueRouter(routerOption),
        store
    })
})