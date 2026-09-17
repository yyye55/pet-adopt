<script setup lang="ts">
/**
 * 宠物详情 + 领养申请弹窗（合并）
 * 左半区：详情展示（只读）
 * 右半区：领养表单（可编辑）
 */
import { reactive, ref, watch } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import type { Pet } from '@/mock/pets'

const props = defineProps<{
  pet: Pet | null
  visible: boolean
}>()

const emit = defineEmits<{
  (e: 'update:visible', val: boolean): void
  (
    e: 'submit',
    data: {
      petId: number
      petName: string
      petCover: string
      applicantName: string
      applicantPhone: string
      applicantAge: number
      applicantIdCard: string
      address: string
      houseType: '自有' | '租房'
      hasPetBefore: boolean
      adoptionReason: string
    },
  ): void
}>()

const form = reactive({
  name: '',
  phone: '',
  age: null as number | null,
  idCard: '',
  address: '',
  houseType: '自有' as '自有' | '租房',
  hasPetBefore: false,
  acceptVisit: '是' as '是' | '否',
  reason: '',
  agreed: false,
})

const submitting = ref(false)

// 弹窗打开时重置
watch(
  () => props.visible,
  (val) => {
    if (val) {
      form.name = ''
      form.phone = ''
      form.age = null
      form.idCard = ''
      form.address = ''
      form.houseType = '自有'
      form.hasPetBefore = false
      form.acceptVisit = '是'
      form.reason = ''
      form.agreed = false
    }
  },
)

function close() {
  emit('update:visible', false)
}

const phoneValid = () => /^1[3-9]\d{9}$/.test(form.phone)
const idCardValid = () => /^\d{17}[\dXx]$/.test(form.idCard)

async function handleSubmit() {
  if (!form.name.trim()) return ElMessage.warning('请填写申请人姓名')
  if (!phoneValid()) return ElMessage.warning('请填写正确的手机号')
  if (!form.age || form.age < 18) return ElMessage.warning('请填写正确的年龄（需年满18）')
  if (!idCardValid()) return ElMessage.warning('请填写正确的身份证号（18位）')
  if (!form.address.trim()) return ElMessage.warning('请填写居住地址')
  if (!form.reason.trim()) return ElMessage.warning('请填写领养理由')

  if (!props.pet) return
  if (props.pet.status === '已领养') {
    ElMessage.warning('该宠物已被领养，无法提交申请')
    return
  }
  if (!form.agreed) return ElMessage.warning('请先勾选领养承诺')

  try {
    await ElMessageBox.confirm(
      `确认提交「${props.pet.name}」的领养申请？提交后需等待救助站审核。`,
      '二次确认',
      { type: 'info', confirmButtonText: '确认提交', cancelButtonText: '再想想' },
    )
  } catch {
    return
  }

  submitting.value = true
  emit('submit', {
    petId: props.pet.id,
    petName: props.pet.name,
    petAge: props.pet.age,
    petCover: props.pet.cover,
    applicantName: form.name,
    applicantPhone: form.phone,
    applicantAge: form.age,
    applicantIdCard: form.idCard,
    address: form.address,
    houseType: form.houseType,
    hasPetBefore: form.hasPetBefore,
    acceptVisit: form.acceptVisit,
    adoptionReason: form.reason,
  })
  submitting.value = false
  close()
}
</script>

