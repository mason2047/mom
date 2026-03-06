/**
 * API 客户端层
 * 定义所有后端 API 接口函数，当前使用 mock 数据
 * 后端开发完成后只需替换 BASE_URL 和移除 mock 逻辑
 */
import type {
  ApiResponse,
  LoginResponse,
  WechatLoginRequest,
  User,
  PregnancyProfile,
  CheckupPlan,
  CheckupRecord,
  WeightRecord,
  BloodPressureRecord,
  BloodSugarRecord,
  FetalMovementRecord,
  ChatMessage,
  ReportUpload,
  ReportResult,
  FoodRecognitionResult,
  DietGoal,
  DailyDietSummary,
  MaternityCenter,
  Nanny,
  MaternityBooking,
  CoinRecord,
  Achievement,
  DailyTask,
  StreakData,
  UserSettings,
  BabyDevelopment,
  MomHealth,
  PaginationParams,
  PaginatedResponse,
  ReportType,
  MealType,
  FetalWeight,
} from '@/types'

// ============================================================
// 配置
// ============================================================

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || '/api'

/** 通用请求函数 */
async function request<T>(
  path: string,
  options: RequestInit = {}
): Promise<ApiResponse<T>> {
  const url = `${BASE_URL}${path}`
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...((options.headers as Record<string, string>) || {}),
  }

  // 从 localStorage 获取 token（生产环境应使用更安全的方式）
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('token')
    if (token) {
      headers['Authorization'] = `Bearer ${token}`
    }
  }

  const response = await fetch(url, {
    ...options,
    headers,
  })

  if (!response.ok) {
    throw new Error(`API Error: ${response.status} ${response.statusText}`)
  }

  return response.json()
}

// ============================================================
// 认证模块
// ============================================================

