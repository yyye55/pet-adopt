/**
 * 订单 Store — 报名订单的增删查
 * 数据持久化到 localStorage
 */
import { defineStore } from 'pinia'
import { ref } from 'vue'
import { getStorage, setStorage } from '@/utils/storage'

const ORDER_KEY = 'yt_orders'

export interface Order {
  id: number
  routeId: number
  routeName: string
  price: number
  contactName: string
  contactPhone: string
  peopleCount: number
  status: '待出行' | '已取消'
  createdAt: string
}

export const useOrderStore = defineStore('order', () => {
  // ---------- state ----------
  const orders = ref<Order[]>(getStorage<Order[]>(ORDER_KEY, []))

  // ---------- actions ----------
  /** 新增报名订单 */
  function addOrder(order: Omit<Order, 'id' | 'status' | 'createdAt'>) {
    const newOrder: Order = {
      ...order,
      id: Date.now(),
      status: '待出行',
      createdAt: new Date().toISOString(),
    }
    orders.value.unshift(newOrder)
    setStorage(ORDER_KEY, orders.value)
    return newOrder
  }

  /** 取消订单 */
  function cancelOrder(id: number) {
    const target = orders.value.find((o) => o.id === id)
    if (target) {
      target.status = '已取消'
      setStorage(ORDER_KEY, orders.value)
    }
  }

  /** 删除订单 */
  function removeOrder(id: number) {
    orders.value = orders.value.filter((o) => o.id !== id)
    setStorage(ORDER_KEY, orders.value)
  }

  return { orders, addOrder, cancelOrder, removeOrder }
})
