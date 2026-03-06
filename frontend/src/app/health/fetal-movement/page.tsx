'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import NavBar from '@/components/layout/NavBar'

/**
 * P16 - 胎动计数页
 * 大按钮计数，实时计时，统计面板，历史记录
 */

const MOCK_HISTORY = [
  { date: '3月14日', time: '20:00~21:00', week: '孕14周2天', count: 12, status: 'normal' },
  { date: '3月13日', time: '20:30~21:30', week: '孕14周1天', count: 8, status: 'normal' },
  { date: '3月12日', time: '21:00~22:00', week: '孕14周0天', count: 10, status: 'normal' },
]

export default function FetalMovementPage() {
  const router = useRouter()
  const [count, setCount] = useState(7)
  const [elapsedSeconds, setElapsedSeconds] = useState(42 * 60 + 18)
  const [isRunning, setIsRunning] = useState(true)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    if (isRunning) {
      intervalRef.current = setInterval(() => {
        setElapsedSeconds((s) => s + 1)
      }, 1000)
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current)
    }
  }, [isRunning])

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60)
    const s = seconds % 60
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`
  }

  const handleKick = () => {
    setCount((c) => c + 1)
  }

  return (
    <div className="flex flex-col min-h-screen bg-bg">
      <NavBar
        title="胎动计数"
        onBack={() => router.back()}
        rightContent={<span className="text-[13px] text-primary font-medium">历史</span>}
      />

      <div className="flex-1 overflow-y-auto hide-scrollbar">
        {/* Hero */}
        <div className="bg-gradient-to-br from-[#f0f8ff] to-[#e8f4ff] px-5 py-6 text-center border-b border-[#e0ecff]">
          <div className="text-[13px] text-blue mb-2">
            今日 · 10:00~11:00 · 计时中 {formatTime(elapsedSeconds)}
          </div>
          <div className="text-[56px] font-extrabold text-blue leading-none">{count}</div>
          <div className="text-[13px] text-[#8aabf0] mt-1 mb-4">本小时胎动次数</div>
          <button
            onClick={handleKick}
            className="w-[100px] h-[100px] rounded-full bg-blue text-white text-sm font-semibold mx-auto flex items-center justify-center shadow-[0_6px_24px_rgba(91,139,245,0.4)] active:scale-[0.93] transition-transform"
          >
            &#128118;<br />记录胎动
          </button>
          <div className="text-xs text-[#8aabf0] mt-2">每感受到一次胎动，点击上方按钮</div>
        </div>

        {/* Stats */}
        <div className="flex gap-2.5 px-5 py-3 bg-white">
          {[
            { value: String(count), label: '本次已记录', color: 'text-blue' },
            { value: '>=3~5', label: '1小时正常参考', color: 'text-text-primary' },
            { value: '&#10003; 正常', label: '当前评估', color: 'text-green' },
          ].map((stat) => (
            <div key={stat.label} className="flex-1 text-center bg-bg rounded-[12px] py-3">
              <div
                className={`text-xl font-bold ${stat.color}`}
                dangerouslySetInnerHTML={{ __html: stat.value }}
              />
              <div className="text-[11px] text-text-muted mt-0.5">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Tips */}
        <div className="mx-4 my-3 bg-[#fff8f3] rounded-[12px] p-3 border-l-[3px] border-primary">
          <div className="text-[13px] text-[#a06030] leading-relaxed">
            &#127800; <strong>胎动计数小贴士</strong><br />
            · 建议每天固定1~3次，每次1小时<br />
            · 饭后1小时胎儿最活跃，适合计数<br />
            · <strong>1小时&lt;3次</strong>或连续<strong>2小时&lt;10次</strong>，请立即就医
          </div>
        </div>

        {/* History */}
        <div className="px-4 pb-2">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-[15px] font-semibold text-text-primary">近期胎动记录</span>
          </div>
        </div>
        {MOCK_HISTORY.map((rec) => (
          <div
            key={rec.date}
            className="flex items-center justify-between px-5 py-3 bg-white border-b border-border"
          >
            <div>
              <div className="text-[13px] font-medium text-text-primary">
                {rec.date} · {rec.time}
              </div>
              <div className="text-[11px] text-text-muted mt-0.5">{rec.week}</div>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[13px] font-semibold text-blue">{rec.count}次</span>
              <span className="text-[11px] px-2 py-0.5 rounded-lg bg-[#e8f5ee] text-green">正常</span>
            </div>
          </div>
        ))}
        <div className="h-4" />
      </div>
    </div>
  )
}
