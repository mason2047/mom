'use client'

import { cn } from '@/lib/utils'

/**
 * 状态徽章组件
 */
type BadgeVariant = 'normal' | 'warning' | 'danger' | 'info' | 'done' | 'pending'

interface BadgeProps {
  variant: BadgeVariant
  children: React.ReactNode
  className?: string
}

const variantStyles: Record<BadgeVariant, string> = {
  normal: 'bg-green-50 text-green',
  warning: 'bg-primary-100 text-primary',
  danger: 'bg-danger-50 text-danger',
  info: 'bg-blue-50 text-blue',
  done: 'bg-green-50 text-green',
  pending: 'bg-blue-50 text-blue',
}

export default function Badge({ variant, children, className = '' }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-block px-2 py-0.5 rounded-[10px] text-[10px] font-medium',
        variantStyles[variant],
        className
      )}
    >
      {children}
    </span>
  )
}
