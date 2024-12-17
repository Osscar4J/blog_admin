import Vue from 'vue'
import Router from 'vue-router'
import store from '@/store'

import NProgress from 'nprogress'
import 'nprogress/nprogress.css'

NProgress.configure({
	easing: 'ease',  // 动画方式，和css动画属性一样（默认：ease）
	speed: 500,  // 递增进度条的速度，单位ms（默认： 200）
	showSpinner: false, // 是否显示加载ico
	trickle: true,//是否自动递增
	trickleSpeed: 200, // 自动递增间隔
	minimum: 0.3, // 初始化时的最小百分比，0-1（默认：0.08）
	// parent: '#container'//指定此选项以更改父容器（默认：body）
})

//获取原型对象上的push函数
const originalPush = Router.prototype.push
//修改原型对象中的push方法
Router.prototype.push = function push(location) {
   return originalPush.call(this, location).catch(err => err)
}

Vue.use(Router)

const routes = [
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
      { // 个人资料
        path: 'userInfo',
        meta: {auth: true},
        component: () => import('@/pages/admin/userInfo')
      },
      { // 角色管理
        path: 'roles',
        meta: {auth: true},
        component: () => import('@/pages/admin/roles')
      },
      { // 账号管理
        path: 'users',
        meta: {auth: true},
        component: () => import('@/pages/admin/users')
      },
      { // 菜单管理
        path: 'menus',
        meta: {auth: true},
        component: () => import('@/pages/admin/menus')
      }
    ]
  }
]

routes.push({
  path: '/403',
  component: () => import('@/pages/403')
})
routes.push({
  path: '*',
  component: () => import('@/pages/404')
})

const router = new Router({
	mode: 'history',
  routes: routes
})
router.beforeEach((to, from, next) => {
  NProgress.start();
  if (to.meta.auth && !store.getters.userToken){
    next({path: '/'})
  } else {
    next()
  }
})

router.afterEach(() => {
  	NProgress.done()
})

export default router
