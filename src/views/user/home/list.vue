<script setup lang="ts">
/**
 * 宠物列表页
 * 拾光萌约 · 待领养宠物
 */
import { ref, computed, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Search } from '@element-plus/icons-vue'
import { pets, speciesList, type Pet } from '@/mock/pets'
import { useAdoptionStore } from '@/stores/adoption'
import { useUserStore } from '@/stores/user'

const router = useRouter()
const adoptionStore = useAdoptionStore()
const userStore = useUserStore()

// ---------- 筛选状态 ----------
const keyword = ref('')
const species = ref('全部')
const freeOnly = ref(false)

// ---------- 筛选结果 ----------
const filtered = computed(() => {
  let list = pets.filter((p) => p.status !== '已领养')

  if (keyword.value.trim()) {
    const kw = keyword.value.trim().toLowerCase()
    list = list.filter(
      (p) =>
        p.name.toLowerCase().includes(kw) ||
        p.breed.toLowerCase().includes(kw) ||
        p.species.includes(kw),
    )
  }

  if (species.value !== '全部') {
    list = list.filter((p) => p.species === species.value)
  }

  if (freeOnly.value) {
    list = list.filter((p) => p.adoptionFee === 0)
  }

  return list
})

// ---------- 详情弹窗 ----------
const detailPet = ref<Pet | null>(null)
const detailVisible = ref(false)

function openDetail(pet: Pet) {
  detailPet.value = pet
  detailVisible.value = true
}

// ---------- 领养问卷弹窗 ----------
const signupPet = ref<Pet | null>(null)
const signupVisible = ref(false)

function openSignup(pet: Pet) {
  if (pet.status !== '待领养') {
    ElMessage.warning('该宠物暂时不可领养')
    return
  }
  signupPet.value = pet
  // 预填申请人信息
  signupForm.name = userStore.userInfo?.nickname || ''
  signupForm.phone = userStore.userInfo?.phone || ''
  signupForm.idCard = ''
  signupForm.address = ''
  signupForm.hasPetBefore = userStore.userInfo?.hobby?.includes('养') || false
  signupForm.houseType = '自有'
  signupForm.reason = ''
  signupVisible.value = true
}

const signupForm = reactive({
  name: '',
  phone: '',
  idCard: '',
  address: '',
  hasPetBefore: false,
  houseType: '自有' as '自有' | '租房',
  reason: '',
})

const submitting = ref(false)

const phoneValid = computed(() => /^1[3-9]\d{9}$/.test(signupForm.phone))
const idCardValid = computed(() => /^\d{17}[\dXx]$/.test(signupForm.idCard))

async function submitAdoption() {
  // 校验
  if (!signupForm.name.trim()) return ElMessage.warning('请填写申请人姓名')
  if (!phoneValid.value) return ElMessage.warning('请填写正确的手机号')
  if (!idCardValid.value) return ElMessage.warning('请填写正确的身份证号（18位）')
  if (!signupForm.address.trim()) return ElMessage.warning('请填写居住地址')
  if (!signupForm.reason.trim()) return ElMessage.warning('请填写领养理由')

  try {
    await ElMessageBox.confirm(
      `确认提交「${signupPet.value!.name}」的领养申请？提交后需等待救助站审核。`,
      '二次确认',
      { type: 'info', confirmButtonText: '确认提交', cancelButtonText: '再想想' },
    )
  } catch {
    return
  }

  submitting.value = true
  adoptionStore.submitAdoption({
    petId: signupPet.value!.id,
    petName: signupPet.value!.name,
    petCover: signupPet.value!.cover,
    applicantName: signupForm.name,
    applicantPhone: signupForm.phone,
    applicantIdCard: signupForm.idCard,
    address: signupForm.address,
    hasPetBefore: signupForm.hasPetBefore,
    houseType: signupForm.houseType,
    adoptionReason: signupForm.reason,
  })
  submitting.value = false
  signupVisible.value = false
  ElMessage.success('申请已提交！等待救助站审核~')
  router.push('/adoptions')
}
</script>

