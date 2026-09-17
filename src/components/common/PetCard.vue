<script setup lang="ts">
/**
 * 宠物卡片组件
 * 用于用户端列表页和管理员端宠物档案
 */
import type { Pet } from '@/mock/pets'

defineProps<{
  pet: Pet
}>()

const emit = defineEmits<{
  (e: 'open', pet: Pet): void
}>()
</script>

<template>
  <div class="pet-card" :class="{ adopted: pet.status === '已领养' }">
    <!-- 图片区 -->
    <div class="card-cover">
      <img :src="pet.cover" :alt="pet.name" />
      <el-tag size="small" effect="dark" class="species-tag">
        {{ pet.species }}
      </el-tag>
      <el-tag
        size="small"
        effect="light"
        class="status-tag"
        :type="pet.status === '已领养' ? 'info' : 'success'"
      >
        {{ pet.status }}
      </el-tag>
      <div v-if="pet.status === '已领养'" class="adopted-badge">已被领养</div>
    </div>

    <!-- 信息区 -->
    <div class="card-body">
      <div class="info-grid">
        <div class="info-item">
          <span class="info-label">姓名</span><span class="info-value">{{ pet.name }}</span>
        </div>
        <div class="info-item">
          <span class="info-label">性别</span><span class="info-value">{{ pet.gender }}</span>
        </div>
        <div class="info-item">
          <span class="info-label">品种</span><span class="info-value">{{ pet.breed }}</span>
        </div>
        <div class="info-item">
          <span class="info-label">年龄</span><span class="info-value">{{ pet.age }}</span>
        </div>
      </div>

      <div class="card-health">
        <el-tag v-if="pet.vaccinated" size="small" type="success" effect="light">已疫苗</el-tag>
        <el-tag v-if="pet.neutered" size="small" type="success" effect="light">已绝育</el-tag>
        <span v-if="!pet.vaccinated && !pet.neutered" class="health-empty">暂无健康记录</span>
      </div>

      <!-- 底部按钮 -->
      <div class="card-footer">
        <el-button
          size="medium"
          :type="pet.status === '已领养' ? 'default' : 'primary'"
          @click="emit('open', pet)"
        >
          {{ pet.status === '已领养' ? '查看详情' : '查看详情 / 申请领养' }}
        </el-button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.pet-card {
  background: var(--color-white);
  border-radius: var(--radius-card);
  box-shadow: var(--shadow-sm);
  overflow: hidden;
  transition:
    transform 0.2s,
    box-shadow 0.2s;
  display: flex;
  flex-direction: column;
}

.pet-card:hover {
  transform: translateY(-4px);
  box-shadow: var(--shadow-hover);
}

.card-cover {
  position: relative;
  width: 100%;
  height: 180px;
  overflow: hidden;
}

.card-cover img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.species-tag {
  position: absolute;
  top: 10px;
  left: 10px;
}

.status-tag {
  position: absolute;
  top: 10px;
  right: 10px;
}

.adopted-badge {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%) rotate(-12deg);
  background: rgba(0, 0, 0, 0.65);
  color: var(--color-white);
  font-size: 16px;
  font-weight: 700;
  padding: 6px 18px;
  border-radius: 6px;
  letter-spacing: 2px;
  pointer-events: none;
}

.pet-card.adopted .card-cover img {
  filter: grayscale(0.5);
}

.card-body {
  padding: 16px;
  flex: 1;
  display: flex;
  flex-direction: column;
}

.info-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 8px 12px;
  margin-bottom: 12px;
}

.info-item {
  display: flex;
  align-items: baseline;
  gap: 6px;
  font-size: 13px;
  line-height: 1.5;
}

.info-label {
  color: var(--color-text-secondary);
  flex-shrink: 0;
}

.info-value {
  color: var(--color-text-primary);
  font-weight: 500;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.card-health {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin-bottom: 14px;
  min-height: 24px;
}

.health-empty {
  font-size: 12px;
  color: var(--color-text-secondary);
}

.card-footer {
  padding-top: 12px;
  border-top: 1px solid var(--color-border);
  margin-top: auto;
  text-align: center;
}
</style>
