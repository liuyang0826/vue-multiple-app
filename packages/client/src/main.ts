import { createApp } from 'vue'
import App from './App.vue'
import 'codemirror/lib/codemirror.css'
import "element-plus/theme-chalk/index.css"
import ElementPlus from "element-plus"
import { createRouter, createWebHistory } from "vue-router"

const app = createApp(App)
app.use(ElementPlus)
app.use(createRouter({
    history: createWebHistory(),
    routes: []
}))

app.mount('#app')
