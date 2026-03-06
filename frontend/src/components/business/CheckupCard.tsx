'use client'

import Badge from '@/components/ui/Badge'
import type { CheckupPlan } from '@/types'
import { cn } from '@/lib/utils'

/**
 * 产检信息卡片
 */
interface CheckupCardProps {
  plan: CheckupPlan
  onViewDetail?: () => void
  onRecord?: () => void
}

export default function CheckupCard({ plan, onViewDetail, onRecord }: CheckupCardProps) {
  const statusConfig = {
    completed: { variant: 'done' as const, label: '已完成', dotClass: 'bg-green' },
    pending: { variant: 'pending' as const, label: '待产检', dotClass: 'bg-blue' },
    overdue: { variant: 'danger' as const, label: '已逾期', dotClass: 'bg-danger' },
  }
  const config = statusConfig[plan.status]

  return (
    <div
      className={cn(
        'bg-white rounded-card p-4 shadow-card mb-2.5',
        plan.status === 'pending' && 'border-[1.5px] border-blue-50'
      )}
    >
      {/* 顶部 */}
      <div className="flex items-start gap-3">
        <div className={cn('w-2.5 h-2.5 rounded-full mt-1 flex-shrink-0', config.dotClass)} />
        <div className="flex-1">
          <div className="flex items-center justify-between mb-1">
            <span className="text-[15px] font-semibold text-text-primary">
              第{plan.order}次产检
            </span>
            <Badge variant={config.variant}>
              {plan.status === 'completed' ? '✓ ' : ''}
              {config.label}
            </Badge>
          </div>
          <div className="text-xs text-text-muted mb-1.5">
            孕{plan.weekRange}周 · {plan.status === 'completed' ? `已于 ${plan.actualDate} 完成` : `预计 ${plan.scheduledDate}`}
          </div>
          <div className="flex flex-wrap gap-1.5">
            {plan.items.map((item) => (
              <span
                key={item.id}
                className={cn(
                  'text-[11px] px-2 py-0.5 rounded-md',
                  item.isImportant
                    ? 'bg-primary-100 text-primary border border-primary-400'
                    : 'bg-bg text-[#5a3010] border border-[#f0e0c8]'
                )}
              >
                {item.name}
                {item.isImportant && ' ⚠️'}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* 操作栏 */}
      <div className="flex gap-2 mt-3 pt-3 border-t border-border-light">
        <button onClick={onViewDetail} className="btn-outline flex-1">
          {plan.status === 'completed' ? '查看记录' : '查看详情'}
        </button>
        {plan.status === 'completed' ? (
          <button onClick={onRecord} className="flex-1 h-[34px] rounded-lg bg-blue-50 text-blue text-sm font-medium">
            AI解读报告
          </button>
        ) : (
          <button onClick={onRecord} className="flex-1 h-[34px] rounded-lg bg-primary text-white text-sm font-medium">
            记录产检
          </button>
        )}
      </div>
    </div>
  )
}
