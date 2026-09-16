<script setup lang="ts">
/**
 * 通用确认弹窗组件
 * 基于 Element Plus el-dialog 封装
 * 用于删除、取消等危险操作的二次确认
 * 用户端和管理员端均可复用
 */
import { ref, watch } from 'vue'

const props = withDefaults(
  defineProps<{
    modelValue: boolean
    title?: string
    content?: string
    confirmText?: string
    cancelText?: string
    confirmType?: 'primary' | 'success' | 'warning' | 'danger'
  }>(),
  {
    title: '提示',
    content: '确定执行此操作吗？',
    confirmText: '确定',
    cancelText: '取消',
    confirmType: 'primary',
  },
)

const emit = defineEmits<{
  (e: 'update:modelValue', val: boolean): void
  (e: 'confirm'): void
  (e: 'cancel'): void
}>()

const visible = ref(props.modelValue)

watch(
  () => props.modelValue,
  (val) => {
    visible.value = val
  },
)

function handleClose() {
  visible.value = false
  emit('update:modelValue', false)
  emit('cancel')
}

function handleConfirm() {
  visible.value = false
  emit('update:modelValue', false)
  emit('confirm')
}
</script>

<template>
  <el-dialog
    :model-value="visible"
    :title="title"
    width="400px"
    :close-on-click-modal="false"
    @close="handleClose"
  >
    <div class="confirm-content">{{ content }}</div>
    <template #footer>
      <el-button @click="handleClose">{{ cancelText }}</el-button>
      <el-button :type="confirmType" @click="handleConfirm">{{ confirmText }}</el-button>
    </template>
  </el-dialog>
</template>

<style scoped>
.confirm-content {
  font-size: 15px;
  color: var(--color-text-primary);
  line-height: 1.6;
  padding: 8px 0;
}
</style>
