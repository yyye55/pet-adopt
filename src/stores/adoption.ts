/**
 * 领养申请 Store
 * 拾光萌约
 */
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { useUserStore } from './user'
import { getStorage, setStorage, removeStorage } from '@/utils/storage'

export type AdoptionStatus = '待审核' | '审核通过' | '审核拒绝' | '已完成'

export interface Adoption {
  id: number
  petId: number
  petName: string
  petCover: string
  applicantName: string
  applicantPhone: string
  applicantIdCard: string
  address: string
  hasPetBefore: boolean
  houseType: '自有' | '租房'
  adoptionReason: string
  status: AdoptionStatus
  rejectReason?: string
  createdAt: string
}

const STORAGE_KEY = 'yt_adoptions'

export const useAdoptionStore = defineStore('adoption', () => {
  const adoptions = ref<Adoption[]>([])

  // ---------- 持久化 ----------
  function load() {
    const data = getStorage<Adoption[]>(STORAGE_KEY)
    if (data && Array.isArray(data)) {
      adoptions.value = data
    }
  }

  function save() {
    setStorage(STORAGE_KEY, adoptions.value)
  }

  // 初始化
  load()

  // ---------- 计算 ----------
  const userStore = useUserStore()

  const myAdoptions = computed(() => {
    if (!userStore.userInfo) return []
    return adoptions.value.filter(
      (a) => a.applicantPhone === userStore.userInfo?.phone,
    )
  })

  const myAdoptionCount = computed(() => myAdoptions.value.length)
  const myApprovedCount = computed(() =>
    myAdoptions.value.filter((a) => a.status === '审核通过' || a.status === '已完成').length,
  )
  const myPendingCount = computed(() =>
    myAdoptions.value.filter((a) => a.status === '待审核').length,
  )

  // ---------- 用户操作 ----------
  function submitAdoption(data: Omit<Adoption, 'id' | 'status' | 'createdAt'>) {
    const newItem: Adoption = {
      ...data,
      id: Date.now(),
      status: '待审核',
      createdAt: new Date().toLocaleString('zh-CN', { hour12: false }),
    }
    adoptions.value.unshift(newItem)
    save()
    return newItem
  }

  function cancelAdoption(id: number) {
    const item = adoptions.value.find((a) => a.id === id)
    if (item && item.status === '待审核') {
      item.status = '审核拒绝'
      item.rejectReason = '申请人主动撤销'
      save()
    }
  }

  // ---------- 管理员操作 ----------
  function reviewAdoption(id: number, approved: boolean, reason?: string) {
    const item = adoptions.value.find((a) => a.id === id)
    if (item && item.status === '待审核') {
      item.status = approved ? '审核通过' : '审核拒绝'
      if (!approved && reason) item.rejectReason = reason
      save()
    }
  }

  function completeAdoption(id: number) {
    const item = adoptions.value.find((a) => a.id === id)
    if (item && item.status === '审核通过') {
      item.status = '已完成'
      save()
    }
  }

  // ---------- 重置 ----------
  function reset() {
    adoptions.value = []
    removeStorage(STORAGE_KEY)
  }

  return {
    adoptions,
    myAdoptions,
    myAdoptionCount,
    myApprovedCount,
    myPendingCount,
    submitAdoption,
    cancelAdoption,
    reviewAdoption,
    completeAdoption,
    reset,
  }
})
