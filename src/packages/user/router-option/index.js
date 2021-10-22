import A from "../components/A"
import B from "../components/B"
// import C from "../components/C"

const routerOption = {
    routes: [
        {
            path: "/user",
            redirect: "/user/a",
        },
        {
            path: "/user/a",
            component: A
        },
        {
            path: "/user/b",
            component: B
        },
    ]
}


export default routerOption