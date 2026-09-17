/**
 * 假账号数据 —— 登录用
 * 所有 mock 账号集中放这里，方便统一管理
 */

export interface MockUser {
  account: string
  password: string
  id: number
  nickname: string
  phone: string
  email: string
  hobby: string
  avatar: string
  role: 'user' | 'admin'
  gender: '男' | '女' | ''
  birthday: string
  city: string
  bio: string
  registerAt: string
}

export const mockUsers: MockUser[] = [
  {
    account: 'admin',
    password: '123456',
    id: 1,
    nickname: '救助站管理员',
    phone: '13800000000',
    email: 'admin@maohaizi.com',
    hobby: '公益救助',
    avatar: '',
    role: 'admin',
    gender: '女',
    birthday: '1992-03-15',
    city: '成都',
    bio: '救助站管理员，致力于给流浪动物一个温暖的家。',
    registerAt: '2025-12-01 10:00:00',
  },
  {
    account: 'user',
    password: '123456',
    id: 2,
    nickname: '爱心领养人',
    phone: '13812345678',
    email: 'user@maohaizi.com',
    hobby: '喜欢猫狗、养宠经验丰富',
    avatar: '',
    role: 'user',
    gender: '男',
    birthday: '1996-05-20',
    city: '成都',
    bio: '热爱小动物，希望领养一只猫咪陪伴生活。',
    registerAt: '2026-01-15 14:30:00',
  },
]
