import Vue from "vue";
import App from "./App";
import connector from "../../utils/connector";
import router from "./router"

const {mount, unmount} = connector(({root, store}) => new Vue({
    render: h => h(App),
    router,
    store
}).$mount(root))

export { mount, unmount }