<script setup lang="ts">
/**
 * 通用分页组件
 * 基于 Element Plus el-pagination 封装
 * 用户端线路列表、管理员端各表格均可复用
 */
import { computed } from 'vue'

const props = withDefaults(
  defineProps<{
    total: number
    page?: number
    pageSize?: number
    pageSizes?: number[]
    layout?: string
    background?: boolean
  }>(),
  {
    page: 1,
    pageSize: 10,
    pageSizes: () => [10, 20, 50, 100],
    layout: 'total, sizes, prev, pager, next, jumper',
    background: true,
  },
)

const emit = defineEmits<{
  (e: 'update:page', val: number): void
  (e: 'update:pageSize', val: number): void
  (e: 'change', page: number, pageSize: number): void
}>()

const currentPage = computed({
  get: () => props.page,
  set: (val) => emit('update:page', val),
})

const currentPageSize = computed({
  get: () => props.pageSize,
  set: (val) => emit('update:pageSize', val),
})

function handleSizeChange(val: number) {
  emit('update:pageSize', val)
  emit('change', currentPage.value, val)
}

function handleCurrentChange(val: number) {
  emit('update:page', val)
  emit('change', val, currentPageSize.value)
}
</script>

<template>
  <div class="common-pagination">
    <el-pagination
      v-model:current-page="currentPage"
      v-model:page-size="currentPageSize"
      :total="total"
      :page-sizes="pageSizes"
      :layout="layout"
      :background="background"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    />
  </div>
</template>

<style scoped>
.common-pagination {
  display: flex;
  justify-content: flex-end;
  padding: 16px 0;
}
</style>
