<script setup lang="ts">
/**
 * 公共登录表单组件
 * 管理员端和用户端共用，支持 Enter 键提交
 */
import { reactive, ref } from 'vue'
import { User, Lock } from '@element-plus/icons-vue'
import { useUserStore } from '@/stores/user'

const emit = defineEmits<{
  (e: 'success', role: 'user' | 'admin'): void
}>()

const userStore = useUserStore()

const formRef = ref()
const loading = ref(false)

const form = reactive({
  account: '',
  password: '',
})

const rules = {
  account: [{ required: true, message: '请输入账号', trigger: 'blur' }],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    { min: 6, message: '密码至少 6 位', trigger: 'blur' },
  ],
}

async function handleSubmit() {
  if (!formRef.value) return
  await formRef.value.validate(async (valid: boolean) => {
    if (!valid) return
    loading.value = true
    try {
      const role = await userStore.login(form.account, form.password)
      emit('success', role)
    } catch (err: any) {
      ElMessage.error(err?.message || '登录失败')
    } finally {
      loading.value = false
    }
  })
}
</script>

<template>
  <el-form
    ref="formRef"
    :model="form"
    :rules="rules"
    label-position="top"
    size="large"
    class="login-form"
    @submit.prevent="handleSubmit"
    @keyup.enter="handleSubmit"
  >
    <el-form-item label="账号" prop="account">
      <el-input v-model="form.account" placeholder="请输入账号">
        <template #prefix>
          <el-icon class="input-icon"><User /></el-icon>
        </template>
      </el-input>
    </el-form-item>

    <el-form-item label="密码" prop="password">
      <el-input v-model="form.password" type="password" show-password placeholder="请输入密码">
        <template #prefix>
          <el-icon class="input-icon"><Lock /></el-icon>
        </template>
      </el-input>
    </el-form-item>

    <el-button type="primary" :loading="loading" class="submit-btn" @click="handleSubmit">
      登 录
    </el-button>
  </el-form>
</template>

<style scoped>
.login-form {
  display: flex;
  flex-direction: column;
  justify-content: center;
  height: 340px;
}

.login-form :deep(.el-form-item) {
  margin-bottom: 20px;
}

.login-form :deep(.el-form-item__label) {
  font-size: 14px;
  font-weight: 500;
  color: var(--color-text-primary);
  padding-bottom: 6px;
}

.login-form :deep(.el-input__wrapper) {
  height: 44px;
  border-radius: 8px;
  background: var(--color-bg-light);
  box-shadow: 0 0 0 1px var(--color-border) inset;
  transition: box-shadow 0.2s;
}

.login-form :deep(.el-input__wrapper.is-focus) {
  box-shadow:
    0 0 0 1px var(--color-primary) inset,
    0 0 0 3px rgba(245, 158, 11, 0.15);
}

.login-form :deep(.el-input__wrapper:hover) {
  box-shadow: 0 0 0 1px var(--color-primary) inset;
}

.login-form :deep(.el-input__inner) {
  font-size: 14px;
}

.login-form :deep(.el-input__inner::placeholder) {
  color: var(--color-placeholder);
}

.login-form :deep(.el-input__prefix-inner) {
  color: var(--color-placeholder);
}

.login-form :deep(.el-input__wrapper.is-focus .el-input__prefix-inner) {
  color: var(--color-primary);
}

.login-form :deep(.el-input__password) {
  color: var(--color-placeholder);
}

.login-form .input-icon {
  font-size: 16px;
}

.login-form .submit-btn {
  width: 100%;
  height: 44px;
  border-radius: 8px;
  font-size: 15px;
  font-weight: 600;
  background: var(--color-primary);
  border-color: var(--color-primary);
  margin-top: 8px;
}

.login-form .submit-btn:hover {
  background: var(--color-primary-dark);
  border-color: var(--color-primary-dark);
}
</style>
