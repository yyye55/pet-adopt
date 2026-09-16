<script setup lang="ts">
/**
 * 通用空状态组件
 * 列表/表格无数据时展示
 * 用户端和管理员端均可复用
 */
import { computed } from 'vue'

const props = withDefaults(
  defineProps<{
    description?: string
    image?: string
    imageSize?: number
  }>(),
  {
    description: '暂无数据',
    image: '',
    imageSize: 120,
  },
)

const imgUrl = computed(() => props.image || undefined)
</script>

<template>
  <div class="common-empty">
    <el-empty :description="description" :image="imgUrl" :image-size="imageSize" />
  </div>
</template>

<style scoped>
.common-empty {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 40px 0;
}
</style>
