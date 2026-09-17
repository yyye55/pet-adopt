<script setup lang="ts">
/**
 * 救助站后台 · 申请审核
 * 路由：/admin
 */
import { ref, computed } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { useAdoptionStore, type Adoption, type AdoptionStatus } from '@/stores/adoption'

const adoptionStore = useAdoptionStore()

// ---------- 筛选 ----------
const statusFilter = ref<AdoptionStatus | '全部'>('全部')
const keyword = ref('')

const filteredList = computed(() => {
  let list = adoptionStore.adoptions
  if (statusFilter.value !== '全部') {
    list = list.filter((a) => a.status === statusFilter.value)
  }
  if (keyword.value.trim()) {
    const kw = keyword.value.trim().toLowerCase()
    list = list.filter(
      (a) =>
        a.applicantName.toLowerCase().includes(kw) ||
        a.applicantPhone.includes(kw) ||
        a.petName.toLowerCase().includes(kw),
    )
  }
  return list
})

// ---------- 统计 ----------
const stats = computed(() => ({
  total: adoptionStore.adoptions.length,
  pending: adoptionStore.adoptions.filter((a) => a.status === '待审核').length,
  approved: adoptionStore.adoptions.filter((a) => a.status === '已通过').length,
  rejected: adoptionStore.adoptions.filter((a) => a.status === '已驳回').length,
}))

// ---------- 详情弹窗 ----------
const detailVisible = ref(false)
const detailItem = ref<Adoption | null>(null)

function openDetail(row: Adoption) {
  detailItem.value = row
  detailVisible.value = true
}

// ---------- 审核 ----------
const rejectDialogVisible = ref(false)
const rejectTarget = ref<Adoption | null>(null)
const rejectReason = ref('')

function approve(row: Adoption) {
  ElMessageBox.confirm(
    `确认通过「${row.applicantName}」对「${row.petName}」的领养申请？`,
    '审核通过',
    { type: 'success', confirmButtonText: '通过', cancelButtonText: '取消' },
  )
    .then(() => {
      adoptionStore.reviewAdoption(row.id, true)
      ElMessage.success('已通过')
    })
    .catch(() => {})
}

function openReject(row: Adoption) {
  rejectTarget.value = row
  rejectReason.value = ''
  rejectDialogVisible.value = true
}

function confirmReject() {
  if (!rejectReason.value.trim()) {
    ElMessage.warning('请填写拒绝理由')
    return
  }
  if (!rejectTarget.value) return
  adoptionStore.reviewAdoption(rejectTarget.value.id, false, rejectReason.value.trim())
  ElMessage.success('已驳回')
  rejectDialogVisible.value = false
}

// ---------- 状态标签 ----------
function statusTagType(status: AdoptionStatus) {
  const map: Record<AdoptionStatus, string> = {
    待审核: 'warning',
    已通过: 'success',
    已驳回: 'danger',
  }
  return map[status]
}
</script>

