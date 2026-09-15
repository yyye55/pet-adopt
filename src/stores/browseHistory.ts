/**
 * 浏览记录 Store — 自动记录用户浏览过的线路
 * 数据持久化到 localStorage，最多保留 20 条
 */
import { defineStore } from 'pinia'
import { ref } from 'vue'
import { getStorage, setStorage } from '@/utils/storage'

const HISTORY_KEY = 'yt_browse_history'
const MAX_HISTORY = 20

export interface BrowseRecord {
  routeId: number
  routeName: string
  cover: string
  viewedAt: string
}

export const useBrowseHistoryStore = defineStore('browseHistory', () => {
  // ---------- state ----------
  const records = ref<BrowseRecord[]>(getStorage<BrowseRecord[]>(HISTORY_KEY, []))

  // ---------- actions ----------
  /** 添加一条浏览记录（自动去重，最新的置顶） */
  function addRecord(record: Omit<BrowseRecord, 'viewedAt'>) {
    // 先去重
    records.value = records.value.filter((r) => r.routeId !== record.routeId)
    // 插入到最前
    records.value.unshift({ ...record, viewedAt: new Date().toISOString() })
    // 限制数量
    if (records.value.length > MAX_HISTORY) {
      records.value = records.value.slice(0, MAX_HISTORY)
    }
    setStorage(HISTORY_KEY, records.value)
  }

  /** 清空浏览记录 */
  function clearHistory() {
    records.value = []
    setStorage(HISTORY_KEY, records.value)
  }

  return { records, addRecord, clearHistory }
})
