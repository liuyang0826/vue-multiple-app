import VueRouter from "vue-router"
import Vue from "vue"
import loadable from "../utils/loadable";

const router = new VueRouter({
    routes: [
        {
            path: "/",
            component: loadable(() => import("../packages/home"))
        },
        {
            path: "/user",
            component: loadable(() => import("../packages/user"))
        },
        {
            path: "/user/*",
            component: loadable(() => import("../packages/user"))
        },
    ]
})

Vue.use(VueRouter)

export default router