import VueRouter from "vue-router"
import Vue from "vue"
import loadable from "@cisdiliuyang/vue-multiple-app/loadable";

const router = new VueRouter({
    routes: [
        {
            path: "/",
            component: loadable({
                name: "home",
                entry: () => import("../packages/home")
            })
        },
    ]
})

Vue.use(VueRouter)

export default router