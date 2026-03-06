'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import NavBar from '@/components/layout/NavBar'
import Chip from '@/components/ui/Chip'
import MealDistributionCard from '@/components/business/MealDistributionCard'

/**
 * 饮食目标设置页
 * 设置每日热量目标、碳水限制、控糖模式
 */

type DietMode = 'balanced' | 'gdm_strict' | 'gdm_moderate'

const MODES: { key: DietMode; label: string }[] = [
  { key: 'balanced', label: '营养均衡模式' },
  { key: 'gdm_moderate', label: 'GDM控糖（温和）' },
  { key: 'gdm_strict', label: 'GDM控糖（严格）' },
]

export default function DietGoalPage() {
  const router = useRouter()
  const [dailyKcal, setDailyKcal] = useState(1800)
  const [carbPercent, setCarbPercent] = useState(50)
  const [dietMode, setDietMode] = useState<DietMode>('gdm_moderate')

  const handleSave = () => {
    // TODO: dietApi.updateDietGoal
    router.back()
  }

  return (
    <div className="flex flex-col min-h-screen bg-bg">
      <NavBar title="饮食目标设置" onBack={() => router.back()} />

      <div className="flex-1 overflow-y-auto hide-scrollbar">
        {/* 控糖模式 */}
        <div className="bg-white mx-4 mt-3 rounded-card p-4 shadow-card">
          <h2 className="text-[15px] font-semibold text-text-primary mb-3.5">&#127919; 控糖模式</h2>
          <div className="flex flex-wrap gap-2 mb-3">
            {MODES.map((m) => (
              <button
                key={m.key}
                onClick={() => setDietMode(m.key)}
                className={`px-3.5 py-1.5 rounded-chip border-[1.5px] text-xs transition-colors ${
                  dietMode === m.key
                    ? 'bg-teal border-teal text-white'
                    : 'bg-white border-border-dark text-text-secondary'
                }`}
              >
                {m.label}
              </button>
            ))}
          </div>
          <div className="bg-[#f0faf5] rounded-input p-3 text-xs text-[#2a6a50] leading-relaxed">
            {dietMode === 'gdm_strict'
              ? '严格模式：每日碳水占比 <=40%，限制高GI食物，每餐碳水 <=30g。适合已确诊GDM的孕妈。'
              : dietMode === 'gdm_moderate'
              ? '温和模式：每日碳水占比 45-50%，优先低GI食物，适当控制精制碳水。适合糖耐异常或预防控糖。'
              : '均衡模式：按照中国孕期膳食指南推荐比例分配三大营养素，保证胎儿发育所需营养。'}
          </div>
        </div>

        {/* 每日热量 */}
        <div className="bg-white mx-4 mt-3 rounded-card p-4 shadow-card">
          <h2 className="text-[15px] font-semibold text-text-primary mb-3.5">&#128293; 每日热量目标</h2>
          <div className="flex justify-between text-[13px] text-text-secondary font-medium mb-1.5">
            <span>每日热量</span>
            <span className="text-teal font-semibold">{dailyKcal} kcal</span>
          </div>
          <div className="relative h-1.5 bg-border rounded mb-1">
            <div
              className="h-full bg-teal rounded"
              style={{ width: `${((dailyKcal - 1200) / (2400 - 1200)) * 100}%` }}
            />
          </div>
          <div className="flex justify-between text-[10px] text-text-muted">
            <span>1200 kcal</span>
            <span>2400 kcal</span>
          </div>
          <input
            type="range"
            min="1200"
            max="2400"
            step="50"
            value={dailyKcal}
            onChange={(e) => setDailyKcal(Number(e.target.value))}
            className="w-full mt-2 accent-teal"
          />
        </div>

        {/* 碳水占比 */}
        <div className="bg-white mx-4 mt-3 rounded-card p-4 shadow-card">
          <h2 className="text-[15px] font-semibold text-text-primary mb-3.5">&#127834; 碳水占比</h2>
          <div className="flex justify-between text-[13px] text-text-secondary font-medium mb-1.5">
            <span>碳水化合物占比</span>
            <span className="text-teal font-semibold">{carbPercent}%</span>
          </div>
          <div className="relative h-1.5 bg-border rounded mb-1">
            <div
              className="h-full bg-teal rounded"
              style={{ width: `${((carbPercent - 30) / (65 - 30)) * 100}%` }}
            />
          </div>
          <div className="flex justify-between text-[10px] text-text-muted">
            <span>30%</span>
            <span>65%</span>
          </div>
          <input
            type="range"
            min="30"
            max="65"
            step="5"
            value={carbPercent}
            onChange={(e) => setCarbPercent(Number(e.target.value))}
            className="w-full mt-2 accent-teal"
          />
          <div className="bg-[#f0faf5] rounded-input p-3 text-xs text-[#2a6a50] leading-relaxed mt-3">
            &#128204; 当前碳水每日约 {Math.round((dailyKcal * carbPercent) / 100 / 4)}g，
            {carbPercent <= 45 ? '属于低碳水方案，有助于控制血糖' : '属于正常范围'}
          </div>
        </div>

        {/* Meal Distribution */}
        <MealDistributionCard dailyKcal={dailyKcal} />

        <div className="h-4" />
      </div>

      <div className="p-4 bg-white border-t border-border">
        <button
          onClick={handleSave}
          className="w-full h-[50px] rounded-button bg-teal text-white text-base font-semibold"
        >
          保存设置
        </button>
      </div>
    </div>
  )
}
