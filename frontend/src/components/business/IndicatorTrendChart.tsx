'use client'

import { cn } from '@/lib/utils'

/**
 * 指标历史趋势柱状图组件
 * 简单柱状图（3~5 个数据点），最新一期深色高亮
 */

interface TrendDataPoint {
  week: number
  value: number
  label?: string
}

interface IndicatorTrendChartProps {
  title: string
  unit: string
  data: TrendDataPoint[]
  trendDesc?: string
  className?: string
}

const MOCK_DATA: TrendDataPoint[] = [
  { week: 10, value: 110 },
  { week: 11, value: 108 },
  { week: 12, value: 107 },
  { week: 13, value: 106 },
  { week: 14, value: 105 },
]

export default function IndicatorTrendChart({
  title = '血红蛋白 (Hb)',
  unit = 'g/L',
  data = MOCK_DATA,
  trendDesc = '近5周呈缓慢下降趋势，属于孕期生理性变化，建议加强铁剂补充。',
  className = '',
}: IndicatorTrendChartProps) {
  if (data.length === 0) return null

  const maxValue = Math.max(...data.map((d) => d.value))
  const minValue = Math.min(...data.map((d) => d.value))
  const range = maxValue - minValue || 1
  const BAR_MAX_H = 80 // px

  const lastIndex = data.length - 1
  const lastValue = data[lastIndex].value
  const prevValue = data.length > 1 ? data[lastIndex - 1].value : lastValue
  const diff = lastValue - prevValue
  const trendArrow = diff > 0 ? '↑' : diff < 0 ? '↓' : '→'
  const trendColor = diff > 0 ? 'text-danger' : diff < 0 ? 'text-blue' : 'text-green'

  return (
    <div className={cn('bg-white rounded-card p-4 shadow-card', className)}>
      <div className="text-[13px] font-semibold text-text-primary mb-3">
        📊 {title} 历史趋势
      </div>

      {/* Bar Chart */}
      <div className="flex items-end justify-around gap-2 px-2" style={{ height: BAR_MAX_H + 30 }}>
        {data.map((point, i) => {
          const isLatest = i === lastIndex
          const barH = ((point.value - minValue + range * 0.2) / (range * 1.4)) * BAR_MAX_H
          return (
            <div key={i} className="flex flex-col items-center gap-1 flex-1">
              {/* Value */}
              <span
                className={cn(
                  'text-[11px] font-semibold',
                  isLatest ? 'text-primary' : 'text-text-muted'
                )}
              >
                {point.value}
                {isLatest && (
                  <span className={cn('ml-0.5 text-[10px]', trendColor)}>
                    {trendArrow}
                  </span>
                )}
              </span>
              {/* Bar */}
              <div
                className={cn(
                  'w-full max-w-[32px] rounded-t-md transition-all duration-300',
                  isLatest
                    ? 'bg-gradient-to-t from-primary to-primary-400'
                    : 'bg-[#f0e8dc]'
                )}
                style={{ height: `${Math.max(barH, 8)}px` }}
              />
              {/* Week label */}
              <span className="text-[10px] text-text-muted">
                {point.label || `孕${point.week}周`}
              </span>
            </div>
          )
        })}
      </div>

      {/* Trend Description */}
      {trendDesc && (
        <div className="mt-3 bg-[#fff8f3] rounded-lg px-3 py-2 text-[11px] text-[#a06030] leading-relaxed">
          📈 {trendDesc}
        </div>
      )}
    </div>
  )
}