<template>
  <el-dialog
    :model-value="visible"
    @update:model-value="emit('update:visible', $event)"
    :width="1080"
    destroy-on-close
    class="adopt-dialog"
  >
    <div v-if="pet" class="dialog-wrapper">
      <!-- 主体：左右分栏 -->
      <div class="dialog-body">
        <!-- 左：详情展示 -->
        <div class="detail-side">
          <!-- 图片 -->
          <div class="detail-hero">
            <img :src="pet.cover" :alt="pet.name" />
          </div>

          <!-- 元信息（el-descriptions） -->
          <el-descriptions :column="3" size="medium" bordered class="detail-desc">
            <el-descriptions-item label="种类">{{ pet.species }}</el-descriptions-item>
            <el-descriptions-item label="姓名">{{ pet.name }}</el-descriptions-item>
            <el-descriptions-item label="年龄">{{ pet.age }}</el-descriptions-item>
            <el-descriptions-item label="品种">{{ pet.breed }}</el-descriptions-item>
            <el-descriptions-item label="性别">{{ pet.gender }}</el-descriptions-item>
            <el-descriptions-item label="地点">{{ pet.location }}</el-descriptions-item>
          </el-descriptions>

          <!-- 状态标签 -->
          <div class="detail-tags">
            <el-tag v-if="pet.vaccinated" size="small" type="success" effect="light">
              已疫苗
            </el-tag>
            <el-tag v-if="pet.neutered" size="small" type="success" effect="light"> 已绝育 </el-tag>
          </div>

          <!-- 性格描述 -->
          <div class="detail-section">
            <h4 class="section-title">性格描述</h4>
            <p class="section-text">{{ pet.description }}</p>
          </div>

          <!-- 适合领养 -->
          <div class="detail-section">
            <h4 class="section-title">适合领养的人</h4>
            <p class="section-text suitable">{{ pet.suitable }}</p>
          </div>

          <!-- 救助时间线（一行展示，日期在上标题在下） -->
          <div class="detail-section">
            <h4 class="section-title">救助时间线</h4>
            <div class="timeline-row">
              <template v-for="(h, idx) in pet.healthRecord" :key="idx">
                <span class="timeline-item">
                  <span class="timeline-day">{{ h.day }}</span>
                  <span class="timeline-title">{{ h.title }}</span>
                </span>
                <span v-if="idx < pet.healthRecord.length - 1" class="timeline-sep"></span>
              </template>
            </div>
          </div>
        </div>

        <!-- 分隔线 -->
        <div class="dialog-divider"></div>

        <!-- 右：领养表单 -->
        <div class="form-side">
          <h4 class="form-title">领养申请</h4>

          <el-alert
            v-if="pet?.status === '已领养'"
            type="warning"
            :closable="false"
            show-icon
            title="该宠物已被领养，可以去看看其他未被领养的宠物~"
            class="adopted-alert"
          />

          <el-checkbox v-model="form.agreed" class="agree-check">
            <span class="agree-text">
              我承诺认真对待这个生命，不离不弃。提交申请后救助站将在 1-3 个工作日内审核。
            </span>
          </el-checkbox>

          <el-form label-width="100px" label-position="right">
            <el-form-item label="申请人姓名">
              <el-input v-model="form.name" placeholder="真实姓名" />
            </el-form-item>
            <el-form-item label="手机号">
              <el-input v-model="form.phone" placeholder="11位手机号" />
            </el-form-item>
            <el-form-item label="申请人年龄">
              <el-input
                v-model.number="form.age"
                type="number"
                placeholder="年满18岁"
                class="age-input"
              />
            </el-form-item>
            <el-form-item label="身份证号">
              <el-input v-model="form.idCard" placeholder="18位身份证号" />
            </el-form-item>
            <el-form-item label="居住地址">
              <el-input
                v-model="form.address"
                type="textarea"
                :rows="2"
                placeholder="详细地址，方便救助站联系上门"
              />
            </el-form-item>
            <el-form-item label="住房类型">
              <el-radio-group v-model="form.houseType">
                <el-radio value="自有">自有住房</el-radio>
                <el-radio value="租房">租房（需房东同意）</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item label="养宠经验">
              <el-switch
                v-model="form.hasPetBefore"
                active-text="有养宠经验"
                inactive-text="无经验"
              />
            </el-form-item>
            <el-form-item label="接受家访">
              <el-radio-group v-model="form.acceptVisit">
                <el-radio value="是">接受</el-radio>
                <el-radio value="否">不接受</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item label="领养理由">
              <el-input
                v-model="form.reason"
                type="textarea"
                :rows="4"
                placeholder="为什么想领养这只宠物？您的家庭环境如何？"
              />
            </el-form-item>
          </el-form>
        </div>
      </div>
    </div>

    <template #footer>
      <el-button @click="close">取消</el-button>
      <el-button
        type="primary"
        :loading="submitting"
        :disabled="pet?.status === '已领养' || !form.agreed"
        @click="handleSubmit"
      >
        提交申请
      </el-button>
    </template>
  </el-dialog>
