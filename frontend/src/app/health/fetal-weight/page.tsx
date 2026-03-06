'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import NavBar from '@/components/layout/NavBar'

/**
 * P17 - 胎儿估重页
 * 包含：估重结果、发育评估、同孕周参考范围、生长曲线图、B超数据录入
 */

interface UltrasoundData {
  bpd: string  // 双顶径 mm
  hc: string   // 头围 mm
  ac: string   // 腹围 mm
  fl: string   // 股骨长 mm
}

interface GrowthDataPoint {
  week: number
  weight: number
}

// Mock 数据
const MOCK_ULTRASOUND: UltrasoundData = {
  bpd: '28.4',
  hc: '102.6',
  ac: '90.2',
  fl: '17.8',
}

const MOCK_GROWTH_DATA: GrowthDataPoint[] = [
  { week: 8, weight: 1 },
  { week: 11, weight: 14 },
  { week: 13, weight: 45 },
  { week: 14, weight: 320 },
]

// P10/P50/P90 参考值（简化）
const PERCENTILE_REFS: Record<number, { p10: number; p50: number; p90: number }> = {
  8: { p10: 0.5, p50: 1, p90: 2 },
  11: { p10: 5, p50: 10, p90: 18 },
  13: { p10: 15, p50: 30, p90: 55 },
  14: { p10: 240, p50: 325, p90: 430 },
}

