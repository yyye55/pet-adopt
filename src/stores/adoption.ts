/**
 * 领养申请 Store
 * 拾光萌约
 */
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { useUserStore } from './user'
import { getStorage, setStorage, removeStorage } from '@/utils/storage'
import { SEED_ADOPTIONS } from '@/mock/adoptions'

export type AdoptionStatus = '待审核' | '已通过' | '已驳回'

export interface Adoption {
  id: number
  applicantId: number
  petId: number
  petName: string
  petAge: string
  petCover: string
  applicantName: string
  applicantPhone: string
  applicantAge: number | null
  applicantIdCard: string
  address: string
  hasPetBefore: boolean
  houseType: '自有' | '租房'
  acceptVisit: '是' | '否'
  adoptionReason: string
  status: AdoptionStatus
  rejectReason?: string
  createdAt: string
}

const STORAGE_KEY = 'yt_adoptions'

/** 旧状态 → 新状态 迁移映射 */
function migrateStatus(old: string): AdoptionStatus {
  if (old === '审核通过' || old === '已完成') return '已通过'
  if (old === '审核拒绝') return '已驳回'
  return old as AdoptionStatus
}

export const useAdoptionStore = defineStore('adoption', () => {
  const adoptions = ref<Adoption[]>([])

  // ---------- 持久化 ----------
  function load() {
    const data = getStorage<Adoption[]>(STORAGE_KEY)
    if (data && Array.isArray(data) && data.length > 0) {
      // 兼容旧数据：补新增字段默认值 + 状态值迁移
      adoptions.value = data.map((a) => ({
        ...a,
        applicantId: a.applicantId ?? 0,
        petAge: a.petAge ?? '未知',
        acceptVisit: a.acceptVisit ?? '是',
        status: migrateStatus(a.status),
      }))
    } else {
      // 首次进入：写入种子数据
      adoptions.value = SEED_ADOPTIONS
      setStorage(STORAGE_KEY, SEED_ADOPTIONS)
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
    return adoptions.value.filter((a) => a.applicantId === userStore.userInfo?.id)
  })

  const myAdoptionCount = computed(() => myAdoptions.value.length)
  const myApprovedCount = computed(
    () => myAdoptions.value.filter((a) => a.status === '已通过').length,
  )
  const myPendingCount = computed(
    () => myAdoptions.value.filter((a) => a.status === '待审核').length,
  )

  // ---------- 用户操作 ----------
  function submitAdoption(data: Omit<Adoption, 'id' | 'applicantId' | 'status' | 'createdAt'>) {
    const newItem: Adoption = {
      ...data,
      id: Date.now(),
      applicantId: userStore.userInfo?.id ?? 0,
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
      item.status = '已驳回'
      item.rejectReason = '申请人主动撤销'
      save()
    }
  }

  // ---------- 管理员操作 ----------
  function reviewAdoption(id: number, approved: boolean, reason?: string) {
    const item = adoptions.value.find((a) => a.id === id)
    if (item && item.status === '待审核') {
      item.status = approved ? '已通过' : '已驳回'
      if (!approved && reason) item.rejectReason = reason
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
    reset,
  }
})
