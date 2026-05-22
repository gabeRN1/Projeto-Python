import { createRouter, createWebHistory } from 'vue-router'
import Login from '../views/Login.vue'
import Register from '../views/Register.vue'
import Dashboard from '../views/Dashboard.vue'

const routes = [
  { path: '/login', component: Login, name: 'Login' },
  { path: '/register', component: Register, name: 'Register' },
  { 
    path: '/', 
    component: Dashboard, 
    name: 'Dashboard',
    beforeEnter: (to, from, next) => {
      const token = localStorage.getItem('token')
      if (!token) next('/login')
      else next()
    }
  }
]

export default createRouter({
  history: createWebHistory(),
  routes
})