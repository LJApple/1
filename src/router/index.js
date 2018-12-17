import Vue from 'vue'
import VueRouter from 'vue-router'
import _import from '@/utils/import'
const Layout = _import('layout/Layout')

Vue.use(VueRouter)


export const constantRouterMap = [
  {
    path: '/',
    redirect: 'login'
  },
  {
    path: '/login',
    component: _import('login/index')
  },
  {
    path: '/dashboard',
    component: Layout,
    children: [{
      path: 'dashboard',
      name: 'dashboard',
      component: _import('dashboard/index'),
      meta: {
        title: 'dashboard',
        icon: 'dashboard',
        noCache: true
      }
    }]
  }
]

export const router = new VueRouter({
  routes: constantRouterMap,
  scrollBehavior: () => ({
    y: 0
  })
})