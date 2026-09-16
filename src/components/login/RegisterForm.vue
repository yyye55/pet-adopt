<script setup lang="ts">
/**
 * 公共注册表单组件
 * 仅用户端展示
 */
import { reactive, ref } from 'vue'
import { User, Lock } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'

const emit = defineEmits<{
  (e: 'success'): void
}>()

const formRef = ref()
const loading = ref(false)

const form = reactive({
  account: '',
  password: '',
  confirmPassword: '',
})

const rules = {
  account: [{ required: true, message: '请输入账号', trigger: 'blur' }],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    { min: 6, message: '密码至少 6 位', trigger: 'blur' },
  ],
  confirmPassword: [
    { required: true, message: '请确认密码', trigger: 'blur' },
    {
      validator: (_rule: any, value: string, callback: any) => {
        if (value !== form.password) {
          callback(new Error('两次密码不一致'))
        } else {
          callback()
        }
      },
      trigger: 'blur',
    },
  ],
}

async function handleSubmit() {
  if (!formRef.value) return
  await formRef.value.validate(async (valid: boolean) => {
    if (!valid) return
    loading.value = true
    try {
      const users = JSON.parse(localStorage.getItem('yt_registered_users') || '[]')
      if (users.find((u: any) => u.account === form.account)) {
        ElMessage.error('该账号已被注册')
        return
      }
      users.push({
        account: form.account,
        password: form.password,
        role: 'user',
      })
      localStorage.setItem('yt_registered_users', JSON.stringify(users))
      ElMessage.success('注册成功，请登录')
      emit('success')
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
    class="register-form"
    @submit.prevent="handleSubmit"
  >
    <el-form-item label="账号" prop="account">
      <el-input v-model="form.account" placeholder="请输入账号">
        <template #prefix>
          <el-icon class="input-icon"><User /></el-icon>
        </template>
      </el-input>
    </el-form-item>

    <el-form-item label="密码" prop="password">
      <el-input v-model="form.password" type="password" show-password placeholder="至少 6 位">
        <template #prefix>
          <el-icon class="input-icon"><Lock /></el-icon>
        </template>
      </el-input>
    </el-form-item>

    <el-form-item label="确认密码" prop="confirmPassword">
      <el-input
        v-model="form.confirmPassword"
        type="password"
        show-password
        placeholder="再次输入密码"
      >
        <template #prefix>
          <el-icon class="input-icon"><Lock /></el-icon>
        </template>
      </el-input>
    </el-form-item>

    <el-button type="primary" :loading="loading" class="submit-btn" @click="handleSubmit">
      注 册
    </el-button>
  </el-form>
</template>

<style scoped lang="scss">

.register-form {
  display: flex;
  flex-direction: column;
  justify-content: center;
  height: 340px;

  :deep(.el-form-item) {
    margin-bottom: 12px;
  }

  :deep(.el-form-item__label) {
    font-size: 14px;
    font-weight: 500;
    color: var(--color-text-primary);
    padding-bottom: 6px;
  }

  :deep(.el-input__wrapper) {
    height: 44px;
    border-radius: 8px;
    background: #fafbfc;
    box-shadow: 0 0 0 1px var(--color-border) inset;
    transition: box-shadow 0.2s;

    &.is-focus {
      box-shadow:
        0 0 0 1px var(--color-primary) inset,
        0 0 0 3px rgba(var(--color-primary), 0.15);
    }

    &:hover {
      box-shadow: 0 0 0 1px var(--color-primary) inset;
    }
  }

  :deep(.el-input__inner) {
    font-size: 14px;

    &::placeholder {
      color: #a0aec0;
    }
  }

  :deep(.el-input__prefix-inner) {
    color: #a0aec0;

    .el-input__wrapper.is-focus & {
      color: var(--color-primary);
    }
  }

  :deep(.el-input__password) {
    color: #a0aec0;
  }
}

.input-icon {
  font-size: 16px;
}

.submit-btn {
  width: 100%;
  height: 44px;
  border-radius: 8px;
  font-size: 15px;
  font-weight: 600;
  background: var(--color-primary);
  border-color: var(--color-primary);
  margin-top: 4px;

  &:hover {
    background: #25877C;
    border-color: #25877C;
  }
}
</style>
