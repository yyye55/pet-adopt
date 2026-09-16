<script setup lang="ts">
/**
 * 侧边导航（通用）
 * 用户端/管理员端共用，颜色/高亮效果一致
 */
import { useRouter } from 'vue-router'
import logoImg from '@/assets/logo.png'

const props = defineProps<{
  title?: string
  subtitle?: string
  homePath?: string
  menuList: { name: string; path: string; icon: string }[]
}>()

const router = useRouter()
</script>

<template>
  <aside class="app-sidebar">
    <div class="sidebar-logo" @click="router.push(props.homePath || '/')">
      <img :src="logoImg" alt="拾光萌约" class="logo-img" />
      <div class="logo-text">
        <div class="logo-cn">{{ props.title || '拾光萌约' }}</div>
        <div class="logo-en">{{ props.subtitle || 'Pet Moment' }}</div>
      </div>
    </div>

    <nav class="sidebar-menu">
      <router-link
        v-for="item in props.menuList"
        :key="item.path"
        :to="item.path"
        class="menu-item"
      >
        <el-icon class="menu-icon"><component :is="item.icon" /></el-icon>
        <span class="menu-text">{{ item.name }}</span>
      </router-link>
    </nav>
  </aside>
</template>

<style scoped>
.app-sidebar {
  width: 220px;
  flex-shrink: 0;
  height: 100vh;
  position: sticky;
  top: 0;
  display: flex;
  flex-direction: column;
  background: var(--color-white);
  border-right: 1px solid var(--color-border);
}

.app-sidebar .sidebar-logo {
  height: 72px;
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 0 20px;
  cursor: pointer;
  border-bottom: 1px solid var(--color-border);
}

.app-sidebar .sidebar-logo .logo-img {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  object-fit: cover;
}

.app-sidebar .sidebar-logo .logo-text .logo-cn {
  font-size: 20px;
  font-weight: 700;
  color: var(--color-primary);
  line-height: 1.2;
}

.app-sidebar .sidebar-logo .logo-text .logo-en {
  font-size: 11px;
  color: var(--color-text-secondary);
  letter-spacing: 1px;
}

.app-sidebar .sidebar-menu {
  flex: 1;
  padding: 16px 12px;
}

.app-sidebar .sidebar-menu .menu-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 16px;
  margin-bottom: 10px;
  border-radius: 8px;
  color: var(--color-text-regular);
  font-size: 16px;
  transition: all 0.2s;
  position: relative;
}

.app-sidebar .sidebar-menu .menu-item .menu-icon {
  font-size: 18px;
}

.app-sidebar .sidebar-menu .menu-item.router-link-exact-active {
  background: rgba(42, 157, 143, 0.12);
  color: var(--color-primary);
  font-weight: 600;
}

.app-sidebar .sidebar-menu .menu-item.router-link-exact-active::before {
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

.app-sidebar .sidebar-menu .menu-item:hover {
  background: rgba(42, 157, 143, 0.06);
  color: var(--color-primary);
}
</style>
