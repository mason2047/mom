'use client'

import { cn } from '@/lib/utils'

/**
 * 健康记录快捷入口卡片
 * 展示体重、血压、血糖、胎动的最新数据和快捷记录入口
 */

interface QuickCardData {
  icon: string
  iconBg: string
  label: string
  value: string
  unit: string
  hint: string
  hintType: 'normal' | 'warning' | 'disabled'
  actionText: string
  disabled?: boolean
}

interface HealthQuickCardsProps {
  cards: QuickCardData[]
  onCardAction?: (label: string) => void
}

export default function HealthQuickCards({ cards, onCardAction }: HealthQuickCardsProps) {
  return (
    <div className="grid grid-cols-2 gap-2">
      {cards.map((card) => (
        <div key={card.label} className="bg-white rounded-[14px] p-3 shadow-card">
          <div className="flex items-center gap-1.5 mb-1.5">
            <div
              className="w-7 h-7 rounded-lg flex items-center justify-center text-[15px]"
              style={{ background: card.iconBg }}
            >
              {card.icon}
            </div>
            <span className="text-[11px] font-bold text-text-primary">{card.label}</span>
          </div>
          <div>
            <span className={cn(
              'font-extrabold text-text-primary',
              card.value.length > 5 ? 'text-sm' : 'text-lg'
            )}>
              {card.value}
            </span>
            <span className="text-[10px] text-text-muted ml-0.5">{card.unit}</span>
          </div>
          <div
            className={cn(
              'text-[10px] mt-0.5',
              card.hintType === 'normal' && 'text-green',
              card.hintType === 'warning' && 'text-primary',
              card.hintType === 'disabled' && 'text-text-muted'
            )}
          >
            {card.hint}
          </div>
          <button
            onClick={() => onCardAction?.(card.label)}
            disabled={card.disabled}
            className={cn(
              'block w-full mt-1.5 py-1 rounded-lg text-[10px] text-center border border-dashed',
              card.disabled
                ? 'text-text-light border-border bg-bg'
                : 'text-primary border-[rgba(232,124,62,0.4)] bg-bg-warm'
            )}
          >
            {card.actionText}
          </button>
        </div>
      ))}
    </div>
  )
}
