const routes = [
  {
    path: '/user/home',
    name: 'Home',
    component: () => import(/* webpackChunkName: "about" */ '../views/test/Index')
  }
]

const routerOption ={
  routes
}

export default routerOption
