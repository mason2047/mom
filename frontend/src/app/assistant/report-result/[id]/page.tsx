'use client'

import { useRouter } from 'next/navigation'
import NavBar from '@/components/layout/NavBar'
import IndicatorProgressBar from '@/components/business/IndicatorProgressBar'
import IndicatorTrendChart from '@/components/business/IndicatorTrendChart'
import type { IndicatorStatus } from '@/types'

/**
 * AI报告解读结果页
 * 展示报告摘要、各指标解读、异常提醒、建议
 */

interface IndicatorItem {
  name: string
  value: string
  unit: string
  reference: string
  status: 'normal' | 'high' | 'low'
  explanation: string
  barPercent: number
}

const MOCK_SUMMARY = {
  reportType: '血常规',
  date: '2026年3月7日',
  totalItems: 18,
  normalCount: 16,
  abnormalCount: 2,
}

const MOCK_INDICATORS: IndicatorItem[] = [
  {
    name: '血红蛋白（Hb）',
    value: '105',
    unit: 'g/L',
    reference: '110-150',
    status: 'low',
    explanation: '略低于正常值，孕期血液稀释可导致生理性贫血。建议适量补铁，多吃动物肝脏、红肉、菠菜。若持续下降请告知产检医生。',
    barPercent: 65,
  },
  {
    name: '白细胞计数（WBC）',
    value: '11.2',
    unit: '10^9/L',
    reference: '4.0-10.0',
    status: 'high',
    explanation: '孕期白细胞偏高属于正常生理现象，通常可达12-15。但如果伴有发热、咳嗽等症状，需排除感染。',
    barPercent: 72,
  },
  {
    name: '血小板（PLT）',
    value: '228',
    unit: '10^9/L',
    reference: '100-300',
    status: 'normal',
    explanation: '血小板计数正常，凝血功能良好。',
    barPercent: 55,
  },
  {
    name: '红细胞（RBC）',
    value: '3.85',
    unit: '10^12/L',
    reference: '3.5-5.0',
    status: 'normal',
    explanation: '红细胞数量在正常范围内。',
    barPercent: 40,
  },
]

const STATUS_CONFIG = {
  normal: { label: '正常', bgClass: 'bg-[#e8f5ee]', textClass: 'text-green', borderClass: '' },
  high: { label: '偏高', bgClass: 'bg-[#fff3eb]', textClass: 'text-primary', borderClass: 'border-[#fff3eb]' },
  low: { label: '偏低', bgClass: 'bg-[#fef0f0]', textClass: 'text-danger', borderClass: 'border-[#fef0f0]' },
}

