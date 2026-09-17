import { createRouter, createWebHistory } from 'vue-router'
import { useUserStore } from '@/stores/user'

// ========== 菜单配置 ==========
const userMenuList = [
  { name: '领养宠物', path: '/home', icon: 'House' },
  { name: '我的申请', path: '/home/adoptions', icon: 'Document' },
  { name: '个人中心', path: '/home/mine', icon: 'UserFilled' },
]

const adminMenuList = [
  { name: '申请审核', path: '/admin', icon: 'Checked' },
  { name: '宠物档案', path: '/admin/pets', icon: 'Files' },
  { name: '用户管理', path: '/admin/users', icon: 'User' },
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    // ========== 根路径 redirect ==========
    {
      path: '/',
      redirect: () => {
        const userStore = useUserStore()
        if (!userStore.isLogin) return { name: 'login' }
        if (userStore.isAdmin) return { path: '/admin' }
        return { name: 'home' }
      },
    },

    // ========== 用户端 ==========
    {
      path: '/home',
      component: () => import('@/components/layout/AppLayout.vue'),
      props: {
        theme: 'light',
        title: '拾光萌约',
        subtitle: 'Pet Moment',
        homePath: '/home',
        menuList: userMenuList,
        showProfileLink: true,
      },
      meta: { requiresAuth: true },
      children: [
        {
          path: '',
          name: 'home',
          component: () => import('@/views/user/home/list.vue'),
          meta: { title: '拾光萌约 · 待领养宠物' },
        },
        {
          path: 'adoptions',
          name: 'adoptions',
          component: () => import('@/views/user/adoptions/index.vue'),
          meta: { title: '拾光萌约 · 我的申请' },
        },
        {
          path: 'mine',
          name: 'mine',
          component: () => import('@/views/user/mine/index.vue'),
          meta: { title: '拾光萌约 · 个人中心' },
        },
      ],
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('@/views/login/index.vue'),
      meta: { title: '拾光萌约 · 登录' },
    },
    {
      path: '/register',
      name: 'register',
      component: () => import('@/views/login/index.vue'),
      meta: { title: '拾光萌约 · 注册' },
    },

    // ========== 管理员端 ==========
    {
      path: '/admin',
      component: () => import('@/components/layout/AppLayout.vue'),
      props: {
        theme: 'dark',
        title: '拾光萌约',
        subtitle: '救助站后台',
        homePath: '/admin',
        menuList: adminMenuList,
        showProfileLink: false,
        contentBg: '#FFF5E6',
      },
      meta: { requiresAuth: true, requiresAdmin: true },
      children: [
        {
          path: '',
          name: 'admin-review',
          component: () => import('@/views/admin/audit/index.vue'),
          meta: { title: '救助站后台 · 申请审核' },
        },
        {
          path: 'pets',
          name: 'admin-pets',
          component: () => import('@/views/admin/pets/index.vue'),
          meta: { title: '救助站后台 · 宠物档案' },
        },
        {
          path: 'users',
          name: 'admin-users',
          component: () => import('@/views/admin/users/index.vue'),
          meta: { title: '救助站后台 · 用户管理' },
        },
      ],
    },
  ],
})

// 全局前置守卫
router.beforeEach((to) => {
  if (to.meta.title) {
    document.title = to.meta.title as string
  }

  const userStore = useUserStore()

  if (to.meta.requiresAdmin) {
    if (!userStore.isLogin) {
      return { name: 'login', query: { redirect: to.fullPath } }
    }
    if (!userStore.isAdmin) {
      return { name: 'home' }
    }
    return true
  }

  if (to.meta.requiresAuth && !userStore.isLogin) {
    return { name: 'login', query: { redirect: to.fullPath } }
  }

  return true
})

export default router
