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
    path: '',
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
  },
  {
    path: '',
    component: Layout,
    children: [{
      path: 'addbanner',
      name: 'addbanner',
      component: _import('addbanner/index'),
      meta: {
        title: 'addbanner',
        icon: 'dashboard',
        noCache: true
      }
    }]
  },
  {
    path: '',
    component: Layout,
    children: [{
      path: 'sysRoles',
      name: 'sysRoles',
      component: _import('sysRoles/index'),
      meta: {
        title: 'sysRoles',
        icon: 'dashboard',
        noCache: true
      }
    }]
  },
  {
    path: '',
    component: Layout,
    children: [{
      path: 'compRoles',
      name: 'compRoles',
      component: _import('compRoles/index'),
      meta: {
        title: 'compRoles'
      }
    }]
  }
]

export const router = new VueRouter({
  mode : 'history',
  base: '/system/',  //添加的地方
  routes: constantRouterMap,
  scrollBehavior: () => ({
    y: 0
  })
})