export default function ReportResultPage() {
  const router = useRouter()

  return (
    <div className="flex flex-col min-h-screen bg-bg">
      <NavBar
        title="报告解读"
        onBack={() => router.back()}
        rightContent={<span className="text-[13px] text-primary font-medium">分享</span>}
      />

      <div className="flex-1 overflow-y-auto hide-scrollbar">
        {/* Summary Card */}
        <div className="bg-gradient-to-br from-[#fdf0e0] to-[#fce8cc] px-5 py-5 border-b border-border">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-3xl">&#128202;</span>
            <div>
              <h2 className="text-lg font-bold text-[#3d1f00]">
                {MOCK_SUMMARY.reportType} 解读报告
              </h2>
              <p className="text-xs text-[#8a5a30]">{MOCK_SUMMARY.date}</p>
            </div>
          </div>
          <div className="bg-white/70 rounded-[14px] px-4 py-3 flex backdrop-blur-sm">
            <div className="flex-1 text-center border-r border-primary/15">
              <div className="text-xl font-extrabold text-text-primary">{MOCK_SUMMARY.totalItems}</div>
              <div className="text-[11px] text-text-muted">检测项目</div>
            </div>
            <div className="flex-1 text-center border-r border-primary/15">
              <div className="text-xl font-extrabold text-green">{MOCK_SUMMARY.normalCount}</div>
              <div className="text-[11px] text-text-muted">正常</div>
            </div>
            <div className="flex-1 text-center">
              <div className="text-xl font-extrabold text-danger">{MOCK_SUMMARY.abnormalCount}</div>
              <div className="text-[11px] text-text-muted">异常</div>
            </div>
          </div>
        </div>

        {/* AI Summary */}
        <div className="mx-4 mt-3 bg-[#f0faf5] border-l-[3px] border-teal rounded-r-[12px] px-3.5 py-3">
          <div className="text-xs font-semibold text-[#1a6a50] mb-1">&#129302; AI总结</div>
          <div className="text-xs text-[#2a6a50] leading-relaxed">
            本次血常规整体正常。血红蛋白略低（105 g/L），属于孕期轻度贫血，建议加强铁剂补充。白细胞偏高属于孕期正常生理现象。其余指标均在正常范围内，无需特别担心。
          </div>
        </div>

        {/* Indicator Cards */}
        <div className="p-4">
          <h3 className="text-sm font-semibold text-text-primary mb-3">&#128203; 详细指标</h3>
          <div className="flex flex-col gap-2.5">
            {MOCK_INDICATORS.map((indicator) => {
              const config = STATUS_CONFIG[indicator.status]
              return (
                <div
                  key={indicator.name}
                  className={`bg-white rounded-card p-3.5 shadow-card ${
                    indicator.status !== 'normal' ? `border-[1.5px] ${config.borderClass}` : ''
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-semibold text-text-primary">{indicator.name}</span>
                    <span className={`text-[10px] px-2 py-0.5 rounded-lg font-medium ${config.bgClass} ${config.textClass}`}>
                      {config.label}
                    </span>
                  </div>
                  <div className="flex items-baseline gap-2 mb-2">
                    <span className={`text-2xl font-bold ${config.textClass}`}>{indicator.value}</span>
                    <span className="text-xs text-text-muted">{indicator.unit}</span>
                    <span className="text-[11px] text-text-light ml-auto">参考: {indicator.reference}</span>
                  </div>
                  <IndicatorProgressBar
                    barPercent={indicator.barPercent}
                    status={indicator.status as IndicatorStatus}
                    referenceRange={indicator.reference}
                  />
                  <p className="text-xs text-text-secondary leading-relaxed bg-bg rounded-lg p-2.5">
                    {indicator.explanation}
                  </p>
                </div>
              )
            })}
          </div>
        </div>

        {/* Historical Trend Chart */}
        <div className="px-4 mb-3">
          <IndicatorTrendChart
            title="血红蛋白 (Hb)"
            unit="g/L"
            data={[
              { week: 10, value: 115 },
              { week: 11, value: 112 },
              { week: 12, value: 110 },
              { week: 13, value: 108 },
              { week: 14, value: 105 },
            ]}
            trendDesc="近5周呈缓慢下降趋势，属于孕期生理性变化，建议加强铁剂补充。"
          />
        </div>

        {/* Suggestion */}
        <div className="mx-4 mb-5 bg-[#fff8f3] border-l-[3px] border-primary rounded-r-[12px] px-3.5 py-3">
          <div className="text-xs text-[#a06030] leading-relaxed">
            <strong>&#128161; 建议：</strong>报告解读仅供参考。如有指标异常，请在下次产检时将报告交给医生做进一步评估。如有不适症状，请及时就医。
          </div>
        </div>
      </div>

      {/* Bottom Actions */}
      <div className="flex gap-2.5 p-4 bg-white border-t border-border">
        <button
          onClick={() => router.push('/assistant')}
          className="flex-1 h-[46px] rounded-[12px] border-[1.5px] border-border-dark bg-white text-[15px] font-semibold text-text-secondary"
        >
          &#128172; 继续提问
        </button>
        <button
          onClick={() => router.push('/checkup')}
          className="flex-1 h-[46px] rounded-[12px] bg-primary text-white text-[15px] font-semibold"
        >
          查看产检计划
        </button>
      </div>
    </div>
  )
}