<template>
  <div class="list-page">
    <!-- 搜索 + 筛选 -->
    <div class="filter-bar">
      <el-input
        v-model="keyword"
        placeholder="搜索宠物名字 / 品种 / 物种"
        clearable
        class="search-input"
      >
        <template #prefix>
          <el-icon><Search /></el-icon>
        </template>
      </el-input>

      <el-select v-model="species" class="filter-select" placeholder="物种">
        <el-option v-for="s in speciesList" :key="s" :label="s" :value="s" />
      </el-select>

      <el-checkbox v-model="freeOnly" class="free-checkbox">免费领养</el-checkbox>

      <el-button type="primary" @click="() => {}">搜索</el-button>
    </div>

    <!-- 宠物卡片网格 -->
    <div v-if="filtered.length > 0" class="pet-grid">
      <div v-for="p in filtered" :key="p.id" class="pet-card">
        <div class="card-cover" @click="openDetail(p)">
          <img :src="p.cover" :alt="p.name" />
          <span class="species-badge">{{ p.species }}</span>
          <span v-if="p.adoptionFee === 0" class="free-badge">🆓 免费</span>
        </div>

        <div class="card-body">
          <h3 class="card-title" @click="openDetail(p)">
            {{ p.name }}
            <span class="gender">{{ p.gender === '公' ? '♂' : '♀' }}</span>
          </h3>

          <div class="card-meta">
            <span class="meta-item">🐾 {{ p.breed }}</span>
            <span class="meta-item">📅 {{ p.age }}</span>
          </div>

          <div class="card-tags">
            <el-tag
              v-for="t in p.tags"
              :key="t"
              size="small"
              effect="plain"
              type="warning"
              class="tag"
            >
              {{ t }}
            </el-tag>
          </div>

          <p class="card-suitable">{{ p.suitable }}</p>

          <div class="card-footer">
            <div class="card-shelter">📍 {{ p.shelter }}</div>
            <div class="card-actions">
              <el-button size="small" plain @click="openDetail(p)">详情</el-button>
              <el-button size="small" type="primary" @click="openSignup(p)"> 申请领养 </el-button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 空状态 -->
    <div v-else class="empty-state">
      <div class="empty-icon">🐾</div>
      <div class="empty-text">暂无可领养的毛孩子</div>
      <div class="empty-hint">试试换个筛选条件</div>
    </div>

    <!-- ========== 详情弹窗 ========== -->
    <el-dialog
      v-model="detailVisible"
      :width="920"
      :title="detailPet?.name"
      destroy-on-close
      class="detail-dialog"
    >
      <template v-if="detailPet">
        <div class="detail-hero">
          <img :src="detailPet.cover" :alt="detailPet.name" />
          <div class="hero-info">
            <div class="hero-title">
              {{ detailPet.name }}
              <span class="hero-gender">{{ detailPet.gender === '公' ? '♂ 公' : '♀ 母' }}</span>
              <span class="hero-species">{{ detailPet.species }}</span>
            </div>
            <div class="hero-meta">
              🐾 {{ detailPet.breed }} · 📅 {{ detailPet.age }} · 📍 {{ detailPet.location }}
            </div>
            <div class="hero-tags">
              <el-tag v-if="detailPet.vaccinated" size="small" type="success" effect="dark">
                💉 已疫苗
              </el-tag>
              <el-tag v-if="detailPet.neutered" size="small" type="success" effect="dark">
                ✂️ 已绝育
              </el-tag>
              <el-tag size="small" type="warning" effect="dark">
                🏠 {{ detailPet.shelter }}
              </el-tag>
            </div>
          </div>
        </div>

        <div class="detail-section">
          <h4 class="section-title">🐾 性格描述</h4>
          <p class="section-text">{{ detailPet.description }}</p>
          <p class="section-text suitable">适合：{{ detailPet.suitable }}</p>
        </div>

        <div class="detail-section">
          <h4 class="section-title">📅 救助时间线</h4>
          <div class="health-grid">
            <div v-for="(h, idx) in detailPet.healthRecord" :key="idx" class="health-card">
              <div class="health-day">{{ h.day }}</div>
              <div class="health-title">{{ h.title }}</div>
              <div class="health-desc">{{ h.desc }}</div>
            </div>
          </div>
        </div>
      </template>

      <template #footer>
        <el-button @click="detailVisible = false">关闭</el-button>
        <el-button
          type="primary"
          :disabled="detailPet?.status !== '待领养'"
          @click="
            () => {
              detailVisible = false
              openSignup(detailPet!)
            }
          "
        >
          申请领养 ❤️
        </el-button>
      </template>
    </el-dialog>

    <!-- ========== 领养问卷弹窗 ========== -->
    <el-dialog
      v-model="signupVisible"
      width="520px"
      :title="signupPet ? `申请领养：${signupPet.name}` : '领养申请'"
      destroy-on-close
      class="signup-dialog"
    >
      <div class="signup-tip">
        <strong>🐾 领养前请确认：</strong>您承诺认真对待这个生命，不离不弃。 提交申请后救助站将在
        1-3 个工作日内审核。
      </div>

      <el-form label-width="90px" label-position="right">
        <el-form-item label="申请人">
          <el-input v-model="signupForm.name" placeholder="真实姓名" />
        </el-form-item>
        <el-form-item label="手机号">
          <el-input v-model="signupForm.phone" placeholder="11位手机号" />
        </el-form-item>
        <el-form-item label="身份证">
          <el-input v-model="signupForm.idCard" placeholder="18位身份证号" />
        </el-form-item>
        <el-form-item label="居住地址">
          <el-input
            v-model="signupForm.address"
            type="textarea"
            :rows="2"
            placeholder="详细地址，方便救助站联系上门"
          />
        </el-form-item>
        <el-form-item label="住房类型">
          <el-radio-group v-model="signupForm.houseType">
            <el-radio value="自有">自有住房</el-radio>
            <el-radio value="租房">租房（需房东同意）</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="养宠经验">
          <el-switch
            v-model="signupForm.hasPetBefore"
            active-text="有养宠经验"
            inactive-text="无经验"
          />
        </el-form-item>
        <el-form-item label="领养理由">
          <el-input
            v-model="signupForm.reason"
            type="textarea"
            :rows="3"
            placeholder="为什么想领养这只毛孩子？您的家庭环境如何？"
          />
        </el-form-item>
      </el-form>

      <template #footer>
        <el-button @click="signupVisible = false">取消</el-button>
        <el-button type="primary" :loading="submitting" @click="submitAdoption">
          提交申请 ❤️
        </el-button>
      </template>
    </el-dialog>
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

