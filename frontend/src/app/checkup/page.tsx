'use client'

import { useState } from 'react'
import Link from 'next/link'
import NavBar from '@/components/layout/NavBar'
import TabBar from '@/components/layout/TabBar'
import Badge from '@/components/ui/Badge'
import ToggleSwitch from '@/components/ui/ToggleSwitch'

/**
 * P06 - 产检日历页
 * 月历视图 + 清单视图，产检卡片，进度条
 */

const WEEKDAYS = ['日', '一', '二', '三', '四', '五', '六']

type ViewMode = 'calendar' | 'list'

interface CheckupEvent {
  day: number
  status: 'done' | 'pending' | 'overdue'
}

const MOCK_EVENTS: CheckupEvent[] = [
  { day: 7, status: 'done' },
  { day: 13, status: 'pending' },
  { day: 26, status: 'pending' },
]

const MOCK_CHECKUPS = [
  {
    id: '2',
    title: '第2次产检',
    weekRange: '孕14~19+6周',
    dateInfo: '已于 3月13日 完成',
    status: 'done' as const,
    items: ['唐氏筛查（中期）', '血常规', '尿常规'],
  },
  {
    id: '3',
    title: '第3次产检',
    weekRange: '孕20~24周',
    dateInfo: '预计 3月26日',
    status: 'pending' as const,
    items: ['大排畸超声（II级）', '血常规', '尿常规'],
  },
]

function generateCalendarDays(year: number, month: number) {
  const firstDay = new Date(year, month, 1).getDay()
  const daysInMonth = new Date(year, month + 1, 0).getDate()
  const prevDays = new Date(year, month, 0).getDate()

  const days: { day: number; isCurrentMonth: boolean }[] = []

  for (let i = firstDay - 1; i >= 0; i--) {
    days.push({ day: prevDays - i, isCurrentMonth: false })
  }
  for (let i = 1; i <= daysInMonth; i++) {
    days.push({ day: i, isCurrentMonth: true })
  }
  const remaining = 42 - days.length
  for (let i = 1; i <= remaining; i++) {
    days.push({ day: i, isCurrentMonth: false })
  }
  return days
}

