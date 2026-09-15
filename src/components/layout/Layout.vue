<script setup lang="ts">
/**
 * 整体布局组件
 * 导航栏 + 主内容区 + 页脚
 * 所有路由页面均在此布局内渲染
 */
import NavBar from './NavBar.vue'
import Footer from './Footer.vue'
</script>

<template>
  <div class="yt-layout">
    <NavBar />
    <main class="yt-main">
      <router-view />
    </main>
    <Footer />
  </div>
</template>

<style scoped lang="scss">
.yt-layout {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.yt-main {
  flex: 1;
  width: 100%;
}
</style>
