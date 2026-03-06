'use client'

import { useState } from 'react'
import NavBar from '@/components/layout/NavBar'
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
  const [dailyKcal, setDailyKcal] = useState(1800)
  const [dietMode, setDietMode] = useState<DietMode>('gdm_moderate')
  const [mealCarbLimit, setMealCarbLimit] = useState(45)
  const [dailyCarbLimit, setDailyCarbLimit] = useState(180)

  const handleSave = () => {
    // TODO: dietApi.updateDietGoal
    window.location.href = '/diet'
  }

  return (
    <div className="flex flex-col min-h-screen bg-bg">
      <NavBar title="饮食目标设置" backHref="/diet" />

      <div className="flex-1 overflow-y-auto hide-scrollbar">
        {/* Current Mode Banner */}
        <div className="bg-gradient-to-br from-[#f0faf5] to-[#e8f9f2] px-5 py-3.5 border-b border-[#d0f0e0] flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-full bg-teal flex items-center justify-center text-base">&#127807;</div>
          <div className="flex-1">
            <div className="text-sm font-semibold text-[#1a6a50]">GDM控糖模式</div>
            <div className="text-[11px] text-[#4aaa80]">优先低GI食物 · 单餐碳水 &#8804;45g</div>
          </div>
          <span className="text-xs text-teal cursor-pointer">切换模式</span>
        </div>

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

        {/* 基础数据（只读） */}
        <div className="bg-white mx-4 mt-3 rounded-card p-4 shadow-card">
          <h2 className="text-[15px] font-semibold text-text-primary mb-3.5">&#128202; 基础数据（来自档案）</h2>
          <div className="grid grid-cols-2 gap-2.5">
            {[
              { label: '孕前体重', value: '55 kg' },
              { label: '孕前BMI', value: '20.2' },
              { label: '当前孕周', value: '14周' },
              { label: '孕期分类', value: '中期' },
            ].map((item) => (
              <div key={item.label} className="bg-bg rounded-[10px] p-2.5 text-center">
                <div className="text-[11px] text-text-muted">{item.label}</div>
                <div className="text-lg font-bold text-text-primary">{item.value}</div>
              </div>
            ))}
          </div>
        </div>

        {/* 每日热量 */}
        <div className="bg-white mx-4 mt-3 rounded-card p-4 shadow-card">
          <h2 className="text-[15px] font-semibold text-text-primary mb-3.5">&#128293; 每日热量目标</h2>
          <div className="flex justify-between text-[13px] text-text-secondary font-medium mb-1.5">
            <span>总热量目标</span>
            <span className="text-teal font-semibold">{dailyKcal} kcal</span>
          </div>
          <div className="relative h-1.5 bg-border rounded mb-1">
            <div
              className="h-full bg-teal rounded"
              style={{ width: `${((dailyKcal - 1400) / (2200 - 1400)) * 100}%` }}
            />
            <div
              className="absolute top-1/2 -translate-y-1/2 w-[18px] h-[18px] rounded-full bg-teal border-2 border-white shadow-[0_2px_6px_rgba(29,200,160,0.4)] -translate-x-1/2"
              style={{ left: `${((dailyKcal - 1400) / (2200 - 1400)) * 100}%` }}
            />
          </div>
          <div className="flex justify-between text-[10px] text-text-muted">
            <span>1400 kcal</span>
            <span>2200 kcal</span>
          </div>
          <input
            type="range"
            min="1400"
            max="2200"
            step="50"
            value={dailyKcal}
            onChange={(e) => setDailyKcal(Number(e.target.value))}
            className="w-full mt-1 accent-teal opacity-0 h-4 cursor-pointer"
          />
          <div className="bg-[#f0faf5] rounded-input p-3 text-xs text-[#2a6a50] leading-relaxed mt-2">
            &#128204; 系统推荐值：1800 kcal（基于孕前BMI 20.2 + 孕中期 +500kcal 标准，参考《中国居民膳食指南（孕期版）》）
          </div>
        </div>

        {/* Meal Distribution */}
        <MealDistributionCard dailyKcal={dailyKcal} />

        {/* GDM 控糖目标 */}
        <div className="bg-white mx-4 mt-3 rounded-card p-4 shadow-card">
          <h2 className="text-[15px] font-semibold text-text-primary mb-3.5">&#129656; GDM控糖目标</h2>

          {/* 单餐碳水上限 */}
          <div className="mb-4">
            <div className="flex justify-between text-[13px] text-text-secondary font-medium mb-1.5">
              <span>单餐碳水上限</span>
              <span className="text-teal font-semibold">{mealCarbLimit} g</span>
            </div>
            <div className="relative h-1.5 bg-border rounded mb-1">
              <div
                className="h-full bg-teal rounded"
                style={{ width: `${((mealCarbLimit - 20) / (80 - 20)) * 100}%` }}
              />
              <div
                className="absolute top-1/2 -translate-y-1/2 w-[18px] h-[18px] rounded-full bg-teal border-2 border-white shadow-[0_2px_6px_rgba(29,200,160,0.4)] -translate-x-1/2"
                style={{ left: `${((mealCarbLimit - 20) / (80 - 20)) * 100}%` }}
              />
            </div>
            <div className="flex justify-between text-[10px] text-text-muted">
              <span>20g</span>
              <span>80g</span>
            </div>
            <input
              type="range"
              min="20"
              max="80"
              step="5"
              value={mealCarbLimit}
              onChange={(e) => setMealCarbLimit(Number(e.target.value))}
              className="w-full mt-1 accent-teal opacity-0 h-4 cursor-pointer"
            />
          </div>

          {/* 每日总碳水上限 */}
          <div className="mb-4">
            <div className="flex justify-between text-[13px] text-text-secondary font-medium mb-1.5">
              <span>每日总碳水上限</span>
              <span className="text-teal font-semibold">{dailyCarbLimit} g</span>
            </div>
            <div className="relative h-1.5 bg-border rounded mb-1">
              <div
                className="h-full bg-teal rounded"
                style={{ width: `${((dailyCarbLimit - 100) / (260 - 100)) * 100}%` }}
              />
              <div
                className="absolute top-1/2 -translate-y-1/2 w-[18px] h-[18px] rounded-full bg-teal border-2 border-white shadow-[0_2px_6px_rgba(29,200,160,0.4)] -translate-x-1/2"
                style={{ left: `${((dailyCarbLimit - 100) / (260 - 100)) * 100}%` }}
              />
            </div>
            <div className="flex justify-between text-[10px] text-text-muted">
              <span>100g</span>
              <span>260g</span>
            </div>
            <input
              type="range"
              min="100"
              max="260"
              step="10"
              value={dailyCarbLimit}
              onChange={(e) => setDailyCarbLimit(Number(e.target.value))}
              className="w-full mt-1 accent-teal opacity-0 h-4 cursor-pointer"
            />
          </div>

          <div className="bg-[#f0faf5] rounded-input p-3 text-xs text-[#2a6a50] leading-relaxed">
            &#128204; 依据ADA妊娠糖尿病营养治疗建议，每日碳水供能比&#8804;50%，单餐碳水&#8804;45g
          </div>
        </div>

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