</template>

<style scoped>
/* ===== 弹窗固定屏幕中间，不滚动 ===== */
.adopt-dialog :deep(.el-dialog__wrapper) {
  overflow: hidden;
}

.adopt-dialog :deep(.el-dialog__header) {
  display: none;
}

.adopt-dialog :deep(.el-dialog) {
  display: flex;
  flex-direction: column;
  height: 80vh;
  top: 10vh;
  margin: 0 auto;
  --el-dialog-margin-top: 0;
}

.adopt-dialog :deep(.el-dialog__body) {
  flex: 1;
  overflow: hidden;
  padding-top: 10px;
  padding-bottom: 10px;
  display: flex;
  flex-direction: column;
}

.adopt-dialog :deep(.el-dialog__footer) {
  padding: 12px 20px;
  border-top: 1px solid var(--color-border);
}

/* ===== 主体 ===== */
.dialog-body {
  display: flex;
  gap: 24px;
  flex: 1;
  overflow: hidden;
}

/* ===== 左：详情 ===== */
.detail-side {
  flex: 0.9;
  overflow-y: auto;
  padding-right: 8px;
}

.detail-hero img {
  width: 100%;
  height: 220px;
  border-radius: 12px;
  object-fit: cover;
  margin-bottom: 14px;
}

.detail-desc {
  margin-bottom: 14px;
}

.detail-tags {
  display: flex;
  gap: 6px;
  flex-wrap: wrap;
  margin-bottom: 16px;
}

.detail-section {
  margin-bottom: 16px;
}

.section-title {
  font-size: 14px;
  font-weight: 600;
  color: var(--color-text-primary);
  margin: 0 0 8px;
}

.section-text {
  font-size: 14px;
  color: var(--color-text-regular);
  line-height: 1.7;
  margin: 0;
}

.section-text.suitable {
  color: var(--color-primary);
  font-weight: 500;
}

/* 救助时间线：一行展示 */
.timeline-row {
  display: flex;
  flex-wrap: wrap;
  align-items: flex-start;
  font-size: 13px;
}

.timeline-item {
  display: inline-flex;
  flex-direction: column;
  align-items: center;
  gap: 2px;
  min-width: 72px;
}

.timeline-day {
  color: var(--color-primary);
  font-weight: 600;
  font-size: 13px;
}

.timeline-title {
  color: var(--color-text-regular);
  font-size: 13px;
}

.timeline-sep {
  width: 24px;
  height: 1px;
  background: var(--color-border);
  margin-top: 6px;
  flex-shrink: 0;
}

/* ===== 分隔线 ===== */
.dialog-divider {
  width: 1px;
  background: var(--color-border);
  flex-shrink: 0;
}

/* ===== 右：表单 ===== */
.form-side {
  width: 490px;
  flex-shrink: 0;
  overflow-y: auto;
}

.adopted-alert {
  margin-bottom: 5px;
}

.form-title {
  font-size: 16px;
  font-weight: 700;
  color: var(--color-text-primary);
  margin: 0 0 12px;
}

.agree-check {
  display: flex;
  align-items: flex-start;
  background: var(--color-secondary);
  border-radius: 8px;
  padding: 12px 14px;
  margin-bottom: 16px;
  line-height: 1.6;
}

.agree-text {
  font-size: 12px;
  color: var(--color-text-regular);
}

.form-side :deep(.el-form-item) {
  margin-bottom: 10px;
}

.age-input {
  width: 100%;
}
</style>
