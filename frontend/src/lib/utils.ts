/**
 * 工具函数库
 * 包含孕期计算、BMI、日期处理等通用函数
 */
import dayjs from 'dayjs'
import type {
  BMICategory,
  GestationalInfo,
  PregnancyTrimester,
  WeightGainRange,
  FruitComparison,
  IndicatorStatus,
} from '@/types'

// ============================================================
// 孕期计算
// ============================================================

/**
 * 根据末次月经日期(LMP)计算预产期(EDD)
 * Naegele法则: LMP + 280天
 */
export function calculateEDD(lmpDate: string): string {
  return dayjs(lmpDate).add(280, 'day').format('YYYY-MM-DD')
}

/**
 * 根据末次月经日期计算当前孕周信息
 */
export function calculateGestationalInfo(lmpDate: string): GestationalInfo {
  const lmp = dayjs(lmpDate)
  const today = dayjs()
  const edd = lmp.add(280, 'day')
  const totalDays = today.diff(lmp, 'day')
  const weeks = Math.floor(totalDays / 7)
  const days = totalDays % 7
  const daysUntilEdd = edd.diff(today, 'day')
  const progressPercent = Math.min((totalDays / 280) * 100, 100)

  let trimester: PregnancyTrimester
  let trimesterWeek: number

  if (weeks < 14) {
    trimester = 'first'
    trimesterWeek = weeks - 5   // 孕早期一般从6周算起
  } else if (weeks < 28) {
    trimester = 'second'
    trimesterWeek = weeks - 13
  } else {
    trimester = 'third'
    trimesterWeek = weeks - 27
  }

  return {
    weeks,
    days,
    totalDays,
    trimester,
    trimesterWeek: Math.max(trimesterWeek, 1),
    daysUntilEdd: Math.max(daysUntilEdd, 0),
    progressPercent: Math.round(progressPercent * 10) / 10,
    fruitComparison: getFruitComparison(weeks),
  }
}

/**
 * 根据预产期反推末次月经日期
 */
export function calculateLMPFromEDD(eddDate: string): string {
  return dayjs(eddDate).subtract(280, 'day').format('YYYY-MM-DD')
}

/**
 * 格式化孕周显示
 */
export function formatGestationalAge(weeks: number, days: number): string {
  return `孕${weeks}周${days}天`
}

/**
 * 获取孕期阶段名称
 */
export function getTrimesterName(trimester: PregnancyTrimester): string {
  const names: Record<PregnancyTrimester, string> = {
    first: '孕早期',
    second: '孕中期',
    third: '孕晚期',
  }
  return names[trimester]
}

// ============================================================
// BMI 和体重增长
// ============================================================

/**
 * 计算 BMI
 * BMI = 体重(kg) / 身高(m)^2
 */
export function calculateBMI(weightKg: number, heightCm: number): number {
  const heightM = heightCm / 100
  return Math.round((weightKg / (heightM * heightM)) * 10) / 10
}

/**
 * 获取 BMI 分类
 * 参考 WHO / IOM 2009 标准
 */
export function getBMICategory(bmi: number): BMICategory {
  if (bmi < 18.5) return 'underweight'
  if (bmi < 25) return 'normal'
  if (bmi < 30) return 'overweight'
  return 'obese'
}

/**
 * 获取 BMI 分类的中文名称
 */
export function getBMICategoryName(category: BMICategory): string {
  const names: Record<BMICategory, string> = {
    underweight: '偏轻',
    normal: '正常',
    overweight: '偏重',
    obese: '肥胖',
  }
  return names[category]
}

/**
 * 获取孕期推荐增重范围（IOM 2009标准，单胎）
 */
export function getRecommendedWeightGain(bmiCategory: BMICategory): WeightGainRange {
  const ranges: Record<BMICategory, WeightGainRange> = {
    underweight: { min: 12.5, max: 18, standard: 'WHO IOM 2009' },
    normal: { min: 11.5, max: 16, standard: 'WHO IOM 2009' },
    overweight: { min: 7, max: 11.5, standard: 'WHO IOM 2009' },
    obese: { min: 5, max: 9, standard: 'WHO IOM 2009' },
  }
  return ranges[bmiCategory]
}

