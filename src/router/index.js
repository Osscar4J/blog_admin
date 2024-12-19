import { createRouter, createWebHistory } from 'vue-router'
import store from '@/store'
const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      redirect: '/login'
    },
    {
      path: '/login',
      name: 'Login',
      component: () => import('../pages/login/index.vue')
    },
    {
      path: '/admin',
      name: 'Admin',
      component: () => import('../pages/admin/home.vue'),
      meta: { auth: true, title: '首页' },
      children: [
        {
          path: 'dashboard',
          name: 'Dashboard',
          component: () => import('../pages/admin/dashboard.vue'),
          meta: { auth: true, title: '仪表盘' }
        },
        {
          path: 'apiKey',
          name: 'ApiKey',
          component: () => import('../pages/admin/apiKey/index.vue'),
          meta: { auth: true, title: 'API Key管理' }
        },
      ]
    },
    {
      path: '/:pathMatch(.*)*',
      name: 'NotFound',
      component: () => import('../pages/404.vue')
    }
  ]
})

// 导航守卫
router.beforeEach((to, from, next) => {
  if (to.meta.auth && !store.getters.userToken) {
    next('/login')
  } else {
    next()
  }
})

export default router
