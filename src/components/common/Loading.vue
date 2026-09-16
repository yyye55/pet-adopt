<script setup lang="ts">
/**
 * 通用加载状态组件
 * 数据加载中时展示
 * 用户端和管理员端均可复用
 */
withDefaults(
  defineProps<{
    text?: string
  }>(),
  {
    text: '加载中...',
  },
)
</script>

<template>
  <div class="common-loading">
    <el-icon class="loading-icon" :size="28">
      <Loading />
    </el-icon>
    <span class="loading-text">{{ text }}</span>
  </div>
</template>

<style scoped>
.common-loading {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px 0;
  gap: 12px;
}

.common-loading .loading-icon {
  color: var(--color-primary);
  animation: rotate 1s linear infinite;
}

.common-loading .loading-text {
  color: var(--color-text-secondary);
  font-size: 14px;
}

@keyframes rotate {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}
</style>
