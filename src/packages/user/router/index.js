import VueRouter from "vue-router"
import A from "../components/A"
import B from "../components/B"

const router = new VueRouter({
    routes: [
        {
            path: "/user/a",
            component: A
        },
        {
            path: "/user/b",
            component: B
        }
    ]
})

export default router