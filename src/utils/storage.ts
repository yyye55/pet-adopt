/**
 * localStorage 持久化工具
 * 统一封装所有本地存储读写，供各 Store 调用
 */

/** 读取本地存储，返回解析后的对象或默认值 */
export function getStorage<T>(key: string, defaultValue: T): T {
  try {
    const raw = localStorage.getItem(key)
    if (raw === null) return defaultValue
    return JSON.parse(raw) as T
  } catch {
    return defaultValue
  }
}

/** 写入本地存储 */
export function setStorage<T>(key: string, value: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(value))
  } catch (e) {
    console.warn(`[storage] 写入失败: ${key}`, e)
  }
}

/** 删除本地存储 */
export function removeStorage(key: string): void {
  try {
    localStorage.removeItem(key)
  } catch (e) {
    console.warn(`[storage] 删除失败: ${key}`, e)
  }
}

/** 清空全部本地存储 */
export function clearStorage(): void {
  try {
    localStorage.clear()
  } catch (e) {
    console.warn('[storage] 清空失败', e)
  }
}