.free-checkbox {
  flex-shrink: 0;
}

/* ===== 卡片网格 ===== */
.pet-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 20px;
}

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
  cursor: pointer;
}

.card-cover img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.species-badge {
  position: absolute;
  top: 10px;
  left: 10px;
  background: var(--color-primary);
  color: var(--color-white);
  font-size: 12px;
  padding: 3px 10px;
  border-radius: 12px;
}

.free-badge {
  position: absolute;
  top: 10px;
  right: 10px;
  background: var(--color-accent);
  color: var(--color-white);
  font-size: 12px;
  padding: 3px 10px;
  border-radius: 12px;
}

.card-body {
  padding: 16px;
  flex: 1;
  display: flex;
  flex-direction: column;
}

.card-title {
  font-size: 18px;
  font-weight: 700;
  color: var(--color-text-primary);
  margin: 0 0 8px;
  cursor: pointer;
  line-height: 1.4;
  transition: color 0.2s;
  display: flex;
  align-items: center;
  gap: 8px;
}

.card-title:hover {
  color: var(--color-primary);
}

.card-title .gender {
  font-size: 18px;
  color: var(--color-accent);
  font-weight: 400;
}

.card-meta {
  display: flex;
  gap: 14px;
  margin-bottom: 10px;
}

.meta-item {
  font-size: 13px;
  color: var(--color-text-secondary);
}

.card-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin-bottom: 10px;
}

.card-suitable {
  font-size: 12px;
  color: var(--color-text-secondary);
  margin: 0 0 14px;
  flex: 1;
}

.card-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-top: 12px;
  border-top: 1px solid var(--color-border);
}

.card-shelter {
  font-size: 12px;
  color: var(--color-text-secondary);
  max-width: 140px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
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
}

/* ===== 详情弹窗 ===== */
.detail-hero {
  display: flex;
  gap: 20px;
  margin-bottom: 20px;
}

.detail-hero img {
  width: 280px;
  height: 200px;
  border-radius: 12px;
  object-fit: cover;
}

.hero-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.hero-title {
  font-size: 24px;
  font-weight: 700;
  color: var(--color-text-primary);
}

.hero-gender {
  font-size: 18px;
  color: var(--color-accent);
  margin-left: 8px;
}

.hero-species {
  font-size: 13px;
  color: var(--color-text-secondary);
  background: var(--color-secondary);
  padding: 2px 10px;
  border-radius: 10px;
  margin-left: 8px;
}

.hero-meta {
  font-size: 14px;
  color: var(--color-text-secondary);
}

.hero-tags {
  display: flex;
  gap: 6px;
  flex-wrap: wrap;
}

.detail-section {
  margin-bottom: 20px;
}

.section-title {
  font-size: 15px;
  font-weight: 600;
  color: var(--color-text-primary);
  margin: 0 0 10px;
}

.section-text {
  font-size: 14px;
  color: var(--color-text-regular);
  line-height: 1.8;
  margin: 0 0 6px;
}

.section-text.suitable {
  color: var(--color-primary);
  font-weight: 500;
}

/* 健康记录横向卡片 */
.health-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: 12px;
}

.health-card {
  background: var(--color-secondary);
  border-radius: 10px;
  padding: 14px;
  text-align: center;
}

.health-day {
  font-size: 12px;
  color: var(--color-primary);
  font-weight: 600;
  margin-bottom: 6px;
}

.health-title {
  font-size: 14px;
  font-weight: 600;
  color: var(--color-text-primary);
  margin-bottom: 6px;
}

.health-desc {
  font-size: 12px;
  color: var(--color-text-secondary);
  line-height: 1.5;
}

/* ===== 领养问卷弹窗 ===== */
.signup-tip {
  background: var(--color-secondary);
  border-radius: 8px;
  padding: 12px 16px;
  font-size: 13px;
  color: var(--color-text-regular);
  margin-bottom: 16px;
  line-height: 1.6;
}
</style>
