'use client'

import { useState } from 'react'
import NavBar from '@/components/layout/NavBar'
import LargeNumberInput from '@/components/ui/LargeNumberInput'

/**
 * P13 - 体重管理页
 * 孕前/当前/增重统计，BMI提示，趋势图，记录列表，录入区
 */

const MOCK_RECORDS = [
  { day: 15, month: '3月', value: '58.4 kg', meta: '较上次 +0.6kg · 早晨空腹', status: 'normal' },
  { day: 12, month: '3月', value: '57.8 kg', meta: '较上次 +0.4kg · 早晨空腹', status: 'normal' },
  { day: 10, month: '3月', value: '57.4 kg', meta: '较上次 +0.3kg · 早晨空腹', status: 'normal' },
]

export default function WeightPage() {
  const [weight, setWeight] = useState('58.4')
  const [activeTab, setActiveTab] = useState(0)

  const handleSave = () => {
    // TODO: healthApi.addWeightRecord
  }

  return (
    <div className="flex flex-col min-h-screen bg-bg">
      <NavBar title="体重管理" backHref="/health" />

      <div className="flex-1 overflow-y-auto hide-scrollbar">
        {/* Stats Row */}
        <div className="flex bg-white px-5 py-4 border-b border-border">
          {[
            { label: '孕前体重', value: '55.0', color: 'text-text-primary' },
            { label: '当前体重', value: '58.4', color: 'text-primary' },
            { label: '孕期增重', value: '+3.4', color: 'text-green' },
          ].map((stat, i) => (
            <div
              key={stat.label}
              className={`flex-1 text-center ${i < 2 ? 'border-r border-border' : ''}`}
            >
              <div className="text-[11px] text-text-muted mb-1">{stat.label}</div>
              <div className={`text-lg font-bold ${stat.color}`}>
                {stat.value}
                <span className="text-xs text-text-muted"> kg</span>
              </div>
            </div>
          ))}
        </div>

        {/* BMI Info */}
        <div className="bg-[#fff8f3] px-5 py-2.5 border-b border-[#ffe8d0] flex items-center gap-2">
          <div className="text-[13px] text-[#a06030] flex-1">
            孕前BMI 20.2（正常）· 全孕期建议增重 <strong>11.5~16 kg</strong>
          </div>
          <div className="text-[11px] text-primary whitespace-nowrap">目前&#10003;正常</div>
        </div>

        {/* Chart */}
        <div className="p-4">
          <div className="bg-white rounded-card p-4 shadow-card">
            <div className="flex gap-1.5 mb-3.5">
              {['近1月', '孕早期', '孕中期', '全程'].map((tab, i) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(i)}
                  className={`px-3 py-1 rounded-chip text-xs ${
                    activeTab === i ? 'bg-primary text-white font-medium' : 'bg-bg text-text-muted'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>
            <div className="w-full h-[110px]">
              <svg viewBox="0 0 343 110" className="w-full h-full">
                <path d="M10,90 L333,30" stroke="#e8f5ee" strokeWidth="16" fill="none" opacity=".5" />
                <polyline
                  points="10,90 50,87 90,85 130,82 170,80 210,77 250,74 290,72 323,70"
                  stroke="#FF8C42"
                  strokeWidth="2.5"
                  fill="none"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                {[
                  [10, 90],
                  [90, 85],
                  [170, 80],
                  [250, 74],
                ].map(([cx, cy], i) => (
                  <circle key={i} cx={cx} cy={cy} r="3.5" fill="#FF8C42" />
                ))}
                <circle cx="323" cy="70" r="4.5" fill="#FF8C42" stroke="#fff" strokeWidth="2" />
                <text x="5" y="105" fontSize="9" fill="#aaa">2/15</text>
                <text x="165" y="105" fontSize="9" fill="#aaa">3/1</text>
                <text x="308" y="105" fontSize="9" fill="#aaa">3/15</text>
              </svg>
            </div>
          </div>
        </div>

        {/* Records */}
        <div className="px-4 pb-2">
          <div className="flex items-center justify-between mb-2.5">
            <span className="text-[15px] font-semibold text-text-primary">记录列表</span>
            <span className="text-xs text-primary">+ 新增</span>
          </div>
          <div className="flex flex-col gap-2">
            {MOCK_RECORDS.map((rec) => (
              <div key={`${rec.month}${rec.day}`} className="bg-white rounded-[12px] px-3.5 py-3 flex items-center gap-3 shadow-card">
                <div className="w-[52px] text-center flex-shrink-0">
                  <span className="text-[17px] font-bold text-text-primary block">{rec.day}</span>
                  <span className="text-[10px] text-text-muted">{rec.month}</span>
                </div>
                <div className="w-px h-8 bg-border" />
                <div className="flex-1">
                  <div className="text-base font-semibold text-text-primary">{rec.value}</div>
                  <div className="text-[11px] text-text-muted mt-0.5">{rec.meta}</div>
                </div>
                <span className="text-[10px] px-2 py-0.5 rounded-lg bg-[#e8f5ee] text-green font-medium">
                  正常
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Input Sheet */}
        <div className="bg-white mx-4 my-3 rounded-card p-4 shadow-card">
          <div className="text-base font-semibold text-text-primary mb-1">记录今日体重</div>
          <div className="text-xs text-text-muted mb-4">孕14周3天 · 3月15日</div>
          <div className="flex justify-center my-4">
            <LargeNumberInput
              value={weight}
              onChange={setWeight}
              unit="kg"
              className="max-w-[200px]"
            />
          </div>
          {/* BMI 计算提示 */}
          <div className="bg-[#fff8f3] rounded-input p-3 text-xs text-[#a06030] leading-relaxed mb-2.5 border border-[#ffe8d0]">
            BMI = {weight ? (parseFloat(weight) / (1.65 * 1.65)).toFixed(1) : '--'}（孕前 20.2 正常）
          </div>
          {/* 增重建议区间 */}
          <div className="bg-bg rounded-input p-3 text-xs text-text-secondary leading-relaxed mb-3.5">
            &#128204; 孕14周推荐增重：<strong>2.0~4.0 kg</strong> · 当前 +3.4 kg &#10003; 在正常范围内<br />
            全孕期建议增重：<strong>11.5~16 kg</strong>（基于孕前BMI 20.2）
          </div>
          <button onClick={handleSave} className="btn-primary">
            保存记录
          </button>
        </div>
      </div>
    </div>
  )
}
