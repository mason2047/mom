'use client'

/**
 * P11: 报告指标参考范围进度条
 * 可视化指标在参考范围内的位置
 * 不同状态颜色：正常(绿)、偏低(蓝)、偏高(橙)、异常(红)
 */

import type { IndicatorStatus } from '@/types'

interface IndicatorProgressBarProps {
  /** 当前值在进度条中的位置百分比 (0~100) */
  barPercent: number
  /** 指标状态 */
  status: IndicatorStatus
  /** 参考范围文字 */
  referenceRange: string
}

const STATUS_COLORS: Record<IndicatorStatus, { gradient: string; marker: string }> = {
  normal: {
    gradient: 'from-[#c8e6c9] to-[#388e3c]',
    marker: 'bg-[#388e3c]',
  },
  low: {
    gradient: 'from-[#bbdefb] to-[#1565c0]',
    marker: 'bg-[#1565c0]',
  },
  high: {
    gradient: 'from-[#ffe0b2] to-[#e65100]',
    marker: 'bg-[#e65100]',
  },
  alert: {
    gradient: 'from-[#ffcdd2] to-[#b71c1c]',
    marker: 'bg-[#b71c1c]',
  },
}

export default function IndicatorProgressBar({
  barPercent,
  status,
  referenceRange,
}: IndicatorProgressBarProps) {
  const colors = STATUS_COLORS[status]
  const clampedPercent = Math.max(2, Math.min(98, barPercent))

  return (
    <div className="mb-2">
      {/* 进度条 */}
      <div className="relative h-1.5 bg-border rounded-full mb-1.5">
        {/* 填充条 */}
        <div
          className={`h-full rounded-full bg-gradient-to-r ${colors.gradient}`}
          style={{ width: `${clampedPercent}%` }}
        />
        {/* 当前值标记点 */}
        <div
          className={`absolute top-[-3px] w-[3px] h-[12px] rounded-sm ${colors.marker}`}
          style={{ left: `${clampedPercent}%`, transform: 'translateX(-50%)' }}
        />
      </div>
      {/* 参考范围标注 */}
      <div className="flex justify-between text-[10px] text-text-muted">
        <span>低</span>
        <span>参考: {referenceRange}</span>
        <span>高</span>
      </div>
    </div>
  )
}
