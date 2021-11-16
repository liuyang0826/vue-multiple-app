import Home from '../views/Home.vue'

const routes = [
  {
    path: '/user/home',
    name: 'Home',
    component: Home
  },
  {
    path: '/user/about',
    name: 'About',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/test/Index')
  }
]

const routerOption ={
  routes
}

export default routerOption
