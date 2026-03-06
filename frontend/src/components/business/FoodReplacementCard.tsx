'use client'

import { useState } from 'react'

/**
 * P18-B: 替代食物推荐组件
 * 高 GI 食物标记"建议替换"红色标签 + 替代食物推荐 Chip 列表
 */

interface ReplacementOption {
  name: string
  gi: number
  kcalDiff?: number
}

interface FoodReplacementCardProps {
  /** 原食物名称 */
  originalFood: string
  /** 原食物 GI 值 */
  originalGI: number
  /** 原食物热量 */
  originalKcal: number
  /** 替代选项 */
  replacements: ReplacementOption[]
  /** 选择替换后回调 */
  onReplace?: (replacement: ReplacementOption) => void
}

export default function FoodReplacementCard({
  originalFood,
  originalGI,
  originalKcal,
  replacements,
  onReplace,
}: FoodReplacementCardProps) {
  const [selectedReplacement, setSelectedReplacement] = useState<string | null>(null)

  const handleSelect = (replacement: ReplacementOption) => {
    setSelectedReplacement(replacement.name)
    onReplace?.(replacement)
  }

  return (
    <div className="bg-[#fff8f0] rounded-[12px] border border-[#ffe8d0] overflow-hidden">
      {/* 提醒标题 */}
      <div className="px-3.5 py-2.5 border-b border-[#ffe8d0]">
        <div className="text-xs text-primary font-medium flex items-center gap-1.5">
          <span className="text-[10px] px-1.5 py-0.5 bg-[#fef0f0] text-danger rounded font-semibold">
            建议替换
          </span>
          <span>
            {originalFood} 高GI({originalGI})，建议低GI替换：
          </span>
        </div>
      </div>

      {/* 替代食物 Chip 列表 */}
      <div className="px-3.5 py-2.5 flex gap-2 flex-wrap">
        {replacements.map((r) => (
          <button
            key={r.name}
            onClick={() => handleSelect(r)}
            className={`px-3 py-1.5 rounded-chip text-xs border-[1.5px] transition-colors ${
              selectedReplacement === r.name
                ? 'bg-[#f0faf5] border-teal text-teal font-bold'
                : 'bg-[#f0faf5] border-teal/50 text-teal'
            }`}
          >
            {r.name} (GI{r.gi})
          </button>
        ))}
      </div>

      {/* 替换后热量变化提示 */}
      {selectedReplacement && (
        <div className="px-3.5 pb-2.5">
          <div className="text-[11px] text-teal bg-[#f0faf5] rounded-lg px-2.5 py-1.5">
            &#9989; 已替换为{selectedReplacement}，热量和血糖影响更小
          </div>
        </div>
      )}
    </div>
  )
}

/** Mock 替代数据 */
export const MOCK_REPLACEMENTS: ReplacementOption[] = [
  { name: '黑米饭', gi: 56 },
  { name: '糙米饭', gi: 59 },
  { name: '藜麦', gi: 53 },
]
