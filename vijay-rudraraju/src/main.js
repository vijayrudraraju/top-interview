import Vue from 'vue'

import Router from 'vue-router'
Vue.use(Router)

import App from './App'

import Home from './components/Home'
import Login from './components/Login'
import Register from './components/Register'

const routes = [
  { path: '/', name: 'home', component: Home },
  { path: '/login', name: 'login', component: Login },
  { path: '/register', name: 'register', component: Register },
]
const router = new Router({
  routes
})

import Buefy from 'buefy'
Vue.use(Buefy)

const app = new Vue({
  router,
  ...App
}).$mount('app')
