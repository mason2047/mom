'use client'

/**
 * P02 / P04: 周数横向滚动选择器
 * 显示一组周数 Chip，当前周高亮（橙色背景白色文字）
 */

interface WeekChipSelectorProps {
  weeks: number[]
  currentWeek: number
  onSelect: (week: number) => void
}

export default function WeekChipSelector({ weeks, currentWeek, onSelect }: WeekChipSelectorProps) {
  return (
    <div className="flex gap-2 px-4 py-2.5 overflow-x-auto bg-white hide-scrollbar">
      {weeks.map((week) => (
        <button
          key={week}
          onClick={() => onSelect(week)}
          className={`px-3.5 py-1.5 rounded-chip text-xs whitespace-nowrap transition-colors flex-shrink-0 ${
            week === currentWeek
              ? 'bg-primary text-white font-bold'
              : 'bg-bg text-text-tertiary'
          }`}
        >
          孕{week}周
        </button>
      ))}
    </div>
  )
}