export default function CheckupPage() {
  const [viewMode, setViewMode] = useState<ViewMode>('calendar')
  const [selectedDay, setSelectedDay] = useState(13)
  const [currentMonth] = useState({ year: 2026, month: 2 }) // March 2026
  const [reminderEnabled, setReminderEnabled] = useState(true)

  const today = 6 // March 6
  const days = generateCalendarDays(currentMonth.year, currentMonth.month)

  const getEventForDay = (day: number) => MOCK_EVENTS.find((e) => e.day === day)

  return (
    <div className="flex flex-col min-h-screen bg-bg">
      <NavBar
        title="产检计划"
        backHref="/home"
        rightContent={<span className="text-[13px] text-primary font-medium">+ 添加</span>}
      />

      {/* View Toggle */}
      <div className="flex bg-white px-4 py-3 gap-2 border-b border-border">
        <button
          onClick={() => setViewMode('calendar')}
          className={`flex-1 h-[34px] rounded-chip text-[13px] font-medium flex items-center justify-center gap-1 border-[1.5px] transition-colors ${
            viewMode === 'calendar'
              ? 'bg-primary border-primary text-white'
              : 'bg-white border-border-dark text-text-secondary'
          }`}
        >
          &#128197; 月历视图
        </button>
        <button
          onClick={() => setViewMode('list')}
          className={`flex-1 h-[34px] rounded-chip text-[13px] font-medium flex items-center justify-center gap-1 border-[1.5px] transition-colors ${
            viewMode === 'list'
              ? 'bg-primary border-primary text-white'
              : 'bg-white border-border-dark text-text-secondary'
          }`}
        >
          &#128203; 清单视图
        </button>
      </div>

      <div className="flex-1 overflow-y-auto hide-scrollbar">
        {viewMode === 'calendar' && (
          <>
            {/* Month Navigation */}
            <div className="flex items-center justify-between px-5 pt-3.5 pb-2 bg-white">
              <button className="w-8 h-8 rounded-full bg-bg flex items-center justify-center text-[15px] text-text-secondary">
                &#8249;
              </button>
              <span className="text-base font-bold text-text-primary">2026年 3月</span>
              <button className="w-8 h-8 rounded-full bg-bg flex items-center justify-center text-[15px] text-text-secondary">
                &#8250;
              </button>
            </div>

            {/* Calendar Grid */}
            <div className="bg-white px-3 pb-4">
              <div className="grid grid-cols-7 mb-1">
                {WEEKDAYS.map((d) => (
                  <div key={d} className="text-center text-[11px] text-text-muted font-medium py-1.5">
                    {d}
                  </div>
                ))}
              </div>
              <div className="grid grid-cols-7 gap-0.5">
                {days.map((d, i) => {
                  const event = d.isCurrentMonth ? getEventForDay(d.day) : null
                  const isToday = d.isCurrentMonth && d.day === today
                  const isSelected = d.isCurrentMonth && d.day === selectedDay
                  return (
                    <button
                      key={i}
                      onClick={() => d.isCurrentMonth && setSelectedDay(d.day)}
                      className={`aspect-square rounded-full flex flex-col items-center justify-center text-[13px] relative ${
                        !d.isCurrentMonth
                          ? 'text-border-dark'
                          : isSelected
                          ? 'bg-primary text-white font-semibold'
                          : isToday
                          ? 'bg-[#fff3eb] text-primary font-bold'
                          : event
                          ? 'font-semibold text-text-primary'
                          : 'text-text-primary'
                      }`}
                    >
                      {d.day}
                      {event && (
                        <div
                          className={`w-[5px] h-[5px] rounded-full mt-0.5 ${
                            isSelected
                              ? 'bg-white/80'
                              : event.status === 'done'
                              ? 'bg-green'
                              : event.status === 'pending'
                              ? 'bg-blue'
                              : 'bg-danger'
                          }`}
                        />
                      )}
                    </button>
                  )
                })}
              </div>
            </div>

            {/* Legend */}
            <div className="flex gap-4 px-5 py-2.5 bg-white border-b border-border">
              <div className="flex items-center gap-1.5 text-[11px] text-text-muted">
                <div className="w-2 h-2 rounded-full bg-green" />已完成
              </div>
              <div className="flex items-center gap-1.5 text-[11px] text-text-muted">
                <div className="w-2 h-2 rounded-full bg-blue" />待产检
              </div>
              <div className="flex items-center gap-1.5 text-[11px] text-text-muted">
                <div className="w-2 h-2 rounded-full bg-danger" />已逾期
              </div>
              <div className="flex items-center gap-1.5 text-[11px] text-text-muted">
                <div className="w-2 h-2 rounded-full bg-[#fff3eb] border border-primary" />今日
              </div>
            </div>
          </>
        )}

        {/* Checkup Cards Section */}
        <div className="p-4">
          <div className="text-[13px] text-text-muted font-medium mb-2.5 px-0.5">
            {viewMode === 'calendar' ? `3月${selectedDay}日 · 孕14周3天` : '全部产检计划'}
          </div>

          {/* Empty State - when selected day has no checkup */}
          {viewMode === 'calendar' && !MOCK_EVENTS.find((e) => e.day === selectedDay) && (
            <div className="bg-white rounded-card p-6 shadow-card mb-3 text-center">
              <div className="text-4xl mb-2">📅</div>
              <div className="text-sm text-text-muted mb-3">当天无产检安排</div>
              <Link
                href="/checkup/record"
                className="px-5 py-2 rounded-chip bg-primary text-white text-xs font-medium"
              >
                + 去添加
              </Link>
            </div>
          )}

          {/* Progress Banner */}
          <div className="bg-white rounded-card p-4 shadow-card mb-3">
            <div className="text-[13px] text-text-secondary mb-2">整体产检进度</div>
            <div className="flex justify-between text-xs text-text-muted mb-1.5">
              <span>已完成 3次</span>
              <span>共 11次</span>
            </div>
            <div className="h-2 bg-border rounded-md overflow-hidden">
              <div className="h-full w-[27%] bg-gradient-to-r from-green to-[#7dd4a8] rounded-md" />
            </div>
            <div className="text-[11px] text-text-muted mt-1.5 text-right">还剩 8次 产检</div>
          </div>

          {/* Checkup Cards */}
          {MOCK_CHECKUPS.map((checkup) => (
            <div
              key={checkup.id}
              className={`bg-white rounded-card p-4 shadow-card mb-2.5 ${
                checkup.status === 'pending' ? 'border-[1.5px] border-[#e8edff]' : ''
              }`}
            >
              <div className="flex items-start gap-3">
                <div
                  className={`w-2.5 h-2.5 rounded-full mt-1 flex-shrink-0 ${
                    checkup.status === 'done' ? 'bg-green' : checkup.status === 'pending' ? 'bg-blue' : 'bg-danger'
                  }`}
                />
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[15px] font-semibold text-text-primary">{checkup.title}</span>
                    <Badge
                      variant={
                        checkup.status === 'done' ? 'done' : checkup.status === 'pending' ? 'info' : 'danger'
                      }
                    >
                      {checkup.status === 'done' ? '已完成' : checkup.status === 'pending' ? '待产检' : '已逾期'}
                    </Badge>
                  </div>
                  <div className="text-xs text-text-muted mb-1.5">
                    {checkup.weekRange} · {checkup.dateInfo}
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {checkup.items.map((item) => (
                      <span key={item} className="text-[11px] bg-bg text-text-secondary px-2 py-0.5 rounded-md">
                        {item}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
              <div className="flex gap-2 mt-3 pt-3 border-t border-border">
                <Link
                  href={`/checkup/${checkup.id}`}
                  className="flex-1 h-[34px] rounded-button border-[1.5px] border-border-dark bg-white text-[13px] font-medium text-text-secondary flex items-center justify-center"
                >
                  {checkup.status === 'done' ? '查看记录' : '查看详情'}
                </Link>
                <Link
                  href={checkup.status === 'done' ? '/assistant/report-upload' : '/checkup/record'}
                  className={`flex-1 h-[34px] rounded-button text-[13px] font-medium flex items-center justify-center ${
                    checkup.status === 'done'
                      ? 'bg-[#eef2ff] text-blue border-none'
                      : 'bg-primary text-white border-none'
                  }`}
                >
                  {checkup.status === 'done' ? 'AI解读报告' : '记录产检'}
                </Link>
              </div>
            </div>
          ))}

          {/* Notify Setting */}
          <div className="bg-white rounded-card px-4 py-3.5 flex items-center gap-3 shadow-card">
            <span className="text-2xl">&#128276;</span>
            <div className="flex-1">
              <div className="text-sm font-medium text-text-primary">产检提醒</div>
              <div className="text-xs text-text-muted mt-0.5">
                提前3天 · 3月23日 09:00
              </div>
            </div>
            <ToggleSwitch
              checked={reminderEnabled}
              onChange={setReminderEnabled}
            />
          </div>
        </div>
      </div>

      <TabBar />
    </div>
  )
}
