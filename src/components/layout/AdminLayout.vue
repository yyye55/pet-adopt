<script setup lang="ts">
/**
 * 管理员端整体布局
 */
import Sidebar from './Sidebar.vue'
import AdminHeader from './AdminHeader.vue'
</script>

<template>
  <div class="admin-layout">
    <Sidebar />
    <div class="admin-main">
      <AdminHeader />
      <main class="admin-content">
        <router-view />
      </main>
    </div>
  </div>
</template>

<style scoped lang="scss">
.admin-layout {
  display: flex;
  min-height: 100vh;
}

.admin-main {
  flex: 1;
  display: flex;
  flex-direction: column;
  min-width: 0;
}

.admin-content {
  flex: 1;
  padding: 24px;
  background: #f5f7fa;
}
</style>