export default function FetalWeightPage() {
  const router = useRouter()
  const [ultrasound, setUltrasound] = useState<UltrasoundData>(MOCK_ULTRASOUND)
  const estimatedWeight = 320
  const percentileRange = 'P35~P65'
  const status: 'normal' | 'small' | 'large' = 'normal'
  const currentWeek = 14

  // 参考范围
  const refs = PERCENTILE_REFS[currentWeek] || { p10: 240, p50: 325, p90: 430 }
  const positionPercent = Math.min(
    100,
    Math.max(0, ((estimatedWeight - refs.p10) / (refs.p90 - refs.p10)) * 100)
  )

  // 斤两换算
  const jin = Math.floor(estimatedWeight / 500)
  const liang = Math.round((estimatedWeight % 500) / 50)

  const statusConfig = {
    normal: { label: '发育正常', badgeClass: 'bg-green-50 text-green' },
    small: { label: '偏小', badgeClass: 'bg-blue-100 text-blue' },
    large: { label: '偏大', badgeClass: 'bg-primary-100 text-primary' },
  }

  const handleInputChange = (field: keyof UltrasoundData, value: string) => {
    setUltrasound((prev) => ({ ...prev, [field]: value }))
  }

  return (
    <div className="flex flex-col min-h-screen bg-bg">
      <NavBar
        title="胎儿估重"
        onBack={() => router.back()}
        rightContent={
          <span className="text-[13px] text-primary font-medium">录入</span>
        }
      />

      <div className="flex-1 overflow-y-auto hide-scrollbar">
        {/* 估重结果英雄区 */}
        <div className="bg-gradient-to-br from-[#f0f4ff] to-[#f8f0ff] px-5 py-5 text-center border-b border-[#e8e0f0]">
          <div className="text-xs text-purple mb-1.5">
            孕{currentWeek}周 · 3月13日 B超数据
          </div>
          <div className="text-[48px] font-extrabold text-text-primary leading-none mb-1">
            {estimatedWeight}
            <span className="text-lg font-semibold text-text-muted ml-1">g</span>
          </div>
          <div className="text-sm text-purple font-medium mb-2">
            约 {jin}斤 {liang}两
          </div>
          <div className={`inline-block px-3 py-1 rounded-chip text-xs font-semibold ${statusConfig[status].badgeClass}`}>
            &#10003; {statusConfig[status].label}（{percentileRange}）
          </div>
          <div className="text-[11px] text-text-muted mt-2">
            同孕周参考范围：P10 &#8776; {refs.p10}g · P90 &#8776; {refs.p90}g
          </div>
        </div>

        {/* 同孕周参考范围进度条 */}
        <div className="px-5 py-4 bg-white border-b border-border">
          <div className="text-xs text-text-secondary font-medium mb-2.5">
            当前体重在同孕周中的位置
          </div>
          <div className="relative h-2 rounded bg-gradient-to-r from-blue-200 via-green-100 to-primary-200 mb-2">
            {/* 指示器 */}
            <div
              className="absolute top-[-3px] w-[14px] h-[14px] rounded-full bg-purple border-2 border-white shadow-md transform -translate-x-1/2"
              style={{ left: `${positionPercent}%` }}
            />
          </div>
          <div className="flex justify-between text-[10px] text-text-muted">
            <span>
              偏小 (&lt;P10)<br />{refs.p10}g
            </span>
            <span className="text-center">
              P50<br />{refs.p50}g
            </span>
            <span className="text-right">
              偏大 (&gt;P90)<br />{refs.p90}g
            </span>
          </div>
        </div>

        {/* 胎儿生长曲线 */}
        <div className="px-4 py-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-[15px] font-semibold text-text-primary">胎儿生长曲线</h3>
            <span className="text-[11px] text-text-muted">参考WHO/中国标准</span>
          </div>
          <div className="bg-white rounded-card p-4 shadow-card">
            <svg width="100%" height="130" viewBox="0 0 343 130">
              {/* P10~P90 区间带 */}
              <path
                d="M20,120 C60,115 100,108 140,98 C180,88 220,72 260,55 C280,47 300,38 323,28"
                stroke="#e8e0f5"
                strokeWidth="12"
                fill="none"
                opacity="0.5"
              />
              <path
                d="M20,108 C60,100 100,90 140,78 C180,64 220,48 260,32 C280,24 300,16 323,10"
                stroke="#e8e0f5"
                strokeWidth="8"
                fill="none"
                opacity="0.4"
              />
              {/* P50 中位线 */}
              <path
                d="M20,114 C60,107 100,99 140,88 C180,76 220,60 260,43 C280,36 300,27 323,19"
                stroke="#c8b8e8"
                strokeWidth="1.5"
                strokeDasharray="4,3"
                fill="none"
              />
              {/* 用户数据点 */}
              <polyline
                points="68,118 136,112 204,100 272,83"
                stroke="#9B6FD4"
                strokeWidth="2"
                fill="none"
                strokeLinecap="round"
              />
              {MOCK_GROWTH_DATA.map((point, i) => {
                const cx = [68, 136, 204, 272][i]
                const cy = [118, 112, 100, 83][i]
                const isLast = i === MOCK_GROWTH_DATA.length - 1
                return (
                  <circle
                    key={point.week}
                    cx={cx}
                    cy={cy}
                    r={isLast ? 6 : 5}
                    fill="#9B6FD4"
                    stroke="#fff"
                    strokeWidth="2"
                  />
                )
              })}
              {/* 当前标注 */}
              <text x="263" y="78" fontSize="9" fill="#9B6FD4">
                {estimatedWeight}g
              </text>
              {/* X 轴标签 */}
              <text x="55" y="128" fontSize="9" fill="#aaa">8周</text>
              <text x="123" y="128" fontSize="9" fill="#aaa">11周</text>
              <text x="191" y="128" fontSize="9" fill="#aaa">13周</text>
              <text x="259" y="128" fontSize="9" fill="#aaa">14周</text>
              <text x="298" y="128" fontSize="9" fill="#aaa">&#8594;42周</text>
            </svg>
            {/* 图例 */}
            <div className="flex gap-3.5 mt-2.5">
              <div className="flex items-center gap-1.5 text-[11px] text-text-muted">
                <div className="w-2 h-2 rounded-full bg-purple" />
                宝宝体重
              </div>
              <div className="flex items-center gap-1.5 text-[11px] text-text-muted">
                <div className="w-2 h-2 rounded-full bg-purple-200" />
                P50标准
              </div>
              <div className="flex items-center gap-1.5 text-[11px] text-text-muted">
                <div className="w-2 h-2 rounded-full bg-purple-100" />
                P10~P90范围
              </div>
            </div>
          </div>
        </div>

        {/* B超数据录入表单 */}
        <div className="mx-4 mb-4 bg-white rounded-card p-4 shadow-card">
          <div className="text-sm font-semibold text-text-primary mb-1">
            录入B超数据（Hadlock公式）
          </div>
          <div className="text-[11px] text-text-muted mb-3.5">
            数据来源：B超报告，可AI自动提取
          </div>
          {/* Hadlock 公式说明 */}
          <div className="bg-[#f5f1ec] rounded-input px-3 py-2 mb-3.5 text-[10px] text-text-tertiary leading-relaxed font-mono break-all">
            log&#8321;&#8320;(EFW) = 1.3596 + 0.0064&#215;HC + 0.0424&#215;AC + 0.174&#215;FL + 0.00061&#215;BPD&#215;AC - 0.00386&#215;AC&#215;FL
          </div>

          {/* 四个输入框 */}
          <div className="grid grid-cols-2 gap-2.5 mb-3">
            {[
              { key: 'bpd' as const, label: '双顶径 BPD (mm)', required: true },
              { key: 'hc' as const, label: '头围 HC (mm)', required: false },
              { key: 'ac' as const, label: '腹围 AC (mm)', required: true },
              { key: 'fl' as const, label: '股骨长 FL (mm)', required: true },
            ].map((field) => (
              <div key={field.key}>
                <div className="text-xs text-text-secondary mb-1">
                  {field.label} {field.required && <span className="text-primary">*</span>}
                </div>
                <input
                  type="text"
                  value={ultrasound[field.key]}
                  onChange={(e) => handleInputChange(field.key, e.target.value)}
                  className={`w-full h-10 rounded-button border-[1.5px] px-2.5 text-[15px] font-semibold text-center outline-none ${
                    ultrasound[field.key] ? 'border-primary bg-white' : 'border-border-dark bg-[#fafaf8]'
                  }`}
                />
              </div>
            ))}
          </div>

          {/* 操作按钮 */}
          <div className="flex gap-2 mt-3">
            <button className="flex-1 h-[42px] rounded-input bg-[#f0f4ff] text-blue text-[13px] font-medium">
              &#128247; AI识别B超报告
            </button>
            <button className="flex-1 h-[42px] rounded-input bg-primary text-white text-[13px] font-semibold">
              计算估重
            </button>
          </div>

          <p className="text-[10px] text-text-light text-center mt-2">
            &#9888; 胎儿估重仅供参考，误差&#177;15%，以产科医生超声评估为准
          </p>
        </div>
      </div>
    </div>
  )
}
