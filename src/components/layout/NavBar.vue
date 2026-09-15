<script setup lang="ts">
/**
 * 用户端导航栏组件
 * Logo + 主菜单 + 搜索框 + 登录/注册入口
 */
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/user'
import logoImg from '@/assets/logo.svg'

const router = useRouter()
const userStore = useUserStore()

const keyword = ref('')

const menuList = [
  { name: '首页', path: '/' },
  { name: '项目介绍', path: '/about' },
  { name: '个人中心', path: '/mine' },
]

function handleSearch() {
  router.push({ path: '/', query: { keyword: keyword.value } })
}

function handleLogout() {
  userStore.logout()
  router.push('/login')
}
</script>

<template>
  <header class="yt-navbar">
    <div class="container nav-inner">
      <div class="logo" @click="router.push('/')">
        <img :src="logoImg" alt="青行迹" class="logo-img" />
      </div>

      <nav class="nav-menu">
        <router-link v-for="item in menuList" :key="item.path" :to="item.path" class="nav-item">
          {{ item.name }}
        </router-link>
      </nav>

      <div class="nav-search">
        <el-input
          v-model="keyword"
          placeholder="搜索旅游线路"
          clearable
          @keyup.enter="handleSearch"
        >
          <template #append>
            <el-button @click="handleSearch">搜索</el-button>
          </template>
        </el-input>
      </div>

      <div class="nav-user">
        <template v-if="userStore.isLogin">
          <span class="nickname">{{ userStore.userInfo?.nickname }}</span>
          <el-button link type="primary" @click="handleLogout">退出</el-button>
        </template>
        <template v-else>
          <el-button link type="primary" @click="router.push('/login')">登录</el-button>
          <el-button type="primary" @click="router.push('/login')">注册</el-button>
        </template>
      </div>
    </div>
  </header>
</template>

<style scoped lang="scss">
@use '@/styles/variables.scss' as *;

.yt-navbar {
  position: sticky;
  top: 0;
  z-index: 100;
  background: $color-white;
  box-shadow: $shadow-sm;
  height: 64px;

  .nav-inner {
    display: flex;
    align-items: center;
    height: 100%;
    gap: $spacing-xl;
  }

  .logo {
    display: flex;
    align-items: center;
    cursor: pointer;

    .logo-img {
      height: 36px;
    }
  }

  .nav-menu {
    display: flex;
    gap: $spacing-xl;

    .nav-item {
      color: $color-text-regular;
      font-size: 15px;
      transition: color 0.2s;

      &.router-link-active {
        color: $color-primary;
        font-weight: 600;
      }

      &:hover {
        color: $color-primary;
      }
    }
  }

  .nav-search {
    flex: 1;
    max-width: 320px;
  }

  .nav-user {
    display: flex;
    align-items: center;
    gap: $spacing-sm;

    .nickname {
      color: $color-text-regular;
    }
  }
}
</style>