<template>
  <div class="review-page">
    <!-- 统计卡片 -->
    <div class="stat-row">
      <div class="stat-card">
        <div class="stat-num">{{ stats.total }}</div>
        <div class="stat-label">总申请数</div>
      </div>
      <div class="stat-card pending">
        <div class="stat-num">{{ stats.pending }}</div>
        <div class="stat-label">待审核</div>
      </div>
      <div class="stat-card approved">
        <div class="stat-num">{{ stats.approved }}</div>
        <div class="stat-label">已通过</div>
      </div>
      <div class="stat-card rejected">
        <div class="stat-num">{{ stats.rejected }}</div>
        <div class="stat-label">已驳回</div>
      </div>
    </div>

    <!-- 筛选栏 -->
    <div class="filter-bar">
      <el-input
        v-model="keyword"
        placeholder="搜索申请人 / 手机号 / 宠物名"
        clearable
        class="search-input"
      />
      <el-radio-group v-model="statusFilter" class="status-group">
        <el-radio-button value="全部">全部</el-radio-button>
        <el-radio-button value="待审核">待审核</el-radio-button>
        <el-radio-button value="已通过">已通过</el-radio-button>
        <el-radio-button value="已驳回">已驳回</el-radio-button>
      </el-radio-group>
    </div>

    <!-- 表格 -->
    <div class="table-card">
      <el-table :data="filteredList" v-loading="false" stripe>
        <el-table-column label="宠物" min-width="160">
          <template #default="{ row }">
            <div class="pet-cell">
              <img :src="row.petCover" :alt="row.petName" class="pet-cover" />
              <span class="pet-name">{{ row.petName }}</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="applicantName" label="申请人" width="100" />
        <el-table-column prop="applicantPhone" label="手机号" width="130" />
        <el-table-column prop="houseType" label="住房" width="80" />
        <el-table-column prop="createdAt" label="申请时间" width="170" />
        <el-table-column label="状态" width="100">
          <template #default="{ row }">
            <el-tag :type="statusTagType(row.status)" size="small">
              {{ row.status }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="180" fixed="right">
          <template #default="{ row }">
            <el-button size="small" link @click="openDetail(row)">详情</el-button>
            <el-button
              v-if="row.status === '待审核'"
              size="small"
              type="success"
              link
              @click="approve(row)"
              >通过</el-button
            >
            <el-button
              v-if="row.status === '待审核'"
              size="small"
              type="danger"
              link
              @click="openReject(row)"
              >驳回</el-button
            >
          </template>
        </el-table-column>

        <template #empty>
          <el-empty description="暂无申请数据" />
        </template>
      </el-table>
    </div>

    <!-- ========== 详情弹窗 ========== -->
    <el-dialog v-model="detailVisible" width="560px" title="申请详情" destroy-on-close>
      <template v-if="detailItem">
        <div class="detail-grid">
          <div class="detail-row">
            <div class="detail-label">宠物</div>
            <div class="detail-value pet-cell">
              <img :src="detailItem.petCover" class="pet-cover" />
              {{ detailItem.petName }}
            </div>
          </div>
          <div class="detail-row">
            <div class="detail-label">申请人</div>
            <div class="detail-value">{{ detailItem.applicantName }}</div>
          </div>
          <div class="detail-row">
            <div class="detail-label">手机号</div>
            <div class="detail-value">{{ detailItem.applicantPhone }}</div>
          </div>
          <div class="detail-row">
            <div class="detail-label">身份证</div>
            <div class="detail-value">{{ detailItem.applicantIdCard }}</div>
          </div>
          <div class="detail-row">
            <div class="detail-label">住房类型</div>
            <div class="detail-value">{{ detailItem.houseType }}</div>
          </div>
          <div class="detail-row">
            <div class="detail-label">养宠经验</div>
            <div class="detail-value">{{ detailItem.hasPetBefore ? '有' : '无' }}</div>
          </div>
          <div class="detail-row full">
            <div class="detail-label">居住地址</div>
            <div class="detail-value">{{ detailItem.address }}</div>
          </div>
          <div class="detail-row full">
            <div class="detail-label">领养理由</div>
            <div class="detail-value reason">{{ detailItem.adoptionReason }}</div>
          </div>
          <div class="detail-row">
            <div class="detail-label">申请时间</div>
            <div class="detail-value">{{ detailItem.createdAt }}</div>
          </div>
          <div class="detail-row">
            <div class="detail-label">当前状态</div>
            <el-tag :type="statusTagType(detailItem.status)" size="small">
              {{ detailItem.status }}
            </el-tag>
          </div>
          <div v-if="detailItem.rejectReason" class="detail-row full">
            <div class="detail-label">驳回理由</div>
            <div class="detail-value reject-reason">{{ detailItem.rejectReason }}</div>
          </div>
        </div>
      </template>

      <template #footer>
        <el-button @click="detailVisible = false">关闭</el-button>
      </template>
    </el-dialog>

    <!-- ========== 拒绝弹窗 ========== -->
    <el-dialog v-model="rejectDialogVisible" width="420px" title="驳回申请" destroy-on-close>
      <p class="reject-tip">确认驳回「{{ rejectTarget?.applicantName }}」的领养申请？</p>
      <el-input
        v-model="rejectReason"
        type="textarea"
        :rows="3"
        placeholder="请填写驳回理由（必填）"
        maxlength="200"
        show-word-limit
      />
      <template #footer>
        <el-button @click="rejectDialogVisible = false">取消</el-button>
        <el-button type="danger" @click="confirmReject">确认驳回</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<style scoped>
.review-page {
  max-width: 1400px;
  margin: 0 auto;
}

/* ===== 统计卡片 ===== */
.stat-row {
  display: flex;
  gap: 16px;
  margin-bottom: 20px;
}

.stat-card {
  flex: 1;
  background: var(--color-white);
  border-radius: var(--radius-card);
  box-shadow: var(--shadow-sm);
  padding: 20px 24px;
  border-left: 4px solid var(--color-primary);
}

.stat-card.pending {
  border-left-color: var(--color-warning);
}
.stat-card.approved {
  border-left-color: var(--color-success);
}
.stat-card.rejected {
  border-left-color: var(--color-danger);
}

.stat-num {
  font-size: 28px;
  font-weight: 700;
  color: var(--color-text-primary);
}

.stat-label {
  font-size: 13px;
  color: var(--color-text-secondary);
  margin-top: 4px;
}

/* ===== 筛选栏 ===== */
.filter-bar {
  background: var(--color-white);
  border-radius: var(--radius-card);
  box-shadow: var(--shadow-sm);
  padding: 16px 20px;
  margin-bottom: 20px;
  display: flex;
  gap: 14px;
  align-items: center;
}

.search-input {
  width: 280px;
}

/* ===== 表格 ===== */
.table-card {
  background: var(--color-white);
  border-radius: var(--radius-card);
  box-shadow: var(--shadow-sm);
  padding: 20px;
}

.pet-cell {
  display: flex;
  align-items: center;
  gap: 10px;
}

.pet-cover {
  width: 36px;
  height: 36px;
  border-radius: 6px;
  object-fit: cover;
}

.pet-name {
  font-weight: 500;
}

/* ===== 详情弹窗 ===== */
.detail-grid {
  display: grid;
  grid-template-columns: 110px 1fr;
  gap: 12px 16px;
}

.detail-row {
  display: contents;
}

.detail-row.full {
  display: grid;
  grid-column: 1 / -1;
  grid-template-columns: 110px 1fr;
  gap: 12px 16px;
}

.detail-label {
  font-size: 14px;
  color: var(--color-text-secondary);
  align-self: start;
  padding-top: 2px;
}

.detail-value {
  font-size: 14px;
  color: var(--color-text-primary);
}

.detail-value.reason {
  line-height: 1.7;
}

.reject-reason {
  color: var(--color-danger);
}

.reject-tip {
  font-size: 14px;
  color: var(--color-text-regular);
  margin-bottom: 12px;
}
</style>
