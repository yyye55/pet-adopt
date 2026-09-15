/**
 * 收藏 Store — 收藏线路的增删查
 * 数据持久化到 localStorage
 */
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { getStorage, setStorage } from '@/utils/storage'

const FAV_KEY = 'yt_favorites'

export const useFavoriteStore = defineStore('favorite', () => {
  // ---------- state ----------
  // 存储收藏的线路 id 列表
  const favoriteIds = ref<number[]>(getStorage<number[]>(FAV_KEY, []))

  // ---------- getters ----------
  const count = computed(() => favoriteIds.value.length)

  // ---------- actions ----------
  /** 判断某线路是否已收藏 */
  function isFavorited(routeId: number): boolean {
    return favoriteIds.value.includes(routeId)
  }

  /** 切换收藏状态 */
  function toggleFavorite(routeId: number) {
    const idx = favoriteIds.value.indexOf(routeId)
    if (idx >= 0) {
      favoriteIds.value.splice(idx, 1)
    } else {
      favoriteIds.value.unshift(routeId)
    }
    setStorage(FAV_KEY, favoriteIds.value)
  }

  /** 取消收藏 */
  function removeFavorite(routeId: number) {
    favoriteIds.value = favoriteIds.value.filter((id) => id !== routeId)
    setStorage(FAV_KEY, favoriteIds.value)
  }

  return { favoriteIds, count, isFavorited, toggleFavorite, removeFavorite }
})
