<script setup lang="ts">
/**
 * 我的领养申请
 * 路由：/adoptions
 */
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Search } from '@element-plus/icons-vue'
import { useAdoptionStore, type AdoptionStatus } from '@/stores/adoption'

const router = useRouter()
const store = useAdoptionStore()

const keyword = ref('')
const statusFilter = ref<'全部' | AdoptionStatus>('全部')

const statusList: ('全部' | AdoptionStatus)[] = ['全部', '待审核', '审核通过', '审核拒绝', '已完成']

const filtered = computed(() => {
  let list = store.myAdoptions

  if (keyword.value.trim()) {
    const kw = keyword.value.trim().toLowerCase()
    list = list.filter((a) => a.petName.toLowerCase().includes(kw) || a.applicantName.includes(kw))
  }

  if (statusFilter.value !== '全部') {
    list = list.filter((a) => a.status === statusFilter.value)
  }

  return list
})

function statusTag(status: AdoptionStatus) {
  const map: Record<AdoptionStatus, { type: string; text: string }> = {
    待审核: { type: 'warning', text: '待审核' },
    审核通过: { type: 'success', text: '审核通过' },
    审核拒绝: { type: 'danger', text: '审核未通过' },
    已完成: { type: 'primary', text: '已领养' },
  }
  return map[status]
}

async function cancel(id: number) {
  try {
    await ElMessageBox.confirm('确定要撤销这条申请吗？撤销后需要重新提交。', '撤销确认', {
      type: 'warning',
    })
    store.cancelAdoption(id)
    ElMessage.success('已撤销')
  } catch {
    /* cancel */
  }
}

function goHome() {
  router.push('/')
}
</script>

<template>
  <div class="adoptions-page">
    <!-- 标题栏 -->
    <div class="page-header">
      <h2 class="page-title">我的领养申请</h2>
      <el-button type="primary" @click="goHome">+ 去领养</el-button>
    </div>

    <!-- 筛选 -->
    <div class="filter-bar">
      <div class="search-box">
        <el-input v-model="keyword" placeholder="搜索宠物名字 / 申请人" clearable>
          <template #prefix>
            <el-icon><Search /></el-icon>
          </template>
        </el-input>
      </div>

      <div class="status-tabs">
        <div
          v-for="s in statusList"
          :key="s"
          class="tab-item"
          :class="{ active: statusFilter === s }"
          @click="statusFilter = s"
        >
          {{ s }}
          <span v-if="s !== '全部'" class="tab-count">
            {{ store.myAdoptions.filter((a) => a.status === s).length }}
          </span>
          <span v-else class="tab-count">{{ store.myAdoptionCount }}</span>
        </div>
      </div>
    </div>

    <!-- 申请列表 -->
    <div v-if="filtered.length > 0" class="adoption-list">
      <div v-for="a in filtered" :key="a.id" class="adoption-card">
        <div class="card-left">
          <img :src="a.petCover" :alt="a.petName" class="pet-cover" />
        </div>

        <div class="card-center">
          <div class="pet-name">🐾 {{ a.petName }}</div>
          <div class="apply-info">
            <div>👤 {{ a.applicantName }} · 📞 {{ a.applicantPhone }}</div>
            <div>📍 {{ a.address }}</div>
            <div>📅 申请时间：{{ a.createdAt }}</div>
          </div>
          <div class="apply-reason"><strong>领养理由：</strong>{{ a.adoptionReason }}</div>
          <div v-if="a.rejectReason" class="reject-reason">❌ 拒绝原因：{{ a.rejectReason }}</div>
        </div>

        <div class="card-right">
          <el-tag :type="statusTag(a.status).type as any" effect="dark" class="status-tag">
            {{ statusTag(a.status).text }}
          </el-tag>
          <div class="petty-note">
            住房：{{ a.houseType }} · 养宠经验：{{ a.hasPetBefore ? '有' : '无' }}
          </div>
          <div v-if="a.status === '待审核'" class="card-actions">
            <el-button size="small" type="danger" plain @click="cancel(a.id)"> 撤销申请 </el-button>
          </div>
          <div v-else-if="a.status === '审核拒绝'" class="card-actions">
            <el-button size="small" @click="goHome">重新申请</el-button>
          </div>
        </div>
      </div>
    </div>

    <!-- 空状态 -->
    <div v-else class="empty-state">
      <div class="empty-icon">🐾</div>
      <div class="empty-text">暂无申请记录</div>
      <div class="empty-hint">去宠物列表页看看有哪些毛孩子在等你~</div>
      <el-button type="primary" @click="goHome">去领养</el-button>
    </div>
  </div>
