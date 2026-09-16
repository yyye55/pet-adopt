<script setup lang="ts">
/**
 * 通用布局 —— 侧边栏 + 顶栏 + 内容区
 */
import Sidebar from '@/components/layout/Sidebar.vue'
import Header from '@/components/layout/Header.vue'

defineProps<{
  title?: string
  subtitle?: string
  homePath?: string
  menuList: { name: string; path: string; icon: string }[]
  showProfileLink?: boolean
  contentBg?: string
}>()
</script>

<template>
  <div class="app-layout">
    <Sidebar :title="title" :subtitle="subtitle" :home-path="homePath" :menu-list="menuList" />
    <div class="app-main">
      <Header />
      <main class="app-content" :style="{ background: contentBg || 'var(--color-bg)' }">
        <router-view />
      </main>
    </div>
  </div>
</template>

<style scoped>
.app-layout {
  display: flex;
  min-height: 100vh;
}

.app-main {
  flex: 1;
  display: flex;
  flex-direction: column;
  min-width: 0;
}

.app-content {
  flex: 1;
  padding: 24px;
}
</style>
