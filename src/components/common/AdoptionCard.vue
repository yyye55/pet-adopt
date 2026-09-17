<script setup lang="ts">
/**
 * 领养申请卡片组件
 * 用于用户端 /home/adoptions 列表（一排两个）
 */
import type { Adoption, AdoptionStatus } from '@/stores/adoption'

const props = defineProps<{
  adoption: Adoption
}>()

const emit = defineEmits<{
  (e: 'cancel', id: number): void
  (e: 'reapply'): void
}>()

/** 状态 tag 配置（内聚到组件内部） */
const STATUS_MAP: Record<AdoptionStatus, { type: 'warning' | 'success' | 'danger'; text: string }> =
  {
    待审核: { type: 'warning', text: '待审核' },
    已通过: { type: 'success', text: '已通过' },
    已驳回: { type: 'danger', text: '已驳回' },
  }

const currentStatus = () => STATUS_MAP[props.adoption.status]
</script>

<template>
  <div class="adoption-card" :class="adoption.status">
    <!-- 区块 1：宠物头部（头像 + 宠物名 + 年龄 + 状态 tag） -->
    <div class="card-header">
      <div class="pet-info">
        <img :src="adoption.petCover" :alt="adoption.petName" class="pet-avatar" />
        <div class="pet-text">
          <span class="pet-name">{{ adoption.petName }}</span>
          <span class="pet-age">年龄：{{ adoption.petAge }}</span>
        </div>
      </div>
      <el-tag :type="currentStatus().type" effect="dark" size="small">
        {{ currentStatus().text }}
      </el-tag>
    </div>

    <!-- 区块 2：申请信息（Grid 两列对齐） -->
    <div class="info-grid">
      <div class="info-row">
        <span class="label">领养人</span>
        <span class="value">{{ adoption.applicantName }}</span>
      </div>
      <div class="info-row">
        <span class="label">电话</span>
        <span class="value">{{ adoption.applicantPhone }}</span>
      </div>
      <div class="info-row">
        <span class="label">年龄</span>
        <span class="value">{{ adoption.applicantAge ?? '-' }}</span>
      </div>
      <div class="info-row">
        <span class="label">身份证</span>
        <span class="value">{{ adoption.applicantIdCard }}</span>
      </div>
      <div class="info-row">
        <span class="label">住房</span>
        <span class="value">{{ adoption.houseType }}</span>
      </div>
      <div class="info-row">
        <span class="label">养宠经验</span>
        <span class="value">{{ adoption.hasPetBefore ? '有' : '无' }}</span>
      </div>
      <div class="info-row">
        <span class="label">接受家访</span>
        <span class="value">{{ adoption.acceptVisit }}</span>
      </div>
      <div class="info-row full-width">
        <span class="label">地址</span>
        <span class="value">{{ adoption.address }}</span>
      </div>
    </div>

    <!-- 区块 3：领养理由（浅灰背景） -->
    <div class="reason-box">
      <span class="reason-label">领养理由：</span>
      <span class="reason-text">{{ adoption.adoptionReason }}</span>
    </div>

    <!-- 区块 4：拒绝原因（仅已驳回时显示） -->
    <div v-if="adoption.rejectReason" class="reject-bar">
      <span class="reject-text">{{ adoption.rejectReason }}</span>
    </div>

    <!-- 区块 5：底部（时间 + 操作按钮） -->
    <div class="card-footer">
      <div class="apply-time">申请时间：{{ adoption.createdAt }}</div>
      <div class="actions">
        <el-button
          v-if="adoption.status === '待审核'"
          size="small"
          type="danger"
          plain
          @click="emit('cancel', adoption.id)"
          >撤销申请</el-button
        >
        <el-button v-else-if="adoption.status === '已驳回'" size="small" @click="emit('reapply')"
          >重新申请</el-button
        >
      </div>
    </div>
  </div>
</template>

<style scoped>
/* ===== 卡片容器 ===== */
.adoption-card {
  background: var(--color-white);
  border-radius: var(--radius-card);
  box-shadow: var(--shadow-sm);
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 16px;
  transition:
    transform 0.2s,
    box-shadow 0.2s;
}

.adoption-card:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-card);
}

/* ===== 区块 1：宠物头部 ===== */
.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 10px;
}

.pet-info {
  display: flex;
  align-items: center;
  gap: 10px;
  min-width: 0;
}

.pet-avatar {
  width: 60px;
  height: 60px;
  border-radius: 10px;
  object-fit: cover;
  flex-shrink: 0;
  background: var(--color-secondary);
}

.pet-text {
  display: flex;
  flex-direction: column;
  gap: 2px;
  min-width: 0;
}

.pet-name {
  font-size: 17px;
  font-weight: 600;
  color: var(--color-text-primary);
  line-height: 1.3;
}

.pet-age {
  font-size: 12px;
  color: var(--color-text-secondary);
}

/* ===== 区块 2：信息 Grid ===== */
.info-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 8px 16px;
}

.info-row {
  display: flex;
  align-items: baseline;
  gap: 6px;
  font-size: 13px;
  line-height: 1.6;
  min-width: 0;
}

.info-row.full-width {
  grid-column: 1 / -1;
}

.label {
  color: var(--color-text-secondary);
  flex-shrink: 0;
  font-size: 12px;
}

.value {
  color: var(--color-text-regular);
  font-weight: 500;
  word-break: break-all;
  overflow: hidden;
  text-overflow: ellipsis;
}

/* ===== 区块 3：领养理由 ===== */
.reason-box {
  background: var(--color-secondary);
  border-radius: 10px;
  padding: 10px;
  font-size: 12px;
  line-height: 1.7;
  color: var(--color-text-regular);
}

.reason-label {
  color: var(--color-text-secondary);
  font-size: 12px;
  margin-right: 6px;
}

/* ===== 区块 4：拒绝原因 ===== */
.reject-bar {
  display: flex;
  align-items: flex-start;
  gap: 8px;
  background: rgba(245, 108, 108, 0.08);
  border-left: 3px solid var(--color-danger);
  padding: 10px 14px;
  border-radius: 6px;
  font-size: 12px;
  line-height: 1.6;
}

.reject-text {
  color: var(--color-danger);
  font-weight: 500;
  word-break: break-all;
}

/* ===== 区块 5：底部 ===== */
.card-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 10px;
  padding-top: 12px;
  border-top: 1px solid var(--color-border);
  margin-top: auto;
}

.apply-time {
  font-size: 12px;
  color: var(--color-text-secondary);
  flex-shrink: 0;
}

.actions {
  flex-shrink: 0;
}
</style>
