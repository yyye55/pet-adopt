/**
 * 旅游线路模拟数据
 * 定义线路类型 + mock 数据，供列表页、详情页、收藏等功能使用
 */

// ---------- 类型定义 ----------

/** 行程每日安排 */
export interface DayPlan {
  day: number
  title: string
  desc: string
}

/** 旅游线路 */
export interface Route {
  id: number
  name: string
  cover: string
  destination: string
  province: string // 省份：四川/山东/陕西/云南/重庆
  days: number // 出行天数
  price: number // 价格（元）
  type: '特种兵极速游' | '周末周边游' | '纯玩精品游'
  tags: string[] // 标签：特种兵｜短途｜纯玩｜学生特惠
  suitable: string // 适宜人群
  images: string[] // 详情页轮播图
  itinerary: DayPlan[] // 行程时间线
  feeInclude: string[] // 费用包含
  feeExclude: string[] // 费用不含
  notice: string // 出行须知
  hot: boolean // 是否热门
}

// ---------- 模拟数据 ----------

export const routes: Route[] = [
  {
    id: 1,
    name: '成都3天2晚特种兵极速游',
    cover: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=Chengdu%20panda%20base%20and%20ancient%20street%20landscape%20travel%20photo&image_size=landscape_16_9',
    destination: '成都',
    province: '四川',
    days: 3,
    price: 699,
    type: '特种兵极速游',
    tags: ['特种兵', '短途', '学生特惠'],
    suitable: '大学生、年轻群体',
    images: [
      'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=Chengdu%20panda%20landscape&image_size=landscape_16_9',
      'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=Chengdu%20Kuanzhai%20Alley%20night%20view&image_size=landscape_16_9',
    ],
    itinerary: [
      { day: 1, title: '抵达成都·宽窄巷子', desc: '下午抵达，逛宽窄巷子，品尝成都小吃' },
      { day: 2, title: '熊猫基地·春熙路', desc: '上午看大熊猫，下午春熙路太古里逛街' },
      { day: 3, title: '锦里·返程', desc: '上午锦里古街，下午返程' },
    ],
    feeInclude: ['住宿2晚', '当地交通', '导游服务'],
    feeExclude: ['往返大交通', '餐饮自理', '景点门票'],
    notice: '请携带身份证，提前15分钟集合',
    hot: true,
  },
  {
    id: 2,
    name: '青岛海滨2日周末游',
    cover: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=Qingdao%20seaside%20beach%20red%20roof%20houses%20travel%20photo&image_size=landscape_16_9',
    destination: '青岛',
    province: '山东',
    days: 2,
    price: 499,
    type: '周末周边游',
    tags: ['短途', '纯玩', '学生特惠'],
    suitable: '情侣、学生',
    images: [
      'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=Qingdao%20beach%20sunset&image_size=landscape_16_9',
    ],
    itinerary: [
      { day: 1, title: '栈桥·八大关', desc: '上午栈桥，下午八大关风景区' },
      { day: 2, title: '崂山·返程', desc: '上午登崂山，下午返程' },
    ],
    feeInclude: ['住宿1晚', '当地交通'],
    feeExclude: ['往返大交通', '餐饮', '门票'],
    notice: '海边风大，请带外套',
    hot: true,
  },
  {
    id: 3,
    name: '西安3天2晚历史文化游',
    cover: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=Xian%20Terracotta%20Warriors%20ancient%20city%20wall%20travel%20photo&image_size=landscape_16_9',
    destination: '西安',
    province: '陕西',
    days: 3,
    price: 899,
    type: '纯玩精品游',
    tags: ['纯玩', '历史'],
    suitable: '历史爱好者',
    images: [
      'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=Xian%20city%20wall%20night&image_size=landscape_16_9',
    ],
    itinerary: [
      { day: 1, title: '兵马俑·华清宫', desc: '全天游览兵马俑与华清宫' },
      { day: 2, title: '城墙·大雁塔', desc: '上午登城墙，下午大雁塔' },
      { day: 3, title: '回民街·返程', desc: '上午回民街品美食，下午返程' },
    ],
    feeInclude: ['住宿2晚', '导游', '景点门票'],
    feeExclude: ['往返大交通', '餐饮'],
    notice: '景区步行较多，请穿舒适鞋子',
    hot: false,
  },
  {
    id: 4,
    name: '重庆3天2晚山城特种兵',
    cover: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=Chongqing%20Hongyadong%20night%20view%20mountain%20city%20travel%20photo&image_size=landscape_16_9',
    destination: '重庆',
    province: '重庆',
    days: 3,
    price: 799,
    type: '特种兵极速游',
    tags: ['特种兵', '短途', '夜景'],
    suitable: '年轻群体',
    images: [
      'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=Chongqing%20Hongyadong%20night&image_size=landscape_16_9',
    ],
    itinerary: [
      { day: 1, title: '洪崖洞·解放碑', desc: '晚上洪崖洞看夜景' },
      { day: 2, title: '磁器口·长江索道', desc: '全天磁器口+长江索道' },
      { day: 3, title: '李子坝·返程', desc: '上午李子坝轻轨穿楼，下午返程' },
    ],
    feeInclude: ['住宿2晚', '当地交通'],
    feeExclude: ['往返大交通', '餐饮', '门票'],
    notice: '重庆多爬坡，建议穿运动鞋',
    hot: true,
  },
  {
    id: 5,
    name: '大理4天3晚风花雪月游',
    cover: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=Dali%20Erhai%20lake%20Cangshan%20mountain%20travel%20photo&image_size=landscape_16_9',
    destination: '大理',
    province: '云南',
    days: 4,
    price: 1299,
    type: '纯玩精品游',
    tags: ['纯玩', '文艺'],
    suitable: '情侣、文艺青年',
    images: [
      'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=Dali%20Erhai%20sunset&image_size=landscape_16_9',
    ],
    itinerary: [
      { day: 1, title: '抵达大理古城', desc: '下午逛大理古城' },
      { day: 2, title: '洱海环海', desc: '全天环洱海骑行/旅拍' },
      { day: 3, title: '苍山·喜洲', desc: '上午登苍山，下午喜洲古镇' },
      { day: 4, title: '返程', desc: '上午自由活动，下午返程' },
    ],
    feeInclude: ['住宿3晚', '当地交通', '旅拍'],
    feeExclude: ['往返大交通', '餐饮'],
    notice: '高原紫外线强，请做好防晒',
    hot: false,
  },
  {
    id: 6,
    name: '成都周边2日短途游',
    cover: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=Sichuan%20countryside%20bamboo%20forest%20travel%20photo&image_size=landscape_16_9',
    destination: '成都周边',
    province: '四川',
    days: 2,
    price: 399,
    type: '周末周边游',
    tags: ['短途', '学生特惠', '周边'],
    suitable: '学生、周末游',
    images: [],
    itinerary: [
      { day: 1, title: '青城山', desc: '全天游青城山' },
      { day: 2, title: '都江堰·返程', desc: '上午都江堰，下午返程' },
    ],
    feeInclude: ['住宿1晚', '门票'],
    feeExclude: ['往返大交通', '餐饮'],
    notice: '山区多雨，请带雨具',
    hot: false,
  },
]

/** 根据 id 获取线路详情 */
export function getRouteById(id: number): Route | undefined {
  return routes.find((r) => r.id === id)
}

/** 获取热门线路 */
export function getHotRoutes(): Route[] {
  return routes.filter((r) => r.hot)
}

/** 全部省份（用于筛选） */
export const provinces = ['全部', '四川', '山东', '陕西', '云南', '重庆']

/** 全部旅行类型（用于筛选） */
export const routeTypes = ['全部', '特种兵极速游', '周末周边游', '纯玩精品游']
