import VueRouter from "vue-router"
import Vue from "vue"
import loadable from "../utils/loadable";

const router = new VueRouter({
    routes: [
        {
            path: "/",
            component: loadable({
                name: "home",
                entries: () => import("../packages/home")
            })
        },
        // {
        //     path: "/user",
        //     component: loadable(() => import("../packages/user"))
        // },
        {
            path: "/user/*",
            component: loadable({
                name: "user",
                entries: () => import("../packages/user")
            })
        },
        {
            path: "/device/*",
            component: loadable({
                name: "appDevice",
                entries: ["http://localhost:8081/js/chunk-vendors.js", "http://localhost:8081/app.js"],
            })
        },
    ]
})

Vue.use(VueRouter)

export default router