/**
 * 流浪动物模拟数据
 * 拾光萌约 · 待领养宠物
 */

export interface Pet {
  id: number
  name: string
  species: '猫' | '狗' | '兔' | '其他'
  breed: string
  age: string
  gender: '公' | '母'
  cover: string
  images: string[]
  location: string
  shelter: string
  vaccinated: boolean
  neutered: boolean
  description: string
  healthRecord: { day: string; title: string; desc: string }[]
  adoptionFee: number
  status: '待领养' | '审核中' | '已领养'
  tags: string[]
  suitable: string
}

export const pets: Pet[] = [
  {
    id: 1,
    name: '小白',
    species: '猫',
    breed: '中华田园猫',
    age: '1岁',
    gender: '母',
    cover:
      'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=cute%20white%20kitten%20cat%20portrait%20soft%20light%20warm&image_size=landscape_16_9',
    images: [],
    location: '成都市锦江区',
    shelter: '锦江区流浪动物救助站',
    vaccinated: true,
    neutered: true,
    description: '性格温顺亲人，喜欢被摸下巴，不怕人，适合新手铲屎官。',
    healthRecord: [
      { day: 'Day 1', title: '救助入院', desc: '在街边被发现，身体虚弱，体重仅2.1kg' },
      { day: 'Day 7', title: '体检驱虫', desc: '体内外驱虫完成，体重恢复至2.8kg' },
      { day: 'Day 14', title: '疫苗接种', desc: '猫三联第一针已打，状态良好' },
      { day: 'Day 30', title: '绝育手术', desc: '手术顺利，恢复中，预计下周可出院' },
    ],
    adoptionFee: 0,
    status: '待领养',
    tags: ['亲人', '粘人', '已绝育', '已疫苗'],
    suitable: '新手铲屎官、上班族',
  },
  {
    id: 2,
    name: '布丁',
    species: '狗',
    breed: '金毛寻回犬',
    age: '2岁',
    gender: '公',
    cover:
      'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=golden%20retriever%20dog%20happy%20park%20sunny&image_size=landscape_16_9',
    images: [],
    location: '成都市武侯区',
    shelter: '爱心流浪动物之家',
    vaccinated: true,
    neutered: true,
    description: '性格活泼开朗，是个大暖男！喜欢玩耍，需要每天遛狗。',
    healthRecord: [
      { day: 'Day 1', title: '救助入院', desc: '被遗弃在小区门口，有轻微皮肤病' },
      { day: 'Day 10', title: '治疗康复', desc: '皮肤病已痊愈，毛发恢复亮丽' },
      { day: 'Day 20', title: '体检疫苗', desc: '全部疫苗完成，已绝育' },
    ],
    adoptionFee: 0,
    status: '待领养',
    tags: ['活泼', '大型犬', '已绝育', '已疫苗'],
    suitable: '有院子家庭、爱运动人士',
  },
  {
    id: 3,
    name: '橘座',
    species: '猫',
    breed: '橘猫',
    age: '3岁',
    gender: '公',
    cover:
      'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=orange%20tabby%20cat%20sleeping%20cute%20fluffy&image_size=landscape_16_9',
    images: [],
    location: '成都市成华区',
    shelter: '成华区救助中心',
    vaccinated: true,
    neutered: true,
    description: '网红橘座！性格佛系不爱动，胃口好，适合喜欢安静的家庭。',
    healthRecord: [
      { day: 'Day 1', title: '救助入院', desc: '从天桥下救下，体重超标需减肥' },
      { day: 'Day 15', title: '体检疫苗', desc: '各项指标正常，已绝育驱虫' },
    ],
    adoptionFee: 0,
    status: '待领养',
    tags: ['佛系', '橘猫', '已绝育', '已疫苗'],
    suitable: '上班族、安静家庭',
  },
  {
    id: 4,
    name: '豆豆',
    species: '狗',
    breed: '中华田园犬',
    age: '1岁',
    gender: '母',
    cover:
      'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=cute%20mixed%20breed%20dog%20puppy%20brown%20white&image_size=landscape_16_9',
    images: [],
    location: '成都市青羊区',
    shelter: '青羊区流浪动物救助站',
    vaccinated: true,
    neutered: false,
    description: '忠诚护主，警惕性高，适合看家护院的家庭。',
    healthRecord: [
      { day: 'Day 1', title: '救助入院', desc: '流浪狗妈妈留下的一窝崽，最小的一只' },
      { day: 'Day 20', title: '疫苗接种', desc: '全部疫苗完成，等待领养' },
    ],
    adoptionFee: 0,
    status: '待领养',
    tags: ['忠诚', '小型犬', '已疫苗'],
    suitable: '有院子家庭、农村家庭',
  },
  {
    id: 5,
    name: '雪球',
    species: '兔',
    breed: '荷兰垂耳兔',
    age: '1岁',
    gender: '母',
    cover:
      'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=cute%20white%20rabbit%20fluffy%20ears%20soft&image_size=landscape_16_9',
    images: [],
    location: '成都市高新区',
    shelter: '爱心小动物之家',
    vaccinated: false,
    neutered: false,
    description: '超级软萌！耳朵垂垂的，喜欢吃胡萝卜，适合公寓饲养。',
    healthRecord: [
      { day: 'Day 1', title: '救助入院', desc: '被丢弃在公园草丛里' },
      { day: 'Day 5', title: '体检健康', desc: '各项指标正常，活泼可爱' },
    ],
    adoptionFee: 0,
    status: '待领养',
    tags: ['软萌', '小型', '公寓友好'],
    suitable: '公寓住户、学生、新手',
  },
  {
    id: 6,
    name: '煤球',
    species: '猫',
    breed: '孟买猫',
    age: '2岁',
    gender: '公',
    cover:
      'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=black%20cat%20Bombay%20golden%20eyes%20elegant&image_size=landscape_16_9',
    images: [],
    location: '成都市金牛区',
    shelter: '金牛区救助中心',
    vaccinated: true,
    neutered: true,
    description: '油光水滑的小黑炭！性格独立高冷，偶尔撒娇，适合有养猫经验的家庭。',
    healthRecord: [
      { day: 'Day 1', title: '救助入院', desc: '在小区垃圾桶旁被发现' },
      { day: 'Day 12', title: '体检康复', desc: '皮肤病已治愈，已绝育驱虫' },
    ],
    adoptionFee: 0,
    status: '待领养',
    tags: ['高冷', '独立', '已绝育', '已疫苗'],
    suitable: '有养猫经验、安静家庭',
  },
  {
    id: 7,
    name: '小米',
    species: '狗',
    breed: '比熊犬',
    age: '1岁',
    gender: '母',
    cover:
      'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=cute%20white%20bichon%20frise%20dog%20fluffy%20happy&image_size=landscape_16_9',
    images: [],
    location: '成都市武侯区',
    shelter: '爱心流浪动物之家',
    vaccinated: true,
    neutered: true,
    description: '棉花糖一样的小天使！性格活泼亲人，不掉毛，适合公寓饲养。',
    healthRecord: [
      { day: 'Day 1', title: '救助入院', desc: '被遗弃在宠物店门口，体重偏轻' },
      { day: 'Day 8', title: '体检疫苗', desc: '完成全部疫苗，已绝育驱虫' },
    ],
    adoptionFee: 0,
    status: '已领养',
    tags: ['亲人', '小型犬', '已绝育', '已疫苗'],
    suitable: '公寓住户、上班族、有小孩家庭',
  },
  {
    id: 8,
    name: '花花',
    species: '猫',
    breed: '三花猫',
    age: '2岁',
    gender: '母',
    cover:
      'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=calico%20cat%20three%20colors%20cute%20portrait&image_size=landscape_16_9',
    images: [],
    location: '成都市锦江区',
    shelter: '锦江区流浪动物救助站',
    vaccinated: true,
    neutered: true,
    description: '三花小淑女！性格安静温柔，喜欢晒太阳，和其他宠物相处融洽。',
    healthRecord: [
      { day: 'Day 1', title: '救助入院', desc: '在公园长椅下被发现，非常亲人' },
      { day: 'Day 10', title: '体检康复', desc: '完成疫苗绝育，等待新家庭' },
    ],
    adoptionFee: 0,
    status: '已领养',
    tags: ['温柔', '安静', '已绝育', '已疫苗'],
    suitable: '安静家庭、多宠物家庭',
  },
  {
    id: 9,
    name: '大黑',
    species: '狗',
    breed: '拉布拉多',
    age: '3岁',
    gender: '公',
    cover:
      'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=black%20labrador%20dog%20loyal%20friendly%20outdoor&image_size=landscape_16_9',
    images: [],
    location: '成都市郫都区',
    shelter: '郫都区救助站',
    vaccinated: true,
    neutered: true,
    description: '忠诚憨厚的大暖男！服从性好，适合有院子的家庭，能陪你跑步。',
    healthRecord: [
      { day: 'Day 1', title: '救助入院', desc: '流浪多日，毛发脏乱有皮肤病' },
      { day: 'Day 15', title: '治疗康复', desc: '皮肤病痊愈，完成全部疫苗和绝育' },
    ],
    adoptionFee: 0,
    status: '已领养',
    tags: ['忠诚', '大型犬', '已绝育', '已疫苗'],
    suitable: '有院子家庭、爱运动人士',
  },
]

/** 根据 id 获取宠物详情 */
export function getPetById(id: number): Pet | undefined {
  return pets.find((p) => p.id === id)
}

/** 物种列表 */
export const speciesList = ['全部', '猫', '狗', '兔', '其他']

/** 状态列表 */
export const statusList = ['全部', '待领养', '审核中', '已领养']
