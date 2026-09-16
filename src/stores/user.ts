/**
 * 用户 Store — 登录状态、用户信息
 * 数据持久化到 localStorage
 */
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { getStorage, setStorage, removeStorage } from '@/utils/storage'

const USER_KEY = 'yt_user_info'
const TOKEN_KEY = 'yt_token'

export type UserRole = 'user' | 'admin'

export interface UserInfo {
  id: number
  nickname: string
  phone: string
  avatar: string
  role: UserRole
}

export const useUserStore = defineStore('user', () => {
  // ---------- state ----------
  const userInfo = ref<UserInfo | null>(getStorage<UserInfo | null>(USER_KEY, null))
  const token = ref<string>(getStorage<string>(TOKEN_KEY, ''))

  // ---------- getters ----------
  const isLogin = computed(() => !!token.value)
  const isAdmin = computed(() => userInfo.value?.role === 'admin')

  // ---------- actions ----------
  /** 登录：验证账号密码，返回角色 */
  function login(account: string, password: string): UserRole {
    // Mock 管理员账号
    if (account === 'admin' && password === '123456') {
      const info: UserInfo = {
        id: 1,
        nickname: '管理员',
        phone: '',
        avatar: '',
        role: 'admin',
      }
      userInfo.value = info
      token.value = `token_${Date.now()}`
      setStorage(USER_KEY, info)
      setStorage(TOKEN_KEY, token.value)
      return 'admin'
    }

    // Mock 普通用户账号
    if (account === 'user' && password === '123456') {
      const info: UserInfo = {
        id: 2,
        nickname: '青行迹用户',
        phone: '',
        avatar: '',
        role: 'user',
      }
      userInfo.value = info
      token.value = `token_${Date.now()}`
      setStorage(USER_KEY, info)
      setStorage(TOKEN_KEY, token.value)
      return 'user'
    }

    // 已注册的普通用户（从 localStorage 读取）
    const registeredUsers = JSON.parse(localStorage.getItem('yt_registered_users') || '[]')
    const matched = registeredUsers.find(
      (u: any) => u.account === account && u.password === password,
    )
    if (matched) {
      const info: UserInfo = {
        id: matched.id || Date.now(),
        nickname: account,
        phone: '',
        avatar: '',
        role: 'user',
      }
      userInfo.value = info
      token.value = `token_${Date.now()}`
      setStorage(USER_KEY, info)
      setStorage(TOKEN_KEY, token.value)
      return 'user'
    }

    // 都不匹配
    throw new Error('账号或密码错误')
  }

  /** 退出登录，清空状态 */
  function logout() {
    userInfo.value = null
    token.value = ''
    removeStorage(USER_KEY)
    removeStorage(TOKEN_KEY)
  }

  return { userInfo, token, isLogin, isAdmin, login, logout }
})
