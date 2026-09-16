<script setup lang="ts">
/**
 * 顶栏（通用）—— 账号下拉 + 退出登录
 */
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/user'
import { ArrowDown } from '@element-plus/icons-vue'

const router = useRouter()
const userStore = useUserStore()

function handleLogout() {
  userStore.logout()
  router.push('/login')
}
</script>

<template>
  <header class="app-header">
    <div class="header-right">
      <template v-if="userStore.isLogin">
        <el-dropdown>
          <div class="account">
            <el-avatar :size="32" class="avatar">
              {{ userStore.userInfo?.nickname?.charAt(0) || 'U' }}
            </el-avatar>
            <span class="nickname">{{ userStore.userInfo?.nickname }}</span>
            <el-icon class="arrow"><ArrowDown /></el-icon>
          </div>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item @click="handleLogout">退出登录</el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </template>
      <template v-else>
        <el-button type="primary" @click="router.push('/login')">登录</el-button>
      </template>
    </div>
  </header>
</template>

<style scoped>
.app-header {
  height: 72px;
  background: var(--color-white);
  box-shadow: var(--shadow-sm);
  display: flex;
  align-items: center;
  justify-content: flex-end;
  padding: 0 24px;
  position: sticky;
  top: 0;
  z-index: 50;
}

.app-header .header-right {
  display: flex;
  align-items: center;
}

.app-header .account {
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  padding: 4px 12px;
  border-radius: 20px;
  transition: background 0.2s;
}

.app-header .account:hover {
  background: var(--color-bg);
}

.app-header .account .avatar {
  background: var(--color-primary);
  color: var(--color-white);
}

.app-header .account .nickname {
  color: var(--color-text-primary);
  font-size: 14px;
  font-weight: 500;
}

.app-header .account .arrow {
  color: var(--color-text-secondary);
  font-size: 12px;
}
</style>
