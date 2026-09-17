/**
 * 创建一个带防抖的 ref
 * - value: 实时值（双向绑定用 v-model）
 * - debounced: 防抖后的值（computed 依赖用）
 *
 * 使用示例：
 *   const { value: keyword, debounced: debouncedKeyword } = useDebouncedRef('')
 *   <el-input v-model="keyword" />
 *   computed(() => list.filter(debouncedKeyword.value))
 */
import { ref, watch, onBeforeUnmount, type Ref } from 'vue'

export function useDebouncedRef<T>(initial: T, delay = 300): {
  value: Ref<T>
  debounced: Ref<T>
} {
  const value = ref(initial) as Ref<T>
  const debounced = ref(initial) as Ref<T>
  let timer: ReturnType<typeof setTimeout> | null = null

  watch(value, (val) => {
    if (timer) clearTimeout(timer)
    timer = setTimeout(() => {
      debounced.value = val
    }, delay)
  })

  onBeforeUnmount(() => {
    if (timer) clearTimeout(timer)
  })

  return { value, debounced }
}
