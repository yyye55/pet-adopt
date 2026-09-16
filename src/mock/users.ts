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
  },
]
