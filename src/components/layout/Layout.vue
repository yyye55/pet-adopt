<script setup lang="ts">
/**
 * 用户端整体布局组件
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
