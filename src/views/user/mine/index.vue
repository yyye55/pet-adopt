<script setup lang="ts">
/**
 * 个人中心
 * 路由：/home/mine
 * 整表单整体切换编辑/查看态
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

// ---------- 整表单编辑态 ----------
const isEditing = ref(false)
const formData = reactive({
  nickname: info.nickname,
  gender: info.gender,
  birthday: info.birthday,
  city: info.city,
  phone: info.phone,
  email: info.email,
  hobby: info.hobby,
  bio: info.bio,
})

const genderOptions = ['男', '女', '保密']

function handleEdit() {
  Object.assign(formData, {
    nickname: info.nickname,
    gender: info.gender,
    birthday: info.birthday,
    city: info.city,
    phone: info.phone,
    email: info.email,
    hobby: info.hobby,
    bio: info.bio,
  })
  isEditing.value = true
}

function handleSave() {
  if (!formData.nickname.trim()) {
    ElMessage.warning('昵称不能为空')
    return
  }
  userStore.updateProfile({ ...formData })
  ElMessage.success('已更新')
  isEditing.value = false
}

function handleCancel() {
  isEditing.value = false
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
          <div class="stat-item" @click="router.push('/home/adoptions')">
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
        <div class="profile-form">
          <!-- 卡片头部 -->
          <div class="form-header">
            <div class="form-title">
              <span class="title-text">个人资料</span>
              <span class="title-sub">基本信息 · 联系方式 · 养宠偏好</span>
            </div>
            <el-button v-if="!isEditing" type="primary" plain @click="handleEdit">
              编辑资料
            </el-button>
          </div>

          <!-- 字段列表 -->
          <div class="form-body">
            <!-- 昵称 -->
            <div class="form-row">
              <span class="row-label">昵称</span>
              <template v-if="!isEditing">
                <span class="row-value">{{ info.nickname || '-' }}</span>
              </template>
              <template v-else>
                <el-input v-model="formData.nickname" maxlength="20" />
              </template>
            </div>

            <!-- 性别 -->
            <div class="form-row">
              <span class="row-label">性别</span>
              <template v-if="!isEditing">
                <span class="row-value">{{ info.gender || '-' }}</span>
              </template>
              <template v-else>
                <el-select v-model="formData.gender" placeholder="请选择" style="width: 200px">
                  <el-option v-for="g in genderOptions" :key="g" :label="g" :value="g" />
                </el-select>
              </template>
            </div>

            <!-- 生日 -->
            <div class="form-row">
              <span class="row-label">生日</span>
              <template v-if="!isEditing">
                <span class="row-value">{{ info.birthday || '-' }}</span>
              </template>
              <template v-else>
                <el-date-picker
                  v-model="formData.birthday"
                  type="date"
                  value-format="YYYY-MM-DD"
                  placeholder="选择日期"
                  style="width: 200px"
                />
              </template>
            </div>

            <!-- 城市 -->
            <div class="form-row">
              <span class="row-label">城市</span>
              <template v-if="!isEditing">
                <span class="row-value">{{ info.city || '-' }}</span>
              </template>
              <template v-else>
                <el-input v-model="formData.city" maxlength="20" placeholder="如：成都" />
              </template>
            </div>

            <!-- 电话 -->
            <div class="form-row">
              <span class="row-label">电话</span>
              <template v-if="!isEditing">
                <span class="row-value">{{ info.phone || '-' }}</span>
              </template>
              <template v-else>
                <el-input v-model="formData.phone" maxlength="11" placeholder="手机号" />
              </template>
            </div>

            <!-- 邮箱 -->
            <div class="form-row">
              <span class="row-label">邮箱</span>
              <template v-if="!isEditing">
                <span class="row-value">{{ info.email || '-' }}</span>
              </template>
              <template v-else>
                <el-input v-model="formData.email" maxlength="50" placeholder="邮箱地址" />
              </template>
            </div>

            <!-- 爱好 -->
            <div class="form-row">
              <span class="row-label">爱好</span>
              <template v-if="!isEditing">
                <span class="row-value">{{ info.hobby || '-' }}</span>
              </template>
              <template v-else>
                <el-input v-model="formData.hobby" maxlength="50" placeholder="如：旅游、摄影" />
              </template>
            </div>

            <!-- 个人简介 -->
            <div class="form-row">
              <span class="row-label">个人简介</span>
              <template v-if="!isEditing">
                <span class="row-value bio">{{ info.bio || '-' }}</span>
              </template>
              <template v-else>
                <el-input
                  v-model="formData.bio"
                  type="textarea"
                  :rows="2"
                  maxlength="80"
                  show-word-limit
                  placeholder="一句话介绍自己"
                />
              </template>
            </div>
          </div>

          <!-- 卡片底部：编辑态按钮 -->
          <div v-if="isEditing" class="form-footer">
            <el-button @click="handleCancel">取消</el-button>
            <el-button type="primary" @click="handleSave">保存</el-button>
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

/* ===== 右栏：资料卡片 ===== */
.profile-form {
  background: var(--color-white);
  border-radius: var(--radius-card);
  box-shadow: var(--shadow-sm);
}

.form-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 18px 24px;
  border-bottom: 1px solid var(--color-border);
}

.form-title {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.title-text {
  font-size: 16px;
  font-weight: 600;
  color: var(--color-text-primary);
}

.title-sub {
  font-size: 12px;
  color: var(--color-text-secondary);
}

.form-body {
  padding: 6px 0;
}

.form-row {
  display: flex;
  align-items: center;
  padding: 14px 24px;
  border-bottom: 1px solid var(--color-border);
  gap: 16px;
}

.form-row:last-child {
  border-bottom: none;
}

.row-label {
  width: 80px;
  font-size: 14px;
  color: var(--color-text-secondary);
  flex-shrink: 0;
}

.row-value {
  font-size: 14px;
  color: var(--color-text-primary);
}

.row-value.bio {
  line-height: 1.6;
}

.form-footer {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  padding: 16px 24px;
  border-top: 1px solid var(--color-border);
}
</style>
