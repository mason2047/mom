'use client'

import { useState } from 'react'
import { cn } from '@/lib/utils'

/**
 * 手风琴/可折叠组件
 */
interface AccordionProps {
  icon?: string
  title: string
  children: React.ReactNode
  defaultOpen?: boolean
  className?: string
}

export default function Accordion({
  icon,
  title,
  children,
  defaultOpen = false,
  className = '',
}: AccordionProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen)

  return (
    <div className={cn('bg-white rounded-[14px] overflow-hidden shadow-card', className)}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-4 py-3.5 flex items-center justify-between cursor-pointer"
      >
        <div className="flex items-center gap-2 text-[13px] font-bold text-text-primary">
          {icon && <span className="text-lg">{icon}</span>}
          <span dangerouslySetInnerHTML={{ __html: title }} />
        </div>
        <span
          className={cn(
            'text-xs transition-transform duration-200',
            isOpen ? 'text-primary rotate-180' : 'text-text-light'
          )}
        >
          &#9662;
        </span>
      </button>
      {isOpen && (
        <div className="px-4 pb-3.5 text-xs text-text-secondary leading-[1.8]">
          {children}
        </div>
      )}
    </div>
  )
}
