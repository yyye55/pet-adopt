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
  /** 登录成功后保存用户信息 */
  function login(info: UserInfo) {
    userInfo.value = info
    token.value = `token_${Date.now()}`
    setStorage(USER_KEY, info)
    setStorage(TOKEN_KEY, token.value)
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
