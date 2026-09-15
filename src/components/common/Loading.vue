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

<style scoped lang="scss">
.common-loading {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px 0;
  gap: 12px;

  .loading-icon {
    color: #2478b5;
    animation: rotate 1s linear infinite;
  }

  .loading-text {
    color: #718096;
    font-size: 14px;
  }
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