/**
 * 获取当前孕周推荐增重范围
 * 孕早期（0-13周）：总共增加 0.5~2 kg
 * 孕中晚期（14-40周）：每周增加 0.35~0.5 kg（依据BMI分类）
 */
export function getWeeklyRecommendedGain(
  week: number,
  bmiCategory: BMICategory
): { min: number; max: number } {
  const totalRange = getRecommendedWeightGain(bmiCategory)

  if (week <= 13) {
    // 孕早期总共约 0.5~2kg，线性分摊
    const earlyMax = 2
    const ratio = week / 13
    return {
      min: Math.round(0.5 * ratio * 10) / 10,
      max: Math.round(earlyMax * ratio * 10) / 10,
    }
  }

  // 孕中晚期：早期基础 + 每周增量
  const weeksAfterEarly = week - 13
  const weeklyRate = (totalRange.max - 2) / 27  // 中晚期27周
  return {
    min: Math.round((0.5 + weeksAfterEarly * weeklyRate * 0.7) * 10) / 10,
    max: Math.round((2 + weeksAfterEarly * weeklyRate) * 10) / 10,
  }
}

// ============================================================
// 血压判断
// ============================================================

/**
 * 判断血压状态（孕期标准）
 */
export function evaluateBloodPressure(
  systolic: number,
  diastolic: number
): { status: 'normal' | 'elevated' | 'high' | 'critical'; label: string } {
  if (systolic >= 160 || diastolic >= 110) {
    return { status: 'critical', label: '严重偏高' }
  }
  if (systolic >= 140 || diastolic >= 90) {
    return { status: 'high', label: '偏高' }
  }
  if (systolic >= 120 || diastolic >= 80) {
    return { status: 'elevated', label: '偏高关注' }
  }
  return { status: 'normal', label: '正常' }
}

// ============================================================
// 血糖判断
// ============================================================

/**
 * 判断血糖状态（孕期标准）
 */
export function evaluateBloodSugar(
  value: number,
  mealType: 'fasting' | 'before_meal' | 'after_meal_1h' | 'after_meal_2h' | 'bedtime'
): { status: 'normal' | 'high' | 'low'; label: string; reference: string } {
  const thresholds: Record<string, { min: number; max: number; ref: string }> = {
    fasting: { min: 3.3, max: 5.3, ref: '3.3~5.3 mmol/L' },
    before_meal: { min: 3.3, max: 5.3, ref: '3.3~5.3 mmol/L' },
    after_meal_1h: { min: 3.3, max: 7.8, ref: '<7.8 mmol/L' },
    after_meal_2h: { min: 3.3, max: 6.7, ref: '<6.7 mmol/L' },
    bedtime: { min: 3.3, max: 6.7, ref: '3.3~6.7 mmol/L' },
  }

  const threshold = thresholds[mealType]
  if (value < threshold.min) return { status: 'low', label: '偏低', reference: threshold.ref }
  if (value > threshold.max) return { status: 'high', label: '偏高', reference: threshold.ref }
  return { status: 'normal', label: '正常', reference: threshold.ref }
}

// ============================================================
// 水果对照表
// ============================================================