</template>

<style scoped>
.adoptions-page {
  max-width: 1400px;
  margin: 0 auto;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.page-title {
  font-size: 22px;
  font-weight: 700;
  color: var(--color-text-primary);
  margin: 0;
}

.filter-bar {
  background: var(--color-white);
  border-radius: var(--radius-card);
  box-shadow: var(--shadow-sm);
  padding: 16px 20px;
  margin-bottom: 20px;
  display: flex;
  align-items: center;
  gap: 20px;
  flex-wrap: wrap;
}

.search-box {
  width: 280px;
}

.status-tabs {
  display: flex;
  gap: 4px;
}

.tab-item {
  padding: 6px 14px;
  font-size: 13px;
  border-radius: 999px;
  cursor: pointer;
  color: var(--color-text-secondary);
  transition: all 0.2s;
  display: flex;
  align-items: center;
  gap: 4px;
}

.tab-item:hover {
  background: var(--color-secondary);
  color: var(--color-primary);
}

.tab-item.active {
  background: var(--color-primary);
  color: var(--color-white);
}

.tab-count {
  font-size: 11px;
  opacity: 0.75;
}

/* ===== 列表卡片 ===== */
.adoption-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.adoption-card {
  background: var(--color-white);
  border-radius: var(--radius-card);
  box-shadow: var(--shadow-sm);
  padding: 20px;
  display: flex;
  gap: 20px;
}

.card-left .pet-cover {
  width: 120px;
  height: 120px;
  border-radius: 12px;
  object-fit: cover;
  flex-shrink: 0;
}

.card-center {
  flex: 1;
  min-width: 0;
}

.pet-name {
  font-size: 18px;
  font-weight: 600;
  color: var(--color-text-primary);
  margin-bottom: 10px;
}

.apply-info {
  font-size: 13px;
  color: var(--color-text-secondary);
  display: flex;
  flex-direction: column;
  gap: 4px;
  margin-bottom: 10px;
}

.apply-reason {
  font-size: 13px;
  color: var(--color-text-regular);
  background: var(--color-secondary);
  padding: 10px 14px;
  border-radius: 8px;
  line-height: 1.6;
  margin-bottom: 8px;
}

.reject-reason {
  font-size: 13px;
  color: var(--color-white);
  background: var(--color-danger);
  padding: 10px 14px;
  border-radius: 8px;
  line-height: 1.6;
}

.card-right {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  justify-content: space-between;
  gap: 10px;
  min-width: 140px;
}

.status-tag {
  font-size: 13px;
}

.petty-note {
  font-size: 11px;
  color: var(--color-text-secondary);
  text-align: right;
}

.card-actions {
  display: flex;
  gap: 8px;
}

/* ===== 空状态 ===== */
.empty-state {
  text-align: center;
  padding: 80px 20px;
  background: var(--color-white);
  border-radius: var(--radius-card);
  box-shadow: var(--shadow-sm);
}

.empty-icon {
  font-size: 48px;
  margin-bottom: 16px;
}

.empty-text {
  font-size: 16px;
  color: var(--color-text-primary);
  margin-bottom: 6px;
}

.empty-hint {
  font-size: 13px;
  color: var(--color-text-secondary);
  margin-bottom: 16px;
}
</style>
