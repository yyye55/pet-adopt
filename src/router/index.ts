import { createRouter, createWebHistory } from 'vue-router'
import { useUserStore } from '@/stores/user'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    // ========== 用户端 ==========
    {
      path: '/',
      component: () => import('@/components/layout/Layout.vue'),
      children: [
        {
          path: '',
          name: 'home',
          component: () => import('@/views/user/home/index.vue'),
          meta: { title: '青行迹 · 首页', requiresAuth: true },
        },
        {
          path: 'detail/:id',
          name: 'detail',
          component: () => import('@/views/user/home/detail.vue'),
          meta: { title: '青行迹 · 线路详情', requiresAuth: true },
        },
        {
          path: 'signup/:id',
          name: 'signup',
          component: () => import('@/views/user/home/signup.vue'),
          meta: { title: '青行迹 · 报名', requiresAuth: true },
        },
        {
          path: 'about',
          name: 'about',
          component: () => import('@/views/user/about/index.vue'),
          meta: { title: '青行迹 · 项目介绍' },
        },
        {
          path: 'mine',
          name: 'mine',
          component: () => import('@/views/user/mine/index.vue'),
          meta: { title: '青行迹 · 个人中心', requiresAuth: true },
        },
      ],
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('@/views/user/login/index.vue'),
      meta: { title: '青行迹 · 登录' },
    },

    // ========== 管理员端 ==========
    {
      path: '/admin',
      component: () => import('@/components/layout/AdminLayout.vue'),
      meta: { requiresAuth: true, requiresAdmin: true },
      children: [
        {
          path: '',
          name: 'admin-dashboard',
          component: () => import('@/views/admin/index.vue'),
          meta: { title: '管理后台 · 仪表盘', requiresAdmin: true },
        },
        {
          path: 'routes',
          name: 'admin-routes',
          component: () => import('@/views/admin/routes/index.vue'),
          meta: { title: '管理后台 · 线路管理', requiresAdmin: true },
        },
        {
          path: 'orders',
          name: 'admin-orders',
          component: () => import('@/views/admin/orders/index.vue'),
          meta: { title: '管理后台 · 订单管理', requiresAdmin: true },
        },
        {
          path: 'users',
          name: 'admin-users',
          component: () => import('@/views/admin/users/index.vue'),
          meta: { title: '管理后台 · 用户管理', requiresAdmin: true },
        },
        {
          path: 'signups',
          name: 'admin-signups',
          component: () => import('@/views/admin/signups/index.vue'),
          meta: { title: '管理后台 · 报名审核', requiresAdmin: true },
        },
      ],
    },
  ],
})

// 全局前置守卫：页面标题 + 登录鉴权 + 角色鉴权
router.beforeEach((to) => {
  // 设置页面标题
  if (to.meta.title) {
    document.title = to.meta.title as string
  }

  const userStore = useUserStore()

  // 管理员权限校验
  if (to.meta.requiresAdmin) {
    if (!userStore.isLogin) {
      return { name: 'login', query: { redirect: to.fullPath } }
    }
    if (!userStore.isAdmin) {
      return { name: 'home' }
    }
    return true
  }

  // 普通登录校验
  if (to.meta.requiresAuth && !userStore.isLogin) {
    return { name: 'login', query: { redirect: to.fullPath } }
  }

  return true
})

export default router
