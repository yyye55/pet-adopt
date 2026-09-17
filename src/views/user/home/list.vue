<script setup lang="ts">
/**
 * 宠物列表页
 * 拾光萌约 · 待领养宠物
 */
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { Search } from '@element-plus/icons-vue'
import { pets, speciesList, type Pet } from '@/mock/pets'
import { useAdoptionStore } from '@/stores/adoption'
import { useDebouncedRef } from '@/composables/useDebouncedRef'
import PetCard from '@/components/common/PetCard.vue'
import PetAdoptDialog from '@/components/common/PetAdoptDialog.vue'

const router = useRouter()
const adoptionStore = useAdoptionStore()

// ---------- 筛选状态 ----------
const { value: keyword, debounced: debouncedKeyword } = useDebouncedRef('')
const species = ref('全部')
const adoptStatus = ref<'全部' | '待领养' | '已领养'>('全部')

function handleReset() {
  keyword.value = ''
  species.value = '全部'
  adoptStatus.value = '全部'
}

// ---------- 筛选结果 ----------
const filtered = computed(() => {
  let list = [...pets]

  if (debouncedKeyword.value.trim()) {
    const kw = debouncedKeyword.value.trim().toLowerCase()
    list = list.filter(
      (p) => p.name.toLowerCase().includes(kw) || p.breed.toLowerCase().includes(kw),
    )
  }

  if (species.value !== '全部') {
    list = list.filter((p) => p.species === species.value)
  }

  if (adoptStatus.value !== '全部') {
    list = list.filter((p) => p.status === adoptStatus.value)
  }

  return list
})

// ---------- 弹窗 ----------
const dialogVisible = ref(false)
const currentPet = ref<Pet | null>(null)

function handleOpen(pet: Pet) {
  currentPet.value = pet
  dialogVisible.value = true
}

function handleSubmit(data: Parameters<typeof adoptionStore.submitAdoption>[0]) {
  adoptionStore.submitAdoption(data)
  ElMessage.success('申请已提交！等待救助站审核~')
  router.push('/home/adoptions')
}
</script>

<template>
  <div class="list-page">
    <!-- 搜索 + 筛选 -->
    <div class="filter-bar">
      <el-input v-model="keyword" placeholder="搜索宠物名字 / 品种" clearable class="search-input">
        <template #prefix>
          <el-icon><Search /></el-icon>
        </template>
      </el-input>

      <span class="filter-label">物种</span>
      <el-select v-model="species" class="filter-select" placeholder="物种">
        <el-option v-for="s in speciesList" :key="s" :label="s" :value="s" />
      </el-select>

      <span class="filter-label">状态</span>
      <el-select v-model="adoptStatus" class="filter-select" placeholder="状态">
        <el-option label="全部" value="全部" />
        <el-option label="待领养" value="待领养" />
        <el-option label="已领养" value="已领养" />
      </el-select>

      <el-button @click="handleReset">重置</el-button>
    </div>

    <!-- 宠物卡片网格 -->
    <div v-if="filtered.length > 0" class="pet-grid">
      <PetCard v-for="p in filtered" :key="p.id" :pet="p" @open="handleOpen" />
    </div>

    <!-- 空状态 -->
    <div v-else class="empty-state">
      <div class="empty-text">暂无可领养的宠物</div>
      <div class="empty-hint">试试换个筛选条件</div>
    </div>

    <!-- 详情 + 申请领养 合并弹窗 -->
    <PetAdoptDialog :pet="currentPet" v-model:visible="dialogVisible" @submit="handleSubmit" />
  </div>
</template>

<style scoped>
.list-page {
  max-width: 1400px;
  margin: 0 auto;
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
  flex: 1;
  max-width: 380px;
}

.filter-select {
  width: 140px;
}

.filter-label {
  font-size: 13px;
  color: var(--color-text-secondary);
  flex-shrink: 0;
}

/* ===== 卡片网格 ===== */
.pet-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 20px;
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
