<script setup lang="ts">
/**
 * 用户端侧边栏
 * Logo + 导航菜单
 */
import { useRouter } from 'vue-router'
import logoImg from '@/assets/logo.png'

const router = useRouter()

const menuList = [
  { name: '首页', path: '/', icon: 'HomeFilled' },
  { name: '项目介绍', path: '/about', icon: 'InfoFilled' },
  { name: '个人中心', path: '/mine', icon: 'UserFilled' },
]
</script>

<template>
  <aside class="user-sidebar">
    <div class="sidebar-logo" @click="router.push('/')">
      <img :src="logoImg" alt="青行迹" class="logo-img" />
      <div class="logo-text">
        <div class="logo-cn">青行迹</div>
        <div class="logo-en">Youth Trail</div>
      </div>
    </div>

    <nav class="sidebar-menu">
      <router-link v-for="item in menuList" :key="item.path" :to="item.path" class="menu-item">
        <el-icon class="menu-icon"><component :is="item.icon" /></el-icon>
        <span class="menu-text">{{ item.name }}</span>
      </router-link>
    </nav>
  </aside>
</template>

<style scoped lang="scss">

.user-sidebar {
  width: 220px;
  background: var(--color-white);
  border-right: 1px solid var(--color-border);
  display: flex;
  flex-direction: column;
  flex-shrink: 0;
  height: 100vh;
  position: sticky;
  top: 0;

  .sidebar-logo {
    height: 72px;
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 0 20px;
    cursor: pointer;
    border-bottom: 1px solid var(--color-border);

    .logo-img {
      width: 40px;
      height: 40px;
      border-radius: 50%;
      object-fit: cover;
    }

    .logo-text {
      .logo-cn {
        font-size: 18px;
        font-weight: 700;
        color: var(--color-primary);
        line-height: 1.2;
      }

      .logo-en {
        font-size: 11px;
        color: var(--color-text-secondary);
        letter-spacing: 1px;
      }
    }
  }

  .sidebar-menu {
    flex: 1;
    padding: 16px 12px;

    .menu-item {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 12px 16px;
      margin-bottom: 4px;
      border-radius: 8px;
      color: var(--color-text-regular);
      font-size: 15px;
      transition: all 0.2s;
      position: relative;

      .menu-icon {
        font-size: 18px;
      }

      &.router-link-active {
        background: rgba(var(--color-primary), 0.1);
        color: var(--color-primary);
        font-weight: 600;

        &::before {
          content: '';
          position: absolute;
          left: -12px;
          top: 50%;
          transform: translateY(-50%);
          width: 3px;
          height: 20px;
          background: var(--color-primary);
          border-radius: 0 3px 3px 0;
        }
      }

      &:hover {
        background: var(--color-bg);
        color: var(--color-primary);
      }
    }
  }
}
</style>
