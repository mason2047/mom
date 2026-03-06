'use client'

import { useState } from 'react'
import ToggleSwitch from '@/components/ui/ToggleSwitch'

/**
 * P18-C: 餐次分配比例配置组件
 * 早餐/午餐/晚餐各一行（百分比 + kcal + 进度条）
 * "启用加餐"开关（开启后从每餐分出 10%）
 */

interface MealDistributionCardProps {
  dailyKcal: number
}

interface MealConfig {
  label: string
  emoji: string
  basePercent: number
}

const MEALS: MealConfig[] = [
  { label: '早餐', emoji: '&#127749;', basePercent: 30 },
  { label: '午餐', emoji: '&#9728;&#65039;', basePercent: 40 },
  { label: '晚餐', emoji: '&#127769;', basePercent: 30 },
]

export default function MealDistributionCard({ dailyKcal }: MealDistributionCardProps) {
  const [enableSnack, setEnableSnack] = useState(true)

  // 启用加餐时，从每餐各分出约 10% 给加餐
  const snackPercent = enableSnack ? 10 : 0
  const snackKcal = Math.round((dailyKcal * snackPercent) / 100)

  const getMealPercent = (basePercent: number) => {
    if (!enableSnack) return basePercent
    // 从各餐等比分出加餐份额
    return Math.round(basePercent * (1 - snackPercent / 100))
  }

  return (
    <div className="bg-white mx-4 mt-3 rounded-card p-4 shadow-card">
      <h2 className="text-[15px] font-semibold text-text-primary mb-3.5">
        &#127860;&#65039; 每餐热量分配
      </h2>

      <div className="flex flex-col gap-3">
        {MEALS.map((meal) => {
          const percent = getMealPercent(meal.basePercent)
          const kcal = Math.round((dailyKcal * percent) / 100)
          return (
            <div key={meal.label}>
              <div className="flex justify-between text-[13px] text-text-secondary font-medium mb-1">
                <span dangerouslySetInnerHTML={{ __html: `${meal.emoji} ${meal.label}` }} />
                <span className="text-teal">
                  {percent}% · {kcal} kcal
                </span>
              </div>
              <div className="h-1.5 bg-border rounded overflow-hidden">
                <div
                  className="h-full bg-teal rounded transition-all duration-300"
                  style={{ width: `${percent}%` }}
                />
              </div>
            </div>
          )
        })}

        {/* 加餐行（仅在开启时显示） */}
        {enableSnack && (
          <div>
            <div className="flex justify-between text-[13px] text-text-secondary font-medium mb-1">
              <span>&#127822; 加餐</span>
              <span className="text-teal">{snackPercent}% · {snackKcal} kcal</span>
            </div>
            <div className="h-1.5 bg-border rounded overflow-hidden">
              <div
                className="h-full bg-teal/60 rounded transition-all duration-300"
                style={{ width: `${snackPercent}%` }}
              />
            </div>
          </div>
        )}
      </div>

      {/* 启用加餐开关 */}
      <div className="flex items-center gap-2 mt-3.5">
        <span className="text-[13px] text-text-secondary">启用加餐</span>
        <ToggleSwitch checked={enableSnack} onChange={setEnableSnack} />
        <span className="text-xs text-text-muted">每餐各分出10%至加餐</span>
      </div>
    </div>
  )
}
