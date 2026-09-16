<script setup lang="ts">
/**
 * 登录/注册页面
 * 管理员端和用户端共用此页面
 */
import { ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import logoImg from '@/assets/logo.png'
import LoginForm from '@/components/login/LoginForm.vue'
import RegisterForm from '@/components/login/RegisterForm.vue'

const route = useRoute()
const router = useRouter()

// 如果是管理员入口（?mode=admin），隐藏注册 Tab
const isAdminMode = route.query.mode === 'admin'

// Tab：login / register
const activeTab = ref<'login' | 'register'>('login')

function onLoginSuccess(role: 'user' | 'admin') {
  const redirect = (route.query.redirect as string) || ''
  if (redirect) {
    router.push(redirect)
  } else if (role === 'admin') {
    router.push('/admin')
  } else {
    router.push('/')
  }
}

function onRegisterSuccess() {
  activeTab.value = 'login'
}
</script>

<template>
  <div class="login-page">
    <div class="login-card">
      <!-- 左侧品牌区 -->
      <div class="login-left">
        <div class="brand-box">
          <img :src="logoImg" alt="青行迹" class="brand-logo" />
          <h1 class="brand-cn">青行迹</h1>
          <p class="brand-en">Youth Trail</p>
          <div class="brand-slogan">
            <p>青春正当时</p>
            <p>一路向山海出发</p>
          </div>
        </div>
      </div>

      <!-- 右侧表单区 -->
      <div class="login-right">
        <template v-if="!isAdminMode">
          <!-- 用户端：文字 + 底部激活条切换 -->
          <div class="login-switch">
            <div
              class="switch-item"
              :class="{ active: activeTab === 'login' }"
              @click="activeTab = 'login'"
            >
              登录
            </div>
            <div
              class="switch-item"
              :class="{ active: activeTab === 'register' }"
              @click="activeTab = 'register'"
            >
              注册
            </div>
            <div class="switch-indicator" :class="{ right: activeTab === 'register' }"></div>
          </div>
          <LoginForm v-if="activeTab === 'login'" @success="onLoginSuccess" />
          <RegisterForm v-else @success="onRegisterSuccess" />
        </template>
        <template v-else>
          <!-- 管理员端：只显示登录 -->
          <div class="admin-login-title">管理后台登录</div>
          <LoginForm @success="onLoginSuccess" />
        </template>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.login-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--color-bg);
  padding: 20px;
}

.login-card {
  display: flex;
  width: 800px;
  min-height: 480px;
  background: var(--color-white);
  border-radius: var(--radius-card);
  box-shadow: var(--shadow-card);
  overflow: hidden;
}

// ---------- 左侧品牌区 ----------
.login-left {
  width: 40%;
  background: #f0f5f4;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 40px 32px;

  .brand-box {
    text-align: center;
  }

  .brand-logo {
    width: 140px;
    height: 140px;
    margin-bottom: 28px;
    display: block;
  }

  .brand-cn {
    font-size: 36px;
    font-weight: 700;
    color: var(--color-primary);
    margin-bottom: 6px;
    letter-spacing: 3px;
  }

  .brand-en {
    font-size: 16px;
    color: var(--color-text-secondary);
    letter-spacing: 4px;
    margin-bottom: 40px;
  }

  .brand-slogan {
    p {
      font-size: 18px;
      line-height: 2;
      color: var(--color-text-primary);
    }
  }
}

// ---------- 右侧表单区 ----------
.login-right {
  flex: 1;
  padding: 40px 40px 0;
  display: flex;
  flex-direction: column;
}

.login-switch {
  position: relative;
  display: flex;
  width: 100%;
  height: 44px;
  border-bottom: 1px solid var(--color-border);
  margin-bottom: 28px;

  .switch-item {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 22px;
    font-weight: 600;
    color: var(--color-text-secondary);
    cursor: pointer;
    transition: color 0.25s ease;
    user-select: none;

    &.active {
      color: var(--color-primary);
    }
  }

  .switch-indicator {
    position: absolute;
    bottom: -1px;
    left: 0;
    width: 50%;
    height: 3px;
    background: var(--color-primary);
    border-radius: 2px 2px 0 0;
    transition: transform 0.25s ease;

    &.right {
      transform: translateX(100%);
    }
  }
}

.admin-login-title {
  font-size: 20px;
  font-weight: 600;
  color: var(--color-text-primary);
  margin-bottom: 28px;
}
</style>
