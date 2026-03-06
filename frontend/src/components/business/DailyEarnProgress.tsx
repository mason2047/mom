'use client'

/**
 * 今日可赚幸孕币进度组件
 * 展示今日已赚/上限的进度条和激励文字
 */

interface DailyEarnProgressProps {
  earned?: number
  limit?: number
}

export default function DailyEarnProgress({ earned = 85, limit = 200 }: DailyEarnProgressProps) {
  const percent = Math.min(100, (earned / limit) * 100)
  const allDone = earned >= limit

  return (
    <div className="bg-white mx-4 mt-3 rounded-card p-4 shadow-card">
      <div className="flex items-center justify-between mb-2">
        <span className="text-[13px] font-semibold text-text-primary">
          🪙 今日可赚幸孕币
        </span>
        <span className="text-xs text-primary font-semibold">
          {earned} / {limit} 币
        </span>
      </div>
      <div className="h-2.5 bg-[#f0e8dc] rounded-full overflow-hidden">
        <div
          className="h-full rounded-full bg-gradient-to-r from-[#fcd34d] to-[#f59e0b] transition-all duration-500"
          style={{ width: `${percent}%` }}
        />
      </div>
      <div className="text-[11px] text-center mt-2">
        {allDone ? (
          <span className="text-green font-medium">🎉 今日已达上限！明天继续加油~</span>
        ) : (
          <span className="text-primary font-medium">全部完成额外 +30 币！加油~</span>
        )}
      </div>
    </div>
  )
}
