/**
 * MOM 孕期助手 - 全局类型定义
 * 所有数据模型的 TypeScript 接口
 */

// ============================================================
// 基础类型
// ============================================================

/** API 统一响应结构 */
export interface ApiResponse<T = unknown> {
  code: number
  message: string
  data: T
}

/** 分页请求参数 */
export interface PaginationParams {
  page: number
  pageSize: number
}

/** 分页响应 */
export interface PaginatedResponse<T> {
  list: T[]
  total: number
  page: number
  pageSize: number
  hasMore: boolean
}

/** 排序方式 */
export type SortOrder = 'asc' | 'desc'

// ============================================================
// 用户与认证
// ============================================================

/** 用户信息 */
export interface User {
  id: string
  nickname: string
  avatarUrl: string
  phone?: string
  wechatOpenId?: string
  createdAt: string
  updatedAt: string
}

/** 微信登录请求 */
export interface WechatLoginRequest {
  code: string
}

/** 登录响应 */
export interface LoginResponse {
  token: string
  refreshToken: string
  user: User
  isNewUser: boolean
}

// ============================================================
// 孕期档案
// ============================================================

/** 初/经产妇类型 */
export type ParityType = 'primipara' | 'multipara'

/** 单/多胎 */
export type FetusType = 'singleton' | 'twins' | 'multiple'

/** 高危因素 */
export type RiskFactor =
  | 'hypertension_history'    // 妊高症史
  | 'gestational_diabetes'    // 妊娠糖尿病
  | 'advanced_age'            // 高龄 (>=35)
  | 'none'                    // 无

/** BMI 分类 */
export type BMICategory = 'underweight' | 'normal' | 'overweight' | 'obese'

/** 孕期阶段 */
export type PregnancyTrimester = 'first' | 'second' | 'third'

/** 孕期档案 */
export interface PregnancyProfile {
  id: string
  userId: string
  lmpDate: string                   // 末次月经日期
  eddDate: string                   // 预产期
  prePregnancyWeight: number        // 孕前体重 (kg)
  height: number                    // 身高 (cm)
  prePregnancyBmi: number           // 孕前 BMI
  bmiCategory: BMICategory
  parityType: ParityType
  fetusType: FetusType
  riskFactors: RiskFactor[]
  hospital?: string                 // 就诊医院
  recommendedWeightGain: WeightGainRange  // 推荐增重范围
  createdAt: string
  updatedAt: string
}

/** 增重范围 */
export interface WeightGainRange {
  min: number   // kg
  max: number   // kg
  standard: string  // 参考标准
}

/** 孕周信息（计算值） */
export interface GestationalInfo {
  weeks: number
  days: number
  totalDays: number
  trimester: PregnancyTrimester
  trimesterWeek: number           // 在当前孕期阶段的第几周
  daysUntilEdd: number
  progressPercent: number         // 0~100
  fruitComparison: FruitComparison
}

/** 水果对照 */
export interface FruitComparison {
  emoji: string
  name: string
  lengthCm: number
  weightG: number
}

// ============================================================
// 孕周知识
// ============================================================

/** 宝宝发育信息 */
export interface BabyDevelopment {
  week: number
  lengthCm: number
  weightG: number
  fruitComparison: FruitComparison
  babySay: string                   // 宝宝说文案
  highlights: string[]              // 发育亮点
  dataSource: string                // 数据来源
}

/** 妈妈健康信息 */
export interface MomHealth {
  week: number
  overview: string                  // 健康概述
  bodyChanges: BodyChange[]         // 身体变化
  warningSignals: string[]          // 需警惕的信号
  psychologyTips: string            // 心理变化
  nutritionFocus: NutritionItem[]   // 营养提醒
  weeklyChecklist: ChecklistItem[]  // 本周待办
}

/** 身体变化 */
export interface BodyChange {
  title: string
  description: string
}

/** 营养项 */
export interface NutritionItem {
  emoji: string
  name: string
  description: string
}

/** 清单项 */
export interface ChecklistItem {
  id: string
  text: string
  completed: boolean
  actionLabel?: string
  actionRoute?: string
}

// ============================================================
// 产检管理
// ============================================================

/** 产检状态 */
export type CheckupStatus = 'completed' | 'pending' | 'overdue'

