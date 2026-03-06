'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import NavBar from '@/components/layout/NavBar'

/**
 * P14 - 血压记录页
 * 异常警告栏，趋势图（收缩压+舒张压双线），记录列表，录入区
 */

const MOCK_RECORDS = [
  { day: 15, month: '3月', value: '128 / 82', meta: '上午 10:30 · 坐姿休息后测量', status: 'warn', highlight: true },
  { day: 14, month: '3月', value: '118 / 76', meta: '下午 3:00', status: 'normal', highlight: false },
  { day: 12, month: '3月', value: '115 / 74', meta: '早晨空腹', status: 'normal', highlight: false },
]

export default function BloodPressurePage() {
  const router = useRouter()
  const [systolic, setSystolic] = useState('128')
  const [diastolic, setDiastolic] = useState('82')

  const handleSave = () => {
    // TODO: healthApi.addBloodPressureRecord
  }

  return (
    <div className="flex flex-col min-h-screen bg-bg">
      <NavBar title="血压记录" onBack={() => router.back()} />

      <div className="flex-1 overflow-y-auto hide-scrollbar">
        {/* Warning Banner */}
        <div className="bg-[#fff3eb] px-5 py-2.5 border-b border-[#ffe8cc] flex items-center gap-2">
          <span className="text-lg">&#9888;&#65039;</span>
          <div className="flex-1">
            <div className="text-[13px] font-semibold text-[#a06030]">最近一次血压偏高</div>
            <div className="text-[11px] text-[#c08040] mt-0.5">
              收缩压128 mmHg，建议休息后复测，持续偏高请就医
            </div>
          </div>
        </div>

        {/* Chart */}
        <div className="p-4">
          <div className="bg-white rounded-card p-4 shadow-card">
            <div className="w-full h-[120px]">
              <svg viewBox="0 0 343 120" className="w-full h-full">
                <line x1="10" y1="22" x2="333" y2="22" stroke="#ffe0e0" strokeWidth="1" strokeDasharray="4,3" />
                <text x="280" y="19" fontSize="9" fill="#e05252">警戒 140</text>
                <line x1="10" y1="48" x2="333" y2="48" stroke="#ffe8cc" strokeWidth="1" strokeDasharray="4,3" />
                <text x="280" y="45" fontSize="9" fill="#FF8C42">注意 120</text>
                <polyline
                  points="30,60 90,55 150,52 210,58 270,56 323,50"
                  stroke="#5B8BF5"
                  strokeWidth="2.5"
                  fill="none"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <polyline
                  points="30,88 90,85 150,84 210,90 270,88 323,83"
                  stroke="#9B6FD4"
                  strokeWidth="2"
                  fill="none"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <circle cx="323" cy="50" r="5" fill="#5B8BF5" stroke="#fff" strokeWidth="2" />
                <circle cx="323" cy="83" r="5" fill="#9B6FD4" stroke="#fff" strokeWidth="2" />
                {['3/8', '3/10', '3/12', '3/13', '3/14', '3/15'].map((d, i) => (
                  <text key={d} x={24 + i * 60} y="112" fontSize="9" fill="#aaa">{d}</text>
                ))}
              </svg>
            </div>
            <div className="flex gap-3.5 mt-2.5">
              <div className="flex items-center gap-1.5 text-[11px] text-text-muted">
                <div className="w-2 h-2 rounded-full bg-blue" />收缩压
              </div>
              <div className="flex items-center gap-1.5 text-[11px] text-text-muted">
                <div className="w-2 h-2 rounded-full bg-purple" />舒张压
              </div>
            </div>
          </div>
        </div>

        {/* Records */}
        <div className="px-4 pb-2">
          <div className="flex items-center justify-between mb-2.5">
            <span className="text-[15px] font-semibold text-text-primary">血压记录</span>
            <span className="text-xs text-primary">+ 新增</span>
          </div>
          <div className="flex flex-col gap-2">
            {MOCK_RECORDS.map((rec) => (
              <div
                key={`${rec.month}${rec.day}`}
                className={`bg-white rounded-[12px] px-3.5 py-3 flex items-center gap-3 shadow-card ${
                  rec.highlight ? 'border-[1.5px] border-[#fff3eb]' : ''
                }`}
              >
                <div className="w-[52px] text-center flex-shrink-0">
                  <span className="text-[17px] font-bold text-text-primary block">{rec.day}</span>
                  <span className="text-[10px] text-text-muted">{rec.month}</span>
                </div>
                <div className="w-px h-8 bg-border" />
                <div className="flex-1">
                  <div className={`text-base font-semibold ${rec.highlight ? 'text-primary' : 'text-text-primary'}`}>
                    {rec.value} <span className="text-[11px] text-text-muted">mmHg</span>
                  </div>
                  <div className="text-[11px] text-text-muted mt-0.5">{rec.meta}</div>
                </div>
                <span
                  className={`text-[10px] px-2 py-0.5 rounded-lg font-medium ${
                    rec.status === 'warn' ? 'bg-[#fff3eb] text-primary' : 'bg-[#e8f5ee] text-green'
                  }`}
                >
                  {rec.status === 'warn' ? '偏高' : '正常'}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Input Sheet */}
        <div className="bg-white mx-4 my-3 rounded-card p-4 shadow-card">
          <div className="text-base font-semibold text-text-primary mb-4">记录血压</div>
          <div className="flex gap-2.5 items-center mb-2">
            <input
              type="number"
              className="flex-1 text-center h-[50px] rounded-[12px] border-[1.5px] border-primary text-[22px] font-bold text-text-primary bg-[#fafaf8] outline-none"
              value={systolic}
              onChange={(e) => setSystolic(e.target.value)}
            />
            <span className="text-lg text-text-muted px-1">/</span>
            <input
              type="number"
              className="flex-1 text-center h-[50px] rounded-[12px] border-[1.5px] border-border-dark text-[22px] font-bold text-text-primary bg-[#fafaf8] outline-none focus:border-primary"
              value={diastolic}
              onChange={(e) => setDiastolic(e.target.value)}
            />
            <span className="text-[13px] text-text-muted pl-2">mmHg</span>
          </div>
          <div className="flex mb-3.5">
            <div className="flex-1 text-center text-xs text-text-muted">收缩压（高压）</div>
            <div className="w-8" />
            <div className="flex-1 text-center text-xs text-text-muted">舒张压（低压）</div>
            <div className="w-12" />
          </div>
          <div className="bg-bg rounded-input p-3 text-xs text-text-secondary leading-relaxed mb-3.5">
            &#128204; 孕期正常血压：&lt;120/80 mmHg<br />
            注意区间：120-139/80-89 · 警戒：&#8805;140/90
          </div>
          <button onClick={handleSave} className="btn-primary">
            保存记录
          </button>
        </div>
      </div>
    </div>
  )
}
