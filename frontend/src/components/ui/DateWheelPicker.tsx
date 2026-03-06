'use client'

import { useState, useRef, useCallback, useEffect } from 'react'
import { cn } from '@/lib/utils'

/**
 * P02-A 日期选择器滚轮组件
 * 三列滚轮（年/月/日），中间高亮条，渐变遮罩，选中项大号加粗
 */

interface DateWheelPickerProps {
  initialDate?: { year: number; month: number; day: number }
  onConfirm?: (date: { year: number; month: number; day: number }) => void
  /** 孕周预览信息 */
  weekPreview?: {
    fruitEmoji: string
    weeks: number
    days: number
    fruitName: string
  }
}

const ITEM_HEIGHT = 44

function generateRange(start: number, end: number): number[] {
  const arr: number[] = []
  for (let i = start; i <= end; i++) arr.push(i)
  return arr
}

function getDaysInMonth(year: number, month: number): number {
  return new Date(year, month, 0).getDate()
}

interface WheelColumnProps {
  items: { value: number; label: string }[]
  selectedIndex: number
  onSelect: (index: number) => void
}

function WheelColumn({ items, selectedIndex, onSelect }: WheelColumnProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const isDragging = useRef(false)
  const startY = useRef(0)
  const startOffset = useRef(0)
  const [offset, setOffset] = useState(0)

  // Center the selected item
  const centerOffset = -selectedIndex * ITEM_HEIGHT

  useEffect(() => {
    setOffset(centerOffset)
  }, [centerOffset])

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    isDragging.current = true
    startY.current = e.touches[0].clientY
    startOffset.current = offset
  }, [offset])

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    if (!isDragging.current) return
    const delta = e.touches[0].clientY - startY.current
    setOffset(startOffset.current + delta)
  }, [])

  const handleTouchEnd = useCallback(() => {
    isDragging.current = false
    // Snap to nearest item
    const idx = Math.round(-offset / ITEM_HEIGHT)
    const clampedIdx = Math.max(0, Math.min(items.length - 1, idx))
    setOffset(-clampedIdx * ITEM_HEIGHT)
    onSelect(clampedIdx)
  }, [offset, items.length, onSelect])

  return (
    <div
      ref={containerRef}
      className="flex-1 h-[220px] relative overflow-hidden touch-none"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      <div
        className="absolute w-full transition-transform duration-150"
        style={{ transform: `translateY(${offset + ITEM_HEIGHT * 2}px)` }}
      >
        {items.map((item, i) => {
          const distance = Math.abs(i - Math.round(-offset / ITEM_HEIGHT))
          const fontSize = distance === 0 ? 18 : distance === 1 ? 15 : 14
          const fontWeight = distance === 0 ? 700 : 400
          const opacity = distance === 0 ? 1 : distance === 1 ? 0.6 : 0.35
          return (
            <div
              key={item.value}
              className="flex items-center justify-center"
              style={{
                height: ITEM_HEIGHT,
                fontSize,
                fontWeight,
                color: '#1a1a1a',
                opacity,
                transition: 'all 150ms',
              }}
            >
              {item.label}
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default function DateWheelPicker({
  initialDate,
  onConfirm,
  weekPreview,
}: DateWheelPickerProps) {
  const now = new Date()
  const [year, setYear] = useState(initialDate?.year ?? now.getFullYear())
  const [month, setMonth] = useState(initialDate?.month ?? now.getMonth() + 1)
  const [day, setDay] = useState(initialDate?.day ?? now.getDate())

  const years = generateRange(2024, 2028)
  const months = generateRange(1, 12)
  const daysInMonth = getDaysInMonth(year, month)
  const days = generateRange(1, daysInMonth)

  // Clamp day if month changed
  const clampedDay = Math.min(day, daysInMonth)
  if (clampedDay !== day) setDay(clampedDay)

  const yearItems = years.map((y) => ({ value: y, label: `${y}` }))
  const monthItems = months.map((m) => ({ value: m, label: `${m}月` }))
  const dayItems = days.map((d) => ({ value: d, label: `${d}日` }))

  return (
    <div className="bg-white rounded-t-[20px] overflow-hidden">
      {/* Week Preview */}
      {weekPreview && (
        <div className="bg-gradient-to-br from-[#fff8f0] to-[#fff4ea] px-5 py-4 text-center">
          <div className="text-5xl mb-2">{weekPreview.fruitEmoji}</div>
          <div className="text-2xl font-extrabold text-[#1a1a1a]">
            {weekPreview.weeks}周{weekPreview.days}天
          </div>
          <div className="text-[13px] text-text-muted mt-1">
            此时胎儿宝宝大小像一颗——{weekPreview.fruitName}
          </div>
        </div>
      )}

      {/* Column Headers */}
      <div className="flex border-b border-[#f0ebe4]">
        {['年', '月', '日'].map((h) => (
          <div key={h} className="flex-1 text-center text-[11px] text-text-muted py-2">
            {h}
          </div>
        ))}
      </div>

      {/* Wheel Area */}
      <div className="relative h-[220px]">
        {/* Highlight bar */}
        <div className="absolute top-1/2 left-3 right-3 h-11 -translate-y-1/2 bg-[rgba(255,140,66,0.07)] border-t-[1.5px] border-b-[1.5px] border-[rgba(255,140,66,0.35)] rounded-lg pointer-events-none z-[2]" />
        {/* Top mask */}
        <div className="absolute top-0 left-0 right-0 h-[88px] bg-gradient-to-b from-white to-transparent z-[3] pointer-events-none" />
        {/* Bottom mask */}
        <div className="absolute bottom-0 left-0 right-0 h-[88px] bg-gradient-to-t from-white to-transparent z-[3] pointer-events-none" />

        <div className="flex h-full">
          <WheelColumn
            items={yearItems}
            selectedIndex={years.indexOf(year)}
            onSelect={(i) => setYear(years[i])}
          />
          <WheelColumn
            items={monthItems}
            selectedIndex={month - 1}
            onSelect={(i) => setMonth(i + 1)}
          />
          <WheelColumn
            items={dayItems}
            selectedIndex={clampedDay - 1}
            onSelect={(i) => setDay(i + 1)}
          />
        </div>
      </div>

      {/* Selected date hint */}
      <div className="px-5 py-2 bg-[#f9f5f0] border-t border-[#f0ebe4] text-center">
        <span className="text-[13px] text-[#a06030] font-medium">
          已选预产期：<strong>{year}年{month}月{clampedDay}日</strong>
        </span>
      </div>

      {/* Confirm Button */}
      <div className="px-5 py-4">
        <button
          onClick={() => onConfirm?.({ year, month, day: clampedDay })}
          className="btn-primary"
        >
          完 成
        </button>
      </div>
    </div>
  )
}