/** 产检结果 */
export type CheckupResult = 'normal' | 'abnormal' | 'follow_up'

/** 产检计划 */
export interface CheckupPlan {
  id: string
  userId: string
  order: number                     // 第几次产检
  name: string                      // 产检名称
  weekRange: string                 // 孕周范围 (如 "14~19+6")
  weekStart: number
  weekEnd: number
  scheduledDate?: string            // 预计日期
  actualDate?: string               // 实际日期
  status: CheckupStatus
  items: CheckupItem[]              // 检查项目
  isKeyCheckup: boolean             // 是否重点产检
  notes?: string                    // 注意事项
  bringList: BringItem[]            // 携带物品
  reminders: CheckupReminder[]
}

/** 检查项目 */
export interface CheckupItem {
  id: string
  name: string
  emoji: string
  description: string
  isImportant: boolean
  completed: boolean
}

/** 携带物品 */
export interface BringItem {
  text: string
  checked: boolean
}

/** 产检提醒 */
export interface CheckupReminder {
  id: string
  type: 'days_before_3' | 'days_before_1' | 'morning'
  enabled: boolean
  time?: string
}

/** 产检记录 */
export interface CheckupRecord {
  id: string
  checkupPlanId: string
  userId: string
  actualDate: string
  hospital: string
  result: CheckupResult
  completedItems: string[]          // 完成的检查项目 ID
  reportImages: string[]            // 报告图片 URL
  doctorNotes: string               // 医生嘱咐
  createdAt: string
}

// ============================================================
// 健康记录
// ============================================================

/** 健康记录类型 */
export type HealthMetricType = 'weight' | 'blood_pressure' | 'blood_sugar' | 'fetal_movement'

/** 体重记录 */
export interface WeightRecord {
  id: string
  userId: string
  date: string
  weight: number                    // kg
  weekOfPregnancy: number
  gainFromPrevious: number          // 较上次变化
  totalGain: number                 // 孕期总增重
  status: 'normal' | 'high' | 'low'
  note?: string
  createdAt: string
}

/** 血压记录 */
export interface BloodPressureRecord {
  id: string
  userId: string
  date: string
  systolic: number                  // 收缩压
  diastolic: number                 // 舒张压
  measureTime: string               // 测量时间
  position: 'sitting' | 'lying' | 'standing'
  status: 'normal' | 'elevated' | 'high' | 'critical'
  note?: string
  createdAt: string
}

/** 血糖记录 */
export interface BloodSugarRecord {
  id: string
  userId: string
  date: string
  value: number                     // mmol/L
  mealType: 'fasting' | 'before_meal' | 'after_meal_1h' | 'after_meal_2h' | 'bedtime'
  status: 'normal' | 'high' | 'low'
  note?: string
  createdAt: string
}

/** 胎动记录 */
export interface FetalMovementRecord {
  id: string
  userId: string
  date: string
  startTime: string
  duration: number                  // 分钟
  count: number
  status: 'normal' | 'decreased' | 'increased'
  note?: string
  createdAt: string
}

/** 健康趋势数据点 */
export interface TrendDataPoint {
  date: string
  value: number
  label?: string
}

/** 胎儿估重 */
export interface FetalWeight {
  id: string
  userId: string
  date: string
  bpd: number    // 双顶径 mm
  ac: number     // 腹围 mm
  fl: number     // 股骨长 mm
  estimatedWeight: number  // 估重 g
  percentile: number       // 百分位
  status: 'normal' | 'small' | 'large'
  createdAt: string
}

// ============================================================
// AI 助手
// ============================================================

/** 消息角色 */
export type MessageRole = 'user' | 'assistant' | 'system'

/** 消息类型 */
export type MessageType = 'text' | 'image' | 'report_card' | 'link_suggestions' | 'survey' | 'typing'

/** 聊天消息 */
export interface ChatMessage {
  id: string
  role: MessageRole
  type: MessageType
  content: string
  timestamp: string
  metadata?: MessageMetadata
}

/** 安心资源卡片 */
export interface ReassuranceCard {
  title: string
  links: LinkSuggestion[]
}

