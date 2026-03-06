'use client'

import { useState } from 'react'
import { cn } from '@/lib/utils'

/**
 * 大号数字输入组件
 * 48px 字号、右侧单位、底部虚线、聚焦变色
 */

interface LargeNumberInputProps {
  value: string
  onChange: (value: string) => void
  unit: string
  placeholder?: string
  className?: string
}

export default function LargeNumberInput({
  value,
  onChange,
  unit,
  placeholder = '0',
  className = '',
}: LargeNumberInputProps) {
  const [focused, setFocused] = useState(false)

  return (
    <div className={cn('flex items-end gap-2 pb-1', className)}>
      <div className="relative flex-1">
        <input
          type="number"
          inputMode="decimal"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          placeholder={placeholder}
          className="w-full bg-transparent outline-none text-text-primary placeholder:text-text-light"
          style={{
            fontSize: 48,
            fontWeight: 800,
            lineHeight: 1.1,
          }}
        />
        <div
          className={cn(
            'absolute bottom-0 left-0 right-0 border-b-2 border-dashed transition-colors duration-200',
            focused ? 'border-primary' : 'border-border-dark'
          )}
        />
      </div>
      <span className="text-lg text-text-muted font-medium pb-2 flex-shrink-0">
        {unit}
      </span>
    </div>
  )
}
