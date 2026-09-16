<script setup lang="ts">
/**
 * 用户端顶栏
 * 仅展示账号 + 退出登录按钮
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
  <header class="user-header">
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
              <el-dropdown-item @click="router.push('/mine')">个人中心</el-dropdown-item>
              <el-dropdown-item divided @click="handleLogout">退出登录</el-dropdown-item>
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

<style scoped lang="scss">

.user-header {
  height: 56px;
  background: var(--color-white);
  box-shadow: var(--shadow-sm);
  display: flex;
  align-items: center;
  justify-content: flex-end;
  padding: 0 24px;
  position: sticky;
  top: 0;
  z-index: 50;

  .header-right {
    display: flex;
    align-items: center;
  }

  .account {
    display: flex;
    align-items: center;
    gap: 8px;
    cursor: pointer;
    padding: 4px 12px;
    border-radius: 20px;
    transition: background 0.2s;

    &:hover {
      background: var(--color-bg);
    }

    .avatar {
      background: var(--color-primary);
      color: #fff;
    }

    .nickname {
      color: var(--color-text-primary);
      font-size: 14px;
      font-weight: 500;
    }

    .arrow {
      color: var(--color-text-secondary);
      font-size: 12px;
    }
  }
}
</style>