/** 消息元数据 */
export interface MessageMetadata {
  links?: LinkSuggestion[]
  reportCard?: ReportCard
  reassuranceCard?: ReassuranceCard
  surveyOptions?: SurveyOption[]
  imageUrl?: string
}

/** 链接建议 */
export interface LinkSuggestion {
  text: string
  route: string
}

/** 报告卡片 */
export interface ReportCard {
  title: string
  description: string
  emoji: string
  actionText: string
  actionRoute: string
}

/** 问卷选项 */
export interface SurveyOption {
  key: string
  text: string
  selected: boolean
}

// ============================================================
// 报告解读
// ============================================================

/** 报告类型 */
export type ReportType =
  | 'blood_routine'       // 血常规
  | 'urine_routine'       // 尿常规
  | 'downs_screening'     // 唐氏筛查
  | 'ogtt'                // 糖耐量
  | 'liver_kidney'        // 肝肾功能
  | 'thyroid'             // 甲状腺功能
  | 'ultrasound'          // 超声报告
  | 'coagulation'         // 凝血功能

/** 报告上传 */
export interface ReportUpload {
  id: string
  userId: string
  type: ReportType
  imageUrls: string[]
  weekOfPregnancy: number
  uploadDate: string
  status: 'uploading' | 'analyzing' | 'completed' | 'failed'
}

/** 报告解读结果 */
export interface ReportResult {
  id: string
  reportId: string
  reportType: ReportType
  reportDate: string
  weekOfPregnancy: number
  summary: ReportSummary
  aiAssessment: string              // AI 综合解读
  indicators: IndicatorResult[]
  historicalComparison?: HistoricalComparison[]
  disclaimer: string
}

/** 报告概要统计 */
export interface ReportSummary {
  normalCount: number
  warningCount: number
  alertCount: number
}

/** 指标状态 */
export type IndicatorStatus = 'normal' | 'low' | 'high' | 'alert'

/** 指标解读结果 */
export interface IndicatorResult {
  name: string
  abbreviation: string
  value: number
  unit: string
  referenceRange: string            // 参考范围（孕期专用）
  status: IndicatorStatus
  explanation: string               // 解读说明
  pregnancyNote: string             // 孕期特殊说明
  suggestion: string                // 建议
  barPercent: number                // 进度条位置 0~100
}

/** 历史对比 */
export interface HistoricalComparison {
  date: string
  weekOfPregnancy: number
  value: number
}

// ============================================================
// 饮食管理
// ============================================================

/** 饮食模式 */
export type DietMode = 'normal' | 'gdm_control' | 'weight_control' | 'balanced'

/** GI 等级 */
export type GILevel = 'low' | 'medium' | 'high'

/** 餐次 */
export type MealType = 'breakfast' | 'lunch' | 'dinner' | 'snack'

/** 饮食目标 */
export interface DietGoal {
  id: string
  userId: string
  mode: DietMode
  dailyCalorieTarget: number        // kcal
  mealDistribution: MealDistribution
  carbLimitPerMeal: number          // g (GDM 模式)
  dailyCarbLimit: number            // g
  enableSnack: boolean
  updatedAt: string
}

/** 餐次热量分配 */
export interface MealDistribution {
  breakfast: number                 // 百分比
  lunch: number
  dinner: number
  snack: number
}

/** 食物识别结果 */
export interface FoodRecognitionResult {
  id: string
  imageUrl: string
  mealType: MealType
  recognizedAt: string
  items: FoodItem[]
  totalCalories: number
  macroRatio: MacroRatio
  aiEvaluation: string              // AI 饮食评价
}

/** 食物项 */
export interface FoodItem {
  name: string
  emoji: string
  weight: number                    // g
  calories: number                  // kcal
  giValue: number
  giLevel: GILevel
  suggestReplacement?: string       // 建议替换
  replacementGI?: number
}

/** 宏量营养素比例 */
export interface MacroRatio {
  carbPercent: number
  fatPercent: number
  proteinPercent: number
  carbGrams: number
  fatGrams: number
  proteinGrams: number
}

/** 每日饮食摘要 */
export interface DailyDietSummary {
  date: string
  totalCalories: number
  targetCalories: number
  totalCarbs: number
  meals: MealSummary[]
}

/** 单餐摘要 */
export interface MealSummary {
  mealType: MealType
  calories: number
  recorded: boolean
}

