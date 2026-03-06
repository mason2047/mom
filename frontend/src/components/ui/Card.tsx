'use client'

import { cn } from '@/lib/utils'

/**
 * 通用卡片组件
 */
interface CardProps {
  children: React.ReactNode
  className?: string
  onClick?: () => void
  padding?: 'sm' | 'md' | 'lg'
  shadow?: 'sm' | 'md' | 'lg'
  border?: boolean
  borderColor?: string
}

export default function Card({
  children,
  className = '',
  onClick,
  padding = 'md',
  shadow = 'sm',
  border = false,
  borderColor,
}: CardProps) {
  const paddingClass = {
    sm: 'p-3',
    md: 'p-4',
    lg: 'p-5',
  }[padding]

  const shadowClass = {
    sm: 'shadow-card',
    md: 'shadow-card-md',
    lg: 'shadow-card-lg',
  }[shadow]

  return (
    <div
      className={cn(
        'bg-white rounded-card',
        paddingClass,
        shadowClass,
        border && 'border-[1.5px]',
        borderColor,
        onClick && 'cursor-pointer active:opacity-95 transition-opacity',
        className
      )}
      onClick={onClick}
    >
      {children}
    </div>
  )
}
