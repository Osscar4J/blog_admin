import Vue from 'vue'
import Router from 'vue-router'
import store from '@/store'

//获取原型对象上的push函数
const originalPush = Router.prototype.push
//修改原型对象中的push方法
Router.prototype.push = function push(location) {
   return originalPush.call(this, location).catch(err => err)
}

Vue.use(Router)

const router = new Router({
	mode: 'history',
  routes: [
    {
      path: '/',
      name: 'Login',
      component: () => import('@/pages/login')
    },
    {
      path: '/admin',
      name: 'Admin',
      meta: {auth: true},
      component: () => import('@/pages/admin/home'),
      children: [
        {
          path: 'dashboard',
          meta: {auth: true},
          component: () => import('@/pages/admin/dashboard')
        },
        {
          path: 'articles',
          meta: {auth: true},
          component: () => import('@/pages/admin/articles')
        },
        {
          path: 'articleEditor',
          meta: {auth: true},
          component: () => import('@/pages/admin/articleEditor')
        },
        {
          path: 'guestBook',
          meta: {auth: true},
          component: () => import('@/pages/admin/guestBook')
        },
        {
          path: 'banners',
          meta: {auth: true},
          component: () => import('@/pages/admin/banners')
        },
        {
          path: 'portScanner',
          meta: {auth: true},
          component: () => import('@/pages/admin/tools/portScanner')
        },
        {
          path: 'userInfo',
          meta: {auth: true},
          component: () => import('@/pages/admin/userInfo')
        }
      ]
    },
    {
      path: '/403',
      component: () => import('@/pages/403')
    },
    {
      path: '*',
      component: () => import('@/pages/404')
    }
  ]
})
router.beforeEach((to, from, next) => {
  if (to.meta.auth && !store.getters.userToken){
    next({path: '/'})
  } else {
    next()
  }
})

export default router
