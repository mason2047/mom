'use client'

import { cn } from '@/lib/utils'

/**
 * 选择芯片/标签组件
 */
interface ChipProps {
  label: string
  active?: boolean
  onClick?: () => void
  variant?: 'default' | 'orange' | 'teal' | 'rose' | 'blue'
  className?: string
}

const activeStyles: Record<string, string> = {
  default: 'bg-primary border-primary text-white',
  orange: 'bg-primary border-primary text-white',
  teal: 'bg-teal border-teal text-white',
  rose: 'bg-rose border-rose text-white',
  blue: 'bg-blue border-blue text-white',
}

export default function Chip({
  label,
  active = false,
  onClick,
  variant = 'default',
  className = '',
}: ChipProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'px-3.5 py-[7px] rounded-chip border-[1.5px] text-xs cursor-pointer transition-all',
        active
          ? activeStyles[variant]
          : 'border-border-dark text-text-secondary bg-white',
        className
      )}
    >
      {label}
    </button>
  )
}
