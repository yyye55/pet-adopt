<script setup lang="ts">
/**
 * 用户端整体布局
 * 左侧边栏 + 右侧（顶栏 + 内容区）
 */
import UserSidebar from './UserSidebar.vue'
import UserHeader from './UserHeader.vue'
</script>

<template>
  <div class="user-layout">
    <UserSidebar />
    <div class="user-main">
      <UserHeader />
      <main class="user-content">
        <router-view />
      </main>
    </div>
  </div>
</template>

<style scoped lang="scss">

.user-layout {
  display: flex;
  min-height: 100vh;
}

.user-main {
  flex: 1;
  display: flex;
  flex-direction: column;
  min-width: 0;
}

.user-content {
  flex: 1;
  padding: 24px;
  background: var(--color-bg);
}
</style>
