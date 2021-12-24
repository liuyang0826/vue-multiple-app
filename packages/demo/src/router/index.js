import { createRouter, createWebHistory } from "vue-router"

const router = createRouter({
    history: createWebHistory(),
    routes: [
        {
            path: "/test",
            component: () => import("../views/test/Index.vue")
        }
    ]
})

export default router