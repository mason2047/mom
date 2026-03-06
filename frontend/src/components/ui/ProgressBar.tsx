'use client'

import { cn } from '@/lib/utils'

/**
 * 通用进度条组件
 */
interface ProgressBarProps {
  percent: number
  height?: number
  trackColor?: string
  fillColor?: string
  showDot?: boolean
  className?: string
}

export default function ProgressBar({
  percent,
  height = 6,
  trackColor = 'bg-[#f0e8dc]',
  fillColor = 'bg-gradient-to-r from-primary-400 to-primary',
  showDot = false,
  className = '',
}: ProgressBarProps) {
  const clampedPercent = Math.min(100, Math.max(0, percent))

  return (
    <div className={cn('relative', className)}>
      <div
        className={cn('rounded-full overflow-hidden', trackColor)}
        style={{ height: `${height}px` }}
      >
        <div
          className={cn('h-full rounded-full transition-all duration-500', fillColor)}
          style={{ width: `${clampedPercent}%` }}
        >
          {showDot && (
            <div
              className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2
                         w-3.5 h-3.5 bg-primary border-[3px] border-white rounded-full
                         shadow-[0_0_0_3px_rgba(232,124,62,0.2)]"
            />
          )}
        </div>
      </div>
    </div>
  )
}