// ============================================================
// 月子服务
// ============================================================

/** 服务类型 */
export type MaternityServiceType = 'center' | 'nanny'

/** 月子中心 */
export interface MaternityCenter {
  id: string
  name: string
  address: string
  district: string
  city: string
  distance?: number                 // km
  rating: number
  reviewCount: number
  familyCount: number
  minPrice: number
  imageUrls: string[]
  badges: CenterBadge[]
  tags: string[]
  packages: CenterPackage[]
  features: string[]
  isCertified: boolean
  isAIRecommended: boolean
  availableBeds: number
}

/** 中心徽章 */
export interface CenterBadge {
  type: 'certified' | 'ai_recommended' | 'hot'
  text: string
}

/** 套餐 */
export interface CenterPackage {
  id: string
  name: string
  price: number
  duration: number                  // 天
  description: string
  isPopular: boolean
}

/** 月嫂 */
export interface Nanny {
  id: string
  name: string
  title: string                     // 高级月嫂/金牌月嫂等
  yearsOfExperience: number
  city: string
  familiesServed: number
  rating: number
  reviewCount: number
  avatarUrl: string
  certifications: string[]
  skills: string[]
  monthlyPrice: number
  availability: NannyAvailability[]
  isVerified: boolean
}

/** 月嫂档期 */
export interface NannyAvailability {
  month: string
  available: boolean
  startDate?: string
}

/** 预约信息 */
export interface MaternityBooking {
  id: string
  userId: string
  serviceType: MaternityServiceType
  serviceId: string                 // 月子中心或月嫂 ID
  serviceName: string
  packageId?: string
  packageName?: string
  checkInDate: string
  duration: number
  deliveryType: 'vaginal' | 'cesarean'
  fetusType: FetusType
  specialRequirements: string
  contactName: string
  contactPhone: string
  totalPrice: number
  status: BookingStatus
  orderNumber: string
  createdAt: string
}

/** 预约状态 */
export type BookingStatus = 'pending' | 'confirmed' | 'paid' | 'completed' | 'cancelled'

/** 用户评价 */
export interface Review {
  id: string
  userId: string
  userName: string
  avatarInitial: string
  rating: number
  content: string
  tags: string[]
  createdAt: string
}

// ============================================================
// 用户中心
// ============================================================

/** 幸孕币记录 */
export interface CoinRecord {
  id: string
  userId: string
  amount: number                    // 正数获得，负数消费
  type: CoinTransactionType
  description: string
  createdAt: string
}

/** 幸孕币交易类型 */
export type CoinTransactionType =
  | 'daily_weight'          // 每日记录体重
  | 'daily_blood_pressure'  // 每日记录血压
  | 'checkup_record'        // 产检记录
  | 'report_upload'         // 上传报告
  | 'streak_bonus'          // 连续打卡奖励
  | 'booking_maternity'     // 月子预约
  | 'review'                // 评价
  | 'redeem'                // 兑换消费

/** 成就 */
export interface Achievement {
  id: string
  name: string
  description: string
  emoji: string
  condition: string
  unlockedAt?: string
  isUnlocked: boolean
  progress: number                  // 0~100
}

/** 每日任务 */
export interface DailyTask {
  id: string
  name: string
  coinReward: number
  completed: boolean
  actionRoute?: string
}

/** 连续打卡数据 */
export interface StreakData {
  currentStreak: number
  longestStreak: number
  weekDays: StreakDay[]
}

/** 打卡日 */
export interface StreakDay {
  dayLabel: string
  date: string
  completed: boolean
  isFuture: boolean
}

/** 用户设置 */
export interface UserSettings {
  checkupReminder: boolean
  dailyReminder: boolean
  reminderTime: string              // HH:mm
  darkMode: boolean
  language: 'zh-CN' | 'en'
}

// ============================================================
// 通知
// ============================================================

/** 通知类型 */
export type NotificationType =
  | 'checkup_reminder'
  | 'health_alert'
  | 'weekly_update'
  | 'coin_reward'
  | 'booking_update'

/** 通知 */
export interface Notification {
  id: string
  userId: string
  type: NotificationType
  title: string
  body: string
  read: boolean
  route?: string
  createdAt: string
}
