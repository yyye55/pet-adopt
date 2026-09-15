<script setup lang="ts">
/**
 * 管理员侧边导航
 */
import { useRouter } from 'vue-router'

const router = useRouter()

const menuList = [
  { name: '仪表盘', path: '/admin', icon: 'Odometer' },
  { name: '线路管理', path: '/admin/routes', icon: 'List' },
  { name: '订单管理', path: '/admin/orders', icon: 'Tickets' },
  { name: '用户管理', path: '/admin/users', icon: 'User' },
  { name: '报名审核', path: '/admin/signups', icon: 'Checked' },
]
</script>

<template>
  <aside class="admin-sidebar">
    <div class="sidebar-logo" @click="router.push('/admin')">
      青行迹 · 管理后台
    </div>
    <nav class="sidebar-menu">
      <router-link
        v-for="item in menuList"
        :key="item.path"
        :to="item.path"
        class="menu-item"
      >
        <el-icon><component :is="item.icon" /></el-icon>
        <span>{{ item.name }}</span>
      </router-link>
    </nav>
  </aside>
</template>

<style scoped lang="scss">
.admin-sidebar {
  width: 220px;
  background: #001529;
  color: #fff;
  display: flex;
  flex-direction: column;

  .sidebar-logo {
    height: 60px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 16px;
    font-weight: 700;
    cursor: pointer;
    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  }

  .sidebar-menu {
    flex: 1;
    padding: 12px 0;

    .menu-item {
      display: flex;
      align-items: center;
      gap: 10px;
      padding: 12px 24px;
      color: rgba(255, 255, 255, 0.7);
      transition: all 0.2s;

      &.router-link-active {
        background: #1890ff;
        color: #fff;
      }

      &:hover {
        color: #fff;
        background: rgba(255, 255, 255, 0.08);
      }
    }
  }
}
</style>