export const authApi = {
  /** 微信登录 */
  wechatLogin: (data: WechatLoginRequest) =>
    request<LoginResponse>('/auth/wechat-login', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  /** 刷新 token */
  refreshToken: (refreshToken: string) =>
    request<{ token: string; refreshToken: string }>('/auth/refresh', {
      method: 'POST',
      body: JSON.stringify({ refreshToken }),
    }),

  /** 获取当前用户信息 */
  getCurrentUser: () => request<User>('/auth/me'),

  /** 退出登录 */
  logout: () => request<void>('/auth/logout', { method: 'POST' }),
}

// ============================================================
// 孕期档案模块
// ============================================================

export const profileApi = {
  /** 创建孕期档案 */
  createProfile: (data: Partial<PregnancyProfile>) =>
    request<PregnancyProfile>('/profile', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  /** 获取孕期档案 */
  getProfile: () => request<PregnancyProfile>('/profile'),

  /** 更新孕期档案 */
  updateProfile: (data: Partial<PregnancyProfile>) =>
    request<PregnancyProfile>('/profile', {
      method: 'PUT',
      body: JSON.stringify(data),
    }),
}

// ============================================================
// 孕期知识模块
// ============================================================

export const knowledgeApi = {
  /** 获取某周的宝宝发育信息 */
  getBabyDevelopment: (week: number) =>
    request<BabyDevelopment>(`/knowledge/baby/${week}`),

  /** 获取某周的妈妈健康信息 */
  getMomHealth: (week: number) =>
    request<MomHealth>(`/knowledge/mom/${week}`),
}

// ============================================================
// 产检管理模块
// ============================================================

export const checkupApi = {
  /** 获取所有产检计划 */
  getCheckupPlans: () => request<CheckupPlan[]>('/checkup/plans'),

  /** 获取单个产检计划详情 */
  getCheckupPlan: (id: string) =>
    request<CheckupPlan>(`/checkup/plans/${id}`),

  /** 更新产检计划（修改时间等） */
  updateCheckupPlan: (id: string, data: Partial<CheckupPlan>) =>
    request<CheckupPlan>(`/checkup/plans/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),

  /** 提交产检记录 */
  createCheckupRecord: (data: Partial<CheckupRecord>) =>
    request<CheckupRecord>('/checkup/records', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  /** 获取产检记录列表 */
  getCheckupRecords: () => request<CheckupRecord[]>('/checkup/records'),

  /** 更新产检提醒 */
  updateReminder: (
    planId: string,
    reminderId: string,
    enabled: boolean
  ) =>
    request<void>(`/checkup/plans/${planId}/reminders/${reminderId}`, {
      method: 'PUT',
      body: JSON.stringify({ enabled }),
    }),
}

// ============================================================
// 健康记录模块
// ============================================================

export const healthApi = {
  // --- 体重 ---
  /** 记录体重 */
  createWeightRecord: (data: { weight: number; date: string; note?: string }) =>
    request<WeightRecord>('/health/weight', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  /** 获取体重记录列表 */
  getWeightRecords: (params?: PaginationParams) =>
    request<PaginatedResponse<WeightRecord>>(
      `/health/weight?page=${params?.page || 1}&pageSize=${params?.pageSize || 20}`
    ),

  /** 获取体重趋势 */
  getWeightTrend: (range: 'week' | 'month' | 'trimester' | 'all') =>
    request<WeightRecord[]>(`/health/weight/trend?range=${range}`),

  // --- 血压 ---
  /** 记录血压 */
  createBloodPressureRecord: (data: {
    systolic: number
    diastolic: number
    date: string
    measureTime: string
    position?: string
    note?: string
  }) =>
    request<BloodPressureRecord>('/health/blood-pressure', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  /** 获取血压记录列表 */
  getBloodPressureRecords: (params?: PaginationParams) =>
    request<PaginatedResponse<BloodPressureRecord>>(
      `/health/blood-pressure?page=${params?.page || 1}&pageSize=${params?.pageSize || 20}`
    ),

  // --- 血糖 ---
  /** 记录血糖 */
  createBloodSugarRecord: (data: {
    value: number
    mealType: string
    date: string
    note?: string
  }) =>
    request<BloodSugarRecord>('/health/blood-sugar', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  /** 获取血糖记录列表 */
  getBloodSugarRecords: (params?: PaginationParams) =>
    request<PaginatedResponse<BloodSugarRecord>>(
      `/health/blood-sugar?page=${params?.page || 1}&pageSize=${params?.pageSize || 20}`
    ),

  // --- 胎动 ---
  /** 记录胎动 */
  createFetalMovementRecord: (data: {
    count: number
    startTime: string
    duration: number
    date: string
  }) =>
    request<FetalMovementRecord>('/health/fetal-movement', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  /** 获取胎动记录 */
  getFetalMovementRecords: (params?: PaginationParams) =>
    request<PaginatedResponse<FetalMovementRecord>>(
      `/health/fetal-movement?page=${params?.page || 1}&pageSize=${params?.pageSize || 20}`
    ),

  // --- 胎儿估重 ---
  /** 记录胎儿估重 */
  createFetalWeight: (data: { bpd: number; ac: number; fl: number; date: string }) =>
    request<FetalWeight>('/health/fetal-weight', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
}

// ============================================================
// AI 助手模块
// ============================================================

export const assistantApi = {
  /** 发送消息 */
  sendMessage: (content: string, imageUrl?: string) =>
    request<ChatMessage>('/assistant/chat', {
      method: 'POST',
      body: JSON.stringify({ content, imageUrl }),
    }),

  /** 获取聊天历史 */
  getChatHistory: (params?: PaginationParams) =>
    request<PaginatedResponse<ChatMessage>>(
      `/assistant/history?page=${params?.page || 1}&pageSize=${params?.pageSize || 50}`
    ),

  /** 清空聊天记录 */
  clearHistory: () =>
    request<void>('/assistant/history', { method: 'DELETE' }),
}

// ============================================================
// 报告解读模块
// ============================================================

export const reportApi = {
  /** 上传报告 */
  uploadReport: (data: {
    imageUrls: string[]
    type?: ReportType
  }) =>
    request<ReportUpload>('/reports/upload', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  /** 获取报告解读结果 */
  getReportResult: (reportId: string) =>
    request<ReportResult>(`/reports/${reportId}/result`),

  /** 获取历史报告列表 */
  getReportHistory: () => request<ReportUpload[]>('/reports/history'),

  /** 上传图片（获取URL） */
  uploadImage: (file: File) => {
    const formData = new FormData()
    formData.append('file', file)
    return request<{ url: string }>('/upload/image', {
      method: 'POST',
      body: formData,
      headers: {}, // 让浏览器自动设置 Content-Type
    })
  },
}

// ============================================================
// 饮食管理模块
// ============================================================

export const dietApi = {
  /** 获取饮食目标 */
  getDietGoal: () => request<DietGoal>('/diet/goal'),

  /** 设置饮食目标 */
  updateDietGoal: (data: Partial<DietGoal>) =>
    request<DietGoal>('/diet/goal', {
      method: 'PUT',
      body: JSON.stringify(data),
    }),

  /** 识别食物（上传图片） */
  recognizeFood: (imageUrl: string, mealType: MealType) =>
    request<FoodRecognitionResult>('/diet/recognize', {
      method: 'POST',
      body: JSON.stringify({ imageUrl, mealType }),
    }),

  /** 保存饮食记录 */
  saveDietRecord: (data: FoodRecognitionResult) =>
    request<void>('/diet/records', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  /** 获取每日饮食摘要 */
  getDailySummary: (date: string) =>
    request<DailyDietSummary>(`/diet/summary?date=${date}`),

  /** AI 饮食问答 */
  askDiet: (question: string) =>
    request<ChatMessage>('/diet/ask', {
      method: 'POST',
      body: JSON.stringify({ question }),
    }),
}

// ============================================================
// 月子服务模块
// ============================================================

export const maternityApi = {
  /** 获取月子中心列表 */
  getCenters: (params?: {
    city?: string
    district?: string
    minPrice?: number
    maxPrice?: number
    minRating?: number
    sort?: string
  }) =>
    request<PaginatedResponse<MaternityCenter>>(
      `/maternity/centers?${new URLSearchParams(params as Record<string, string>).toString()}`
    ),

  /** 获取月子中心详情 */
  getCenterDetail: (id: string) =>
    request<MaternityCenter>(`/maternity/centers/${id}`),

  /** 获取月嫂列表 */
  getNannies: (params?: {
    city?: string
    minPrice?: number
    maxPrice?: number
    skills?: string[]
    sort?: string
  }) =>
    request<PaginatedResponse<Nanny>>(
      `/maternity/nannies?${new URLSearchParams(params as Record<string, string>).toString()}`
    ),

  /** 获取月嫂详情 */
  getNannyDetail: (id: string) =>
    request<Nanny>(`/maternity/nannies/${id}`),

  /** 获取评价列表 */
  getReviews: (serviceId: string, params?: PaginationParams) =>
    request<PaginatedResponse<import('@/types').Review>>(
      `/maternity/reviews/${serviceId}?page=${params?.page || 1}&pageSize=${params?.pageSize || 10}`
    ),

  /** 提交预约 */
  createBooking: (data: Partial<MaternityBooking>) =>
    request<MaternityBooking>('/maternity/bookings', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  /** 获取我的预约列表 */
  getMyBookings: () => request<MaternityBooking[]>('/maternity/bookings/mine'),

  /** 取消预约 */
  cancelBooking: (id: string) =>
    request<void>(`/maternity/bookings/${id}/cancel`, { method: 'POST' }),
}

// ============================================================
// 用户中心模块
// ============================================================

export const userApi = {
  /** 获取幸孕币余额和统计 */
  getCoinBalance: () =>
    request<{ balance: number; totalEarned: number; totalSpent: number }>('/user/coins/balance'),

  /** 获取幸孕币记录 */
  getCoinRecords: (params?: PaginationParams) =>
    request<PaginatedResponse<CoinRecord>>(
      `/user/coins/records?page=${params?.page || 1}&pageSize=${params?.pageSize || 20}`
    ),

  /** 获取成就列表 */
  getAchievements: () => request<Achievement[]>('/user/achievements'),

  /** 获取每日任务 */
  getDailyTasks: () => request<DailyTask[]>('/user/tasks/daily'),

  /** 完成每日任务 */
  completeTask: (taskId: string) =>
    request<{ coinReward: number }>(`/user/tasks/${taskId}/complete`, {
      method: 'POST',
    }),

  /** 获取连续打卡数据 */
  getStreakData: () => request<StreakData>('/user/streak'),

  /** 获取/更新设置 */
  getSettings: () => request<UserSettings>('/user/settings'),
  updateSettings: (data: Partial<UserSettings>) =>
    request<UserSettings>('/user/settings', {
      method: 'PUT',
      body: JSON.stringify(data),
    }),

  /** 更新用户信息 */
  updateUser: (data: Partial<User>) =>
    request<User>('/user/profile', {
      method: 'PUT',
      body: JSON.stringify(data),
    }),
}
