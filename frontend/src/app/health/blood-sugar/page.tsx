'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import NavBar from '@/components/layout/NavBar'
import Chip from '@/components/ui/Chip'

/**
 * P15 - 血糖记录页
 * 空腹/餐后1h/餐后2h标签页，标准线趋势图，录入区
 */

type MeasureTime = 'fasting' | 'post1h' | 'post2h'

const TIME_LABELS: { key: MeasureTime; label: string }[] = [
  { key: 'fasting', label: '空腹' },
  { key: 'post1h', label: '餐后1h' },
  { key: 'post2h', label: '餐后2h' },
]

const STANDARDS: Record<MeasureTime, string> = {
  fasting: '孕期空腹血糖标准：< 5.1 mmol/L',
  post1h: '孕期餐后1h血糖标准：< 10.0 mmol/L',
  post2h: '孕期餐后2h血糖标准：< 8.5 mmol/L',
}

const MOCK_RECORDS = [
  { day: 15, month: '3月', value: '4.8', meta: '空腹 · 07:30', status: 'normal' },
  { day: 14, month: '3月', value: '5.0', meta: '空腹 · 07:20', status: 'normal' },
]

export default function BloodSugarPage() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState<MeasureTime>('fasting')
  const [bloodSugar, setBloodSugar] = useState('4.8')
  const [measureTime, setMeasureTime] = useState<MeasureTime>('fasting')

  const handleSave = () => {
    // TODO: healthApi.addBloodSugarRecord
  }

  return (
    <div className="flex flex-col min-h-screen bg-bg">
      <NavBar title="血糖记录" onBack={() => router.back()} />

      <div className="flex-1 overflow-y-auto hide-scrollbar">
        {/* Type Tabs */}
        <div className="flex bg-white px-4 py-2.5 gap-1.5 border-b border-border">
          {TIME_LABELS.map((t) => (
            <button
              key={t.key}
              onClick={() => setActiveTab(t.key)}
              className={`flex-1 text-center px-3 py-1 rounded-chip text-xs ${
                activeTab === t.key ? 'bg-primary text-white font-medium' : 'bg-bg text-text-muted'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* Standard Info */}
        <div className="bg-[#f0f9ff] px-5 py-2.5 flex justify-between items-center">
          <span className="text-xs text-[#4a8aad]">{STANDARDS[activeTab]}</span>
          <span className="text-[11px] text-[#7ab0d0]">来自ADA指南</span>
        </div>

        {/* Chart */}
        <div className="p-4 pt-3">
          <div className="bg-white rounded-card p-4 shadow-card">
            <div className="w-full h-[120px]">
              <svg viewBox="0 0 343 120" className="w-full h-full">
                <line x1="10" y1="35" x2="333" y2="35" stroke="#ffe0e0" strokeWidth="1.5" strokeDasharray="5,3" />
                <text x="270" y="32" fontSize="9" fill="#E05252">上限 5.1</text>
                <polyline
                  points="30,65 90,60 150,62 210,58 270,55 323,55"
                  stroke="#5B8BF5"
                  strokeWidth="2.5"
                  fill="none"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                {[
                  [30, 65],
                  [90, 60],
                  [150, 62],
                  [210, 58],
                  [270, 55],
                ].map(([cx, cy], i) => (
                  <circle key={i} cx={cx} cy={cy} r="4" fill="#5B8BF5" />
                ))}
                <circle cx="323" cy="55" r="5" fill="#5B8BF5" stroke="#fff" strokeWidth="2" />
                {['4.9', '5.0', '4.9', '5.0', '5.0', '4.8'].map((v, i) => (
                  <text key={i} x={18 + i * 60} y={58 + [0, -5, -3, -7, -10, -10][i]} fontSize="9" fill="#5B8BF5">{v}</text>
                ))}
                {['3/10', '3/11', '3/12', '3/13', '3/14', '3/15'].map((d, i) => (
                  <text key={d} x={24 + i * 60} y="112" fontSize="9" fill="#aaa">{d}</text>
                ))}
              </svg>
            </div>
          </div>
        </div>

        {/* Records */}
        <div className="px-4 pb-2">
          <div className="flex items-center justify-between mb-2.5">
            <span className="text-[15px] font-semibold text-text-primary">空腹血糖记录</span>
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
                  <div className="text-base font-semibold text-text-primary">
                    {rec.value} <span className="text-[11px] text-text-muted">mmol/L</span>
                  </div>
                  <div className="text-[11px] text-text-muted mt-0.5">{rec.meta}</div>
                </div>
                <span className="text-[10px] px-2 py-0.5 rounded-lg bg-[#e8f5ee] text-green font-medium">正常</span>
              </div>
            ))}
          </div>
        </div>

        {/* Input Sheet */}
        <div className="bg-white mx-4 my-2 rounded-card p-4 shadow-card">
          <div className="text-base font-semibold text-text-primary mb-3">记录血糖值</div>
          <div className="flex items-center gap-2 mb-3.5">
            <span className="text-[13px] text-text-secondary w-[60px]">测量时机</span>
            <div className="flex gap-1.5">
              {TIME_LABELS.map((t) => (
                <Chip
                  key={t.key}
                  label={t.label}
                  active={measureTime === t.key}
                  onClick={() => setMeasureTime(t.key)}
                  variant="blue"
                />
              ))}
            </div>
          </div>
          <div className="flex items-baseline justify-center gap-2 my-4">
            <input
              type="number"
              className="text-5xl font-bold text-primary bg-transparent border-none outline-none text-center w-[120px]"
              value={bloodSugar}
              onChange={(e) => setBloodSugar(e.target.value)}
              step="0.1"
            />
            <span className="text-lg text-text-muted font-medium">mmol/L</span>
          </div>
          <div className="bg-bg rounded-input p-3 text-xs text-text-secondary leading-relaxed mb-3.5">
            孕期血糖标准：空腹 &lt;5.1 | 餐后1h &lt;10.0 | 餐后2h &lt;8.5
          </div>
          <button onClick={handleSave} className="btn-primary">
            保存记录
          </button>
        </div>
      </div>
    </div>
  )
}
