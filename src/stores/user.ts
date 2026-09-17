/**
 * 用户 Store — 登录状态、用户信息
 * 数据持久化到 localStorage
 */
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { getStorage, setStorage, removeStorage } from '@/utils/storage'
import { mockUsers } from '@/mock/users'

const USER_KEY = 'yt_user_info'
const TOKEN_KEY = 'yt_token'

export type UserRole = 'user' | 'admin'

export interface UserInfo {
  id: number
  nickname: string
  phone: string
  email: string
  hobby: string
  avatar: string
  role: UserRole
  gender: '男' | '女' | ''
  birthday: string
  city: string
  bio: string
  registerAt: string
}

/** 旧 userInfo 兼容补默认值 */
function patchLegacy(raw: any): UserInfo {
  return {
    id: raw.id ?? 0,
    nickname: raw.nickname ?? '',
    phone: raw.phone ?? '',
    email: raw.email ?? '',
    hobby: raw.hobby ?? '',
    avatar: raw.avatar ?? '',
    role: raw.role ?? 'user',
    gender: raw.gender ?? '',
    birthday: raw.birthday ?? '',
    city: raw.city ?? '',
    bio: raw.bio ?? '',
    registerAt: raw.registerAt ?? new Date().toLocaleString('zh-CN', { hour12: false }),
  }
}

export const useUserStore = defineStore('user', () => {
  // ---------- state ----------
  const userInfo = ref<UserInfo | null>(null)
  const token = ref<string>('')

  // 初始化：读 localStorage + 兼容旧数据
  const rawUser = getStorage<any>(USER_KEY, null)
  if (rawUser) {
    userInfo.value = patchLegacy(rawUser)
    // 如果补了新字段，重新写回
    if (!rawUser.gender || !rawUser.registerAt) {
      setStorage(USER_KEY, userInfo.value)
    }
  }
  token.value = getStorage<string>(TOKEN_KEY, '')

  // ---------- getters ----------
  const isLogin = computed(() => !!token.value)
  const isAdmin = computed(() => userInfo.value?.role === 'admin')

  // ---------- actions ----------
  /** 登录：验证账号密码，返回角色 */
  function login(account: string, password: string): UserRole {
    // 1. 匹配 mock 假账号
    const mockMatched = mockUsers.find((u) => u.account === account && u.password === password)
    if (mockMatched) {
      const info: UserInfo = {
        id: mockMatched.id,
        nickname: mockMatched.nickname,
        phone: mockMatched.phone,
        email: mockMatched.email,
        hobby: mockMatched.hobby,
        avatar: mockMatched.avatar,
        role: mockMatched.role,
        gender: mockMatched.gender,
        birthday: mockMatched.birthday,
        city: mockMatched.city,
        bio: mockMatched.bio,
        registerAt: mockMatched.registerAt,
      }
      userInfo.value = info
      token.value = `token_${Date.now()}`
      setStorage(USER_KEY, info)
      setStorage(TOKEN_KEY, token.value)
      return mockMatched.role
    }

    // 2. 匹配已注册的普通用户（从 localStorage 读取）
    const registeredUsers = JSON.parse(localStorage.getItem('yt_registered_users') || '[]')
    const matched = registeredUsers.find(
      (u: any) => u.account === account && u.password === password,
    )
    if (matched) {
      const now = new Date().toLocaleString('zh-CN', { hour12: false })
      const info: UserInfo = {
        id: matched.id || Date.now(),
        nickname: account,
        phone: '',
        email: '',
        hobby: '',
        avatar: '',
        role: 'user',
        gender: '',
        birthday: '',
        city: '',
        bio: '',
        registerAt: now,
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

  /** 更新个人资料（registerAt / id / role / avatar 不可修改） */
  function updateProfile(data: Partial<Omit<UserInfo, 'id' | 'role' | 'avatar' | 'registerAt'>>) {
    if (!userInfo.value) return
    userInfo.value = { ...userInfo.value, ...data }
    setStorage(USER_KEY, userInfo.value)
  }

  /** 退出登录，清空状态 */
  function logout() {
    userInfo.value = null
    token.value = ''
    removeStorage(USER_KEY)
    removeStorage(TOKEN_KEY)
  }

  return { userInfo, token, isLogin, isAdmin, login, updateProfile, logout }
})
