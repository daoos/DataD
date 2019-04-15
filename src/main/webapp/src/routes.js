import Vue from 'vue'
import Router from 'vue-router'
import homePage from './app.vue'
import editPage from './app.vue'

Vue.use(Router)

export default new Router({
    routes: [
        {
            path:'/',
            component:homePage
        },
        {
            path:'/edit',
            component:editPage
        }
    ]
});