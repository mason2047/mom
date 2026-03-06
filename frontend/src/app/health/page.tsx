'use client'

import { useRouter } from 'next/navigation'
import NavBar from '@/components/layout/NavBar'

/**
 * P18 - 健康综合看板
 * 展示体重/血压/血糖/胎儿估重概览，体重趋势图，快速记录入口
 */

const DASH_CARDS = [
  {
    icon: '&#9878;&#65039;',
    label: '体重',
    value: '58.4',
    unit: 'kg',
    trend: '较上次 +0.6kg',
    trendType: 'up' as const,
    route: '/health/weight',
  },
  {
    icon: '&#128137;',
    label: '血压',
    value: '128/82',
    unit: '',
    trend: '偏高，请关注',
    trendType: 'warn' as const,
    abnormal: true,
    route: '/health/blood-pressure',
  },
  {
    icon: '&#129656;',
    label: '血糖（空腹）',
    value: '4.8',
    unit: 'mmol/L',
    trend: '正常范围',
    trendType: 'ok' as const,
    route: '/health/blood-sugar',
  },
  {
    icon: '&#128118;',
    label: '胎儿估重',
    value: '320',
    unit: 'g',
    trend: '发育正常',
    trendType: 'ok' as const,
    route: '/health',
  },
]

const QUICK_ENTRIES = [
  { icon: '&#9878;&#65039;', label: '记录体重', route: '/health/weight' },
  { icon: '&#128137;', label: '记录血压', route: '/health/blood-pressure' },
  { icon: '&#129656;', label: '记录血糖', route: '/health/blood-sugar' },
  { icon: '&#129328;', label: '胎动计数', route: '/health/fetal-movement' },
]

export default function HealthPage() {
  const router = useRouter()

  return (
    <div className="flex flex-col min-h-screen bg-bg">
      <NavBar
        title="健康记录"
        onBack={() => router.push('/home')}
        rightContent={<span className="text-[13px] text-primary font-medium">历史</span>}
      />

      <div className="flex-1 overflow-y-auto hide-scrollbar">
        {/* Dashboard Hero */}
        <div className="bg-gradient-to-br from-[#fff6f0] to-[#fffaf5] px-5 py-4 border-b border-border">
          <div className="text-[13px] text-text-muted mb-1">孕14周3天 · 2026年3月15日</div>
          <div className="text-[15px] font-semibold text-text-primary mb-4">最近健康数据一览</div>
          <div className="grid grid-cols-2 gap-2.5">
            {DASH_CARDS.map((card) => (
              <button
                key={card.label}
                onClick={() => router.push(card.route)}
                className={`bg-white rounded-[14px] p-3.5 shadow-card text-left ${
                  card.abnormal ? 'border-[1.5px] border-[#ffe0e0] border-l-[3px] border-l-danger' : ''
                }`}
              >
                <div className="text-[22px] mb-1.5" dangerouslySetInnerHTML={{ __html: card.icon }} />
                <div className="text-[11px] text-text-muted mb-0.5">{card.label}</div>
                <div className={`text-lg font-bold ${card.abnormal ? 'text-primary text-[15px]' : 'text-text-primary'}`}>
                  {card.value}
                  {card.unit && <span className="text-[11px] text-text-muted ml-0.5">{card.unit}</span>}
                </div>
                <div
                  className={`text-[11px] mt-1 ${
                    card.trendType === 'ok'
                      ? 'text-green'
                      : card.trendType === 'warn'
                      ? 'text-danger'
                      : 'text-primary'
                  }`}
                >
                  {card.trendType === 'ok' ? '&#10003; ' : card.trendType === 'warn' ? '&#9888;&#65039; ' : '&#8593; '}
                  {card.trend}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Weight Chart Section */}
        <div className="p-4">
          <div className="flex items-center justify-between mb-3">
            <span className="text-[15px] font-semibold text-text-primary">&#9878;&#65039; 体重趋势</span>
            <button onClick={() => router.push('/health/weight')} className="text-xs text-primary">
              全部记录 &#8250;
            </button>
          </div>
          <div className="bg-white rounded-card p-4 shadow-card">
            <div className="flex gap-1.5 mb-3.5">
              {['近2周', '近1月', '全孕期'].map((tab, i) => (
                <button
                  key={tab}
                  className={`px-3 py-1 rounded-chip text-xs ${
                    i === 0 ? 'bg-primary text-white font-medium' : 'bg-bg text-text-muted'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>

            {/* Chart placeholder - using simplified SVG */}
            <div className="w-full h-[120px] relative">
              <svg viewBox="0 0 343 120" className="w-full h-full">
                <path d="M20,95 L323,40" stroke="#e8f5ee" strokeWidth="12" fill="none" strokeLinecap="round" />
                <path d="M20,105 L323,55" stroke="#f0ebe4" strokeWidth="8" fill="none" strokeLinecap="round" />
                <polyline
                  points="20,100 67,97 114,95 161,92 208,89 255,86 302,83"
                  stroke="#FF8C42"
                  strokeWidth="2.5"
                  fill="none"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                {[
                  [20, 100],
                  [67, 97],
                  [114, 95],
                  [161, 92],
                  [208, 89],
                  [255, 86],
                ].map(([cx, cy], i) => (
                  <circle key={i} cx={cx} cy={cy} r="4" fill="#FF8C42" />
                ))}
                <circle cx="302" cy="83" r="5" fill="#FF8C42" stroke="#fff" strokeWidth="2" />
                {['3/1', '3/3', '3/5', '3/7', '3/9', '3/11', '3/15'].map((d, i) => (
                  <text key={d} x={14 + i * 47} y="115" fontSize="9" fill="#aaa">
                    {d}
                  </text>
                ))}
              </svg>
            </div>

            <div className="flex gap-3.5 mt-2.5">
              <div className="flex items-center gap-1.5 text-[11px] text-text-muted">
                <div className="w-2 h-2 rounded-full bg-primary" />实际体重
              </div>
              <div className="flex items-center gap-1.5 text-[11px] text-text-muted">
                <div className="w-2 h-2 rounded-full bg-[#c8e8d4]" />推荐区间
              </div>
            </div>

            <div className="flex justify-between mt-2.5 pt-2.5 border-t border-border">
              <div className="text-center">
                <div className="text-[11px] text-text-muted">孕前体重</div>
                <div className="text-sm font-semibold text-text-primary">55.0 kg</div>
              </div>
              <div className="text-center">
                <div className="text-[11px] text-text-muted">当前增重</div>
                <div className="text-sm font-semibold text-primary">+3.4 kg</div>
              </div>
              <div className="text-center">
                <div className="text-[11px] text-text-muted">推荐增重范围</div>
                <div className="text-sm font-semibold text-green">+2~5 kg</div>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Entry */}
        <div className="px-4 pb-5">
          <div className="flex items-center justify-between mb-3">
            <span className="text-[15px] font-semibold text-text-primary">快速记录</span>
          </div>
          <div className="flex gap-2">
            {QUICK_ENTRIES.map((entry) => (
              <button
                key={entry.label}
                onClick={() => router.push(entry.route)}
                className="flex-1 bg-white rounded-[12px] p-3 text-center shadow-card active:scale-[0.96] transition-transform"
              >
                <div className="text-[22px] mb-1" dangerouslySetInnerHTML={{ __html: entry.icon }} />
                <div className="text-[11px] text-text-secondary">{entry.label}</div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
