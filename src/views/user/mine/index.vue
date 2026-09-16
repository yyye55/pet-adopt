<script setup lang="ts">
/**
 * 个人中心
 * 路由：/mine（需登录）
 * 左右两栏布局，每项独立编辑
 */
import { ref, reactive, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/user'
import { useAdoptionStore } from '@/stores/adoption'
import { ElMessage, ElMessageBox } from 'element-plus'

const router = useRouter()
const userStore = useUserStore()
const adoptionStore = useAdoptionStore()
const info = userStore.userInfo!

// ---------- 统计 ----------
const stats = computed(() => ({
  applyCount: adoptionStore.myAdoptionCount,
  approvedCount: adoptionStore.myApprovedCount,
  pendingCount: adoptionStore.myPendingCount,
}))

// ---------- 独立编辑弹窗 ----------
type EditField = 'nickname' | 'phone' | 'email' | 'hobby' | null
const editingField = ref<EditField>(null)
const editValue = ref('')

const fieldLabels: Record<Exclude<EditField, null>, string> = {
  nickname: '昵称',
  phone: '电话',
  email: '邮箱',
  hobby: '养宠经验',
}

function startEdit(field: Exclude<EditField, null>) {
  editingField.value = field
  editValue.value = (info as any)[field] || ''
}

function saveEdit() {
  if (!editingField.value) return
  const val = editValue.value.trim()
  if (editingField.value === 'nickname' && !val) {
    ElMessage.warning('昵称不能为空')
    return
  }
  userStore.updateProfile({ [editingField.value]: val })
  ElMessage.success('已更新')
  editingField.value = null
}

function cancelEdit() {
  editingField.value = null
}

// ---------- 退出登录 ----------
function handleLogout() {
  ElMessageBox.confirm('确定要退出登录吗？', '提示', {
    confirmButtonText: '退出',
    cancelButtonText: '再想想',
    type: 'warning',
  })
    .then(() => {
      userStore.logout()
      router.push('/login')
    })
    .catch(() => {})
}
</script>

<template>
  <div class="mine-page">
    <h2 class="page-title">个人中心</h2>

    <div class="page-layout">
      <!-- ========== 左栏 ========== -->
      <div class="col-left">
        <div class="profile-card">
          <el-avatar :size="80" class="avatar">
            {{ info.nickname?.charAt(0) || 'U' }}
          </el-avatar>
          <div class="p-name">{{ info.nickname }}</div>
          <div class="p-role">
            <span :class="['role-badge', info.role]">
              {{ info.role === 'admin' ? '管理员' : '普通用户' }}
            </span>
          </div>
        </div>

        <div class="stats-card">
          <div class="stat-item" @click="router.push('/adoptions')">
            <div class="stat-num">{{ stats.applyCount }}</div>
            <div class="stat-label">总申请数</div>
          </div>
          <div class="stat-divider"></div>
          <div class="stat-item">
            <div class="stat-num">{{ stats.approvedCount }}</div>
            <div class="stat-label">已通过</div>
          </div>
          <div class="stat-divider"></div>
          <div class="stat-item">
            <div class="stat-num">{{ stats.pendingCount }}</div>
            <div class="stat-label">审核中</div>
          </div>
        </div>

        <el-button type="danger" plain class="logout-btn" @click="handleLogout">
          退出登录
        </el-button>
      </div>

      <!-- ========== 右栏 ========== -->
      <div class="col-right">
        <div class="section-title">基本资料</div>

        <div class="info-list">
          <div class="info-row">
            <span class="info-label">昵称</span>
            <template v-if="editingField !== 'nickname'">
              <span class="info-value">{{ info.nickname || '-' }}</span>
              <el-button class="edit-btn" link type="primary" @click="startEdit('nickname')"
                >编辑</el-button
              >
            </template>
            <template v-else>
              <el-input v-model="editValue" class="edit-input" maxlength="20" />
              <div class="edit-actions">
                <el-button type="primary" size="small" @click="saveEdit">保存</el-button>
                <el-button size="small" @click="cancelEdit">取消</el-button>
              </div>
            </template>
          </div>

          <div class="info-row">
            <span class="info-label">电话</span>
            <template v-if="editingField !== 'phone'">
              <span class="info-value">{{ info.phone || '-' }}</span>
              <el-button class="edit-btn" link type="primary" @click="startEdit('phone')"
                >编辑</el-button
              >
            </template>
            <template v-else>
              <el-input
                v-model="editValue"
                class="edit-input"
                maxlength="11"
                placeholder="手机号"
              />
              <div class="edit-actions">
                <el-button type="primary" size="small" @click="saveEdit">保存</el-button>
                <el-button size="small" @click="cancelEdit">取消</el-button>
              </div>
            </template>
          </div>

          <div class="info-row">
            <span class="info-label">邮箱</span>
            <template v-if="editingField !== 'email'">
              <span class="info-value">{{ info.email || '-' }}</span>
              <el-button class="edit-btn" link type="primary" @click="startEdit('email')"
                >编辑</el-button
              >
            </template>
            <template v-else>
              <el-input
                v-model="editValue"
                class="edit-input"
                maxlength="50"
                placeholder="邮箱地址"
              />
              <div class="edit-actions">
                <el-button type="primary" size="small" @click="saveEdit">保存</el-button>
                <el-button size="small" @click="cancelEdit">取消</el-button>
              </div>
            </template>
          </div>

          <div class="info-row last">
            <span class="info-label">爱好</span>
            <template v-if="editingField !== 'hobby'">
              <span class="info-value">{{ info.hobby || '-' }}</span>
              <el-button class="edit-btn" link type="primary" @click="startEdit('hobby')"
                >编辑</el-button
              >
            </template>
            <template v-else>
              <el-input
                v-model="editValue"
                class="edit-input"
                maxlength="50"
                placeholder="如：旅游、摄影"
              />
              <div class="edit-actions">
                <el-button type="primary" size="small" @click="saveEdit">保存</el-button>
                <el-button size="small" @click="cancelEdit">取消</el-button>
              </div>
            </template>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.mine-page {
  max-width: 1400px;
  margin: 0 auto;
}

.page-title {
  font-size: 22px;
  font-weight: 600;
  color: var(--color-text-primary);
  margin: 0 0 22px;
}

/* ===== 两栏布局 ===== */
.page-layout {
  display: flex;
  gap: 24px;
  align-items: flex-start;
}

.col-left {
  width: 300px;
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
  gap: 16px;
  position: sticky;
  top: 20px;
}

.col-right {
  flex: 1;
  min-width: 0;
}

/* ===== 左栏：头像卡片 ===== */
.profile-card {
  background: var(--color-white);
  border-radius: var(--radius-card);
  box-shadow: var(--shadow-sm);
  padding: 28px 20px;
  text-align: center;
}

.profile-card .avatar {
  background: var(--color-primary);
  color: var(--color-white);
  margin-bottom: 14px;
}

.profile-card .p-name {
  font-size: 18px;
  font-weight: 600;
  color: var(--color-text-primary);
  margin-bottom: 8px;
}

.role-badge {
  display: inline-block;
  font-size: 12px;
  padding: 2px 10px;
  border-radius: 10px;
  font-weight: 500;
}

.role-badge.admin {
  background: var(--color-secondary);
  color: var(--color-warning);
}

.role-badge.user {
  background: var(--color-bg);
  color: var(--color-success);
}

/* ===== 左栏：统计 ===== */
.stats-card {
  background: var(--color-white);
  border-radius: var(--radius-card);
  box-shadow: var(--shadow-sm);
  padding: 18px 10px;
  display: flex;
  align-items: center;
  cursor: pointer;
}

.stat-item {
  flex: 1;
  text-align: center;
  transition: opacity 0.2s;
}

.stat-item:hover {
  opacity: 0.75;
}

.stat-num {
  font-size: 24px;
  font-weight: 700;
  color: var(--color-primary);
  margin-bottom: 4px;
}

.stat-label {
  font-size: 12px;
  color: var(--color-text-secondary);
}

.stat-divider {
  width: 1px;
  height: 32px;
  background: var(--color-border);
}

/* ===== 左栏：退出按钮 ===== */
.logout-btn {
  width: 100%;
}

/* ===== 右栏 ===== */
.section-title {
  font-size: 15px;
  font-weight: 600;
  color: var(--color-text-primary);
  margin-bottom: 12px;
  padding-left: 4px;
}

.info-list {
  background: var(--color-white);
  border-radius: var(--radius-card);
  box-shadow: var(--shadow-sm);
  padding: 6px 0;
}

.info-row {
  display: flex;
  align-items: center;
  padding: 14px 24px;
  border-bottom: 1px solid var(--color-border);
  gap: 16px;
}

.info-row.last {
  border-bottom: none;
}

.info-label {
  width: 70px;
  font-size: 14px;
  color: var(--color-text-secondary);
  flex-shrink: 0;
}

.info-value {
  flex: 1;
  font-size: 14px;
  color: var(--color-text-primary);
}

.edit-btn {
  flex-shrink: 0;
  padding: 0;
}

.edit-input {
  flex: 1;
  max-width: 320px;
}

.edit-actions {
  display: flex;
  gap: 8px;
  flex-shrink: 0;
}
</style>
