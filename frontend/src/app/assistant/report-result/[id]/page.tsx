import Link from 'next/link'
import NavBar from '@/components/layout/NavBar'
import IndicatorProgressBar from '@/components/business/IndicatorProgressBar'
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
  date: '2026-03-06 · 孕14周产检',
  normalCount: 8,
  warnCount: 2,
  alertCount: 0,
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
  return (
    <div className="flex flex-col min-h-screen bg-bg">
      <NavBar
        title="报告解读"
        backHref="/assistant"
        rightContent={<span className="text-[13px] text-primary font-medium">分享</span>}
      />

      <div className="flex-1 overflow-y-auto hide-scrollbar">
        {/* Summary Card - P11 */}
        <div className="px-4 pt-3.5">
          <div className="bg-white rounded-[14px] p-3.5 shadow-card mb-3">
            <div className="flex items-center gap-2 mb-2.5">
              <span className="text-[24px]">&#129656;</span>
              <div>
                <div className="text-sm font-extrabold text-text-primary">{MOCK_SUMMARY.reportType}</div>
                <div className="text-[11px] text-text-muted">{MOCK_SUMMARY.date}</div>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-2">
              <div className="bg-bg rounded-[10px] p-2 text-center">
                <div className="text-xl font-extrabold text-text-primary">{MOCK_SUMMARY.normalCount}</div>
                <div className="text-[10px] text-text-muted">指标正常</div>
              </div>
              <div className="bg-[#fff3e0] rounded-[10px] p-2 text-center">
                <div className="text-xl font-extrabold text-primary">{MOCK_SUMMARY.warnCount}</div>
                <div className="text-[10px] text-text-muted">偏低关注</div>
              </div>
              <div className="bg-bg rounded-[10px] p-2 text-center">
                <div className="text-xl font-extrabold text-text-primary">{MOCK_SUMMARY.alertCount}</div>
                <div className="text-[10px] text-text-muted">明显异常</div>
              </div>
            </div>
          </div>
        </div>

        {/* AI Overall Assessment - P11 */}
        <div className="mx-4 bg-white rounded-[14px] p-3 border-l-4 border-primary shadow-card mb-3">
          <div className="text-xs font-bold text-primary mb-1.5">&#129302; MOM助手综合解读</div>
          <div className="text-xs text-text-secondary leading-[1.7]">
            本次血常规整体<strong>基本正常</strong>，有两项轻微偏低（血红蛋白、红细胞），孕期因血容量增加导致生理性贫血是正常现象，暂无需特别担心，但建议适当增加铁质摄入，在下次产检时与医生确认是否需要补铁剂。
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

        {/* Historical Trend Chart - P11 design */}
        <div className="px-4 mb-3">
          <div className="bg-white rounded-card p-3.5 shadow-card">
            <div className="text-xs font-bold text-text-primary mb-2">
              &#128200; 历史对比：血红蛋白趋势
            </div>
            <div className="flex items-end gap-1.5 h-[50px] mb-2">
              {[
                { value: 112, week: '孕11周', highlight: false },
                { value: 108, week: '孕13周', highlight: false },
                { value: 105, week: '孕14周', highlight: true },
              ].map((bar, i) => (
                <div key={i} className="flex-1 flex flex-col items-center gap-0.5">
                  <div className={`text-[9px] font-semibold ${bar.highlight ? 'text-[#1565c0] font-bold' : 'text-text-muted'}`}>
                    {bar.value}
                  </div>
                  <div
                    className="w-full rounded-t-[4px]"
                    style={{
                      background: bar.highlight ? '#1565c0' : i === 0 ? '#bbdefb' : '#90caf9',
                      height: `${(bar.value - 100) * 3}px`,
                    }}
                  />
                  <div className={`text-[9px] ${bar.highlight ? 'text-[#1565c0] font-bold' : 'text-text-muted'}`}>
                    {bar.week}{bar.highlight && '\u2193'}
                  </div>
                </div>
              ))}
            </div>
            <div className="text-[11px] text-text-muted">
              轻微下降趋势，属孕期生理性贫血，注意补铁
            </div>
          </div>
        </div>

        {/* Suggestion */}
        <div className="mx-4 mb-5 bg-[#fff8f3] border-l-[3px] border-primary rounded-r-[12px] px-3.5 py-3">
          <div className="text-xs text-[#a06030] leading-relaxed">
            <strong>&#128161; 建议：</strong>报告解读仅供参考。如有指标异常，请在下次产检时将报告交给医生做进一步评估。如有不适症状，请及时就医。
          </div>
        </div>
      </div>

      {/* Bottom Actions - P11 */}
      <div className="flex gap-2.5 p-4 bg-white border-t border-border">
        <button className="flex-1 h-[46px] rounded-[12px] border-[1.5px] border-primary-400 bg-white text-xs font-bold text-primary flex items-center justify-center">
          分享给医生
        </button>
        <Link
          href="/assistant"
          className="flex-1 h-[46px] rounded-[12px] bg-gradient-to-r from-primary-400 to-primary text-white text-xs font-bold flex items-center justify-center shadow-button"
        >
          继续提问
        </Link>
      </div>
    </div>
  )
}
