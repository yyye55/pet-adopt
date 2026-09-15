<script setup lang="ts">
/**
 * 管理员顶部栏
 */
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/user'

const router = useRouter()
const userStore = useUserStore()

function handleLogout() {
  userStore.logout()
  router.push('/login')
}
</script>

<template>
  <header class="admin-header">
    <div class="header-left">
      <span>欢迎，{{ userStore.userInfo?.nickname || '管理员' }}</span>
    </div>
    <div class="header-right">
      <el-button link type="primary" @click="handleLogout">退出登录</el-button>
    </div>
  </header>
</template>

<style scoped lang="scss">
.admin-header {
  height: 60px;
  background: #fff;
  box-shadow: 0 1px 4px rgba(0, 21, 41, 0.08);
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 24px;

  .header-left {
    color: #2f3e46;
    font-weight: 500;
  }
}
</style>