/** 每周胎儿大小的水果对照 */
const FRUIT_MAP: Record<number, FruitComparison> = {
  4: { emoji: '🌰', name: '罂粟籽', lengthCm: 0.1, weightG: 0 },
  5: { emoji: '🫘', name: '芝麻粒', lengthCm: 0.2, weightG: 0 },
  6: { emoji: '🫐', name: '蓝莓', lengthCm: 0.6, weightG: 0 },
  7: { emoji: '🫒', name: '橄榄', lengthCm: 1.3, weightG: 1 },
  8: { emoji: '🍇', name: '葡萄', lengthCm: 1.6, weightG: 1 },
  9: { emoji: '🍒', name: '樱桃', lengthCm: 2.3, weightG: 2 },
  10: { emoji: '🍓', name: '草莓', lengthCm: 3.1, weightG: 4 },
  11: { emoji: '🫐', name: '无花果', lengthCm: 4.1, weightG: 7 },
  12: { emoji: '🍑', name: '李子', lengthCm: 5.4, weightG: 14 },
  13: { emoji: '🍋', name: '柠檬', lengthCm: 7.4, weightG: 23 },
  14: { emoji: '🍇', name: '山竹', lengthCm: 8.7, weightG: 43 },
  15: { emoji: '🍊', name: '橙子', lengthCm: 10.1, weightG: 70 },
  16: { emoji: '🥑', name: '牛油果', lengthCm: 11.6, weightG: 100 },
  17: { emoji: '🍐', name: '梨', lengthCm: 13, weightG: 140 },
  18: { emoji: '🫑', name: '甜椒', lengthCm: 14.2, weightG: 190 },
  19: { emoji: '🥭', name: '芒果', lengthCm: 15.3, weightG: 240 },
  20: { emoji: '🍌', name: '香蕉', lengthCm: 16.4, weightG: 300 },
  21: { emoji: '🥕', name: '胡萝卜', lengthCm: 26.7, weightG: 360 },
  22: { emoji: '🥥', name: '椰子', lengthCm: 27.8, weightG: 430 },
  23: { emoji: '🍆', name: '茄子', lengthCm: 28.9, weightG: 500 },
  24: { emoji: '🌽', name: '玉米', lengthCm: 30, weightG: 600 },
  25: { emoji: '🥦', name: '花菜', lengthCm: 34.6, weightG: 660 },
  26: { emoji: '🥬', name: '生菜', lengthCm: 35.6, weightG: 760 },
  27: { emoji: '🥒', name: '黄瓜', lengthCm: 36.6, weightG: 875 },
  28: { emoji: '🍠', name: '番薯', lengthCm: 37.6, weightG: 1005 },
  29: { emoji: '🎃', name: '小南瓜', lengthCm: 38.6, weightG: 1150 },
  30: { emoji: '🥝', name: '大柚子', lengthCm: 39.9, weightG: 1320 },
  31: { emoji: '🍈', name: '哈密瓜', lengthCm: 41.1, weightG: 1500 },
  32: { emoji: '🍍', name: '菠萝', lengthCm: 42.4, weightG: 1700 },
  33: { emoji: '🫛', name: '大白菜', lengthCm: 43.7, weightG: 1920 },
  34: { emoji: '🍉', name: '小西瓜', lengthCm: 45, weightG: 2150 },
  35: { emoji: '🍉', name: '西瓜', lengthCm: 46.2, weightG: 2380 },
  36: { emoji: '🍉', name: '哈密瓜', lengthCm: 47.4, weightG: 2620 },
  37: { emoji: '🍉', name: '冬瓜', lengthCm: 48.6, weightG: 2860 },
  38: { emoji: '🍉', name: '大冬瓜', lengthCm: 49.8, weightG: 3080 },
  39: { emoji: '🍉', name: '大西瓜', lengthCm: 50.7, weightG: 3290 },
  40: { emoji: '🍉', name: '大南瓜', lengthCm: 51.2, weightG: 3460 },
}

export function getFruitComparison(week: number): FruitComparison {
  const clamped = Math.max(4, Math.min(40, week))
  return FRUIT_MAP[clamped] || FRUIT_MAP[14]
}

// ============================================================
// 指标状态颜色映射
// ============================================================

export function getIndicatorStatusColor(status: IndicatorStatus): string {
  const colors: Record<IndicatorStatus, string> = {
    normal: 'text-green',
    low: 'text-blue-500',
    high: 'text-primary',
    alert: 'text-danger',
  }
  return colors[status]
}

export function getIndicatorBadgeClass(status: IndicatorStatus): string {
  const classes: Record<IndicatorStatus, string> = {
    normal: 'badge-normal',
    low: 'badge-info',
    high: 'badge-warning',
    alert: 'badge-danger',
  }
  return classes[status]
}

// ============================================================
// 日期格式化
// ============================================================

export function formatDate(date: string, format: string = 'YYYY年M月D日'): string {
  return dayjs(date).format(format)
}

export function formatDateShort(date: string): string {
  return dayjs(date).format('M月D日')
}

export function formatDateRelative(date: string): string {
  const diff = dayjs().diff(dayjs(date), 'day')
  if (diff === 0) return '今天'
  if (diff === 1) return '昨天'
  if (diff < 7) return `${diff}天前`
  return dayjs(date).format('M/D')
}

// ============================================================
// classnames 辅助
// ============================================================

export function cn(...classes: (string | boolean | undefined | null)[]): string {
  return classes.filter(Boolean).join(' ')
}
