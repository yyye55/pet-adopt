<script setup lang="ts">
/**
 * 我的领养申请
 * 路由：/home/adoptions
 */
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import { useAdoptionStore, type AdoptionStatus } from '@/stores/adoption'
import { useDebouncedRef } from '@/composables/useDebouncedRef'
import AdoptionCard from '@/components/common/AdoptionCard.vue'

const router = useRouter()
const store = useAdoptionStore()

const { value: keyword, debounced: debouncedKeyword } = useDebouncedRef('')
const statusFilter = ref<'全部' | AdoptionStatus>('全部')

const statusList: ('全部' | AdoptionStatus)[] = ['全部', '待审核', '已通过', '已驳回']

const filtered = computed(() => {
  let list = store.myAdoptions

  if (debouncedKeyword.value.trim()) {
    const kw = debouncedKeyword.value.trim().toLowerCase()
    list = list.filter((a) => a.petName.toLowerCase().includes(kw) || a.applicantName.includes(kw))
  }

  if (statusFilter.value !== '全部') {
    list = list.filter((a) => a.status === statusFilter.value)
  }

  return list
})

async function handleCancel(id: number) {
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

function handleReapply() {
  router.push('/home')
}
</script>

<template>
  <div class="adoptions-page">
    <!-- 标题栏 -->
    <div class="page-header">
      <h2 class="page-title">我的领养申请</h2>
    </div>

    <!-- 筛选 -->
    <div class="filter-bar">
      <div class="search-box">
        <el-input v-model="keyword" placeholder="搜索宠物名字 / 申请人" clearable />
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

    <!-- 申请列表：一排两个，使用 AdoptionCard 组件 -->
    <div v-if="filtered.length > 0" class="adoption-list">
      <AdoptionCard
        v-for="a in filtered"
        :key="a.id"
        :adoption="a"
        @cancel="handleCancel"
        @reapply="handleReapply"
      />
    </div>

    <!-- 空状态 -->
    <div v-else class="empty-state">
      <div class="empty-text">暂无申请记录</div>
      <div class="empty-hint">去宠物列表页看看有哪些宠物在等你~</div>
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

/* ===== 列表：一排两个 Grid ===== */
.adoption-list {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16px;
}

/* ===== 空状态 ===== */
.empty-state {
  text-align: center;
  padding: 80px 20px;
  background: var(--color-white);
  border-radius: var(--radius-card);
  box-shadow: var(--shadow-sm);
}

.empty-text {
  font-size: 16px;
  color: var(--color-text-primary);
  margin-bottom: 6px;
}

.empty-hint {
  font-size: 13px;
  color: var(--color-text-secondary);
}
</style>
