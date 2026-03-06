'use client'

import { formatDate, formatGestationalAge, getTrimesterName } from '@/lib/utils'
import type { GestationalInfo } from '@/types'

/**
 * 首页顶部孕周 Banner 组件
 * 展示当前日期、孕周、距预产期天数
 */
interface PregnancyBannerProps {
  gestationalInfo: GestationalInfo
  currentDate: string
}

export default function PregnancyBanner({ gestationalInfo, currentDate }: PregnancyBannerProps) {
  const { weeks, days, trimester, daysUntilEdd } = gestationalInfo

  return (
    <div className="relative overflow-hidden bg-gradient-to-br from-[#fdf0e0] via-[#fde8cc] to-[#fce0ba] px-5 pt-4 pb-0 min-h-[160px]">
      {/* 左侧文字 */}
      <div className="relative z-[2]">
        <div className="text-xs text-[#b8895a] mb-1">
          {formatDate(currentDate)}
        </div>
        <div className="text-[28px] font-extrabold text-[#5a3010] leading-tight">
          孕<span className="text-[32px]">{weeks}</span>周
          <span className="text-base font-semibold text-[#8a5a30]">{days}天</span>
        </div>
        <div className="text-[11px] text-[#b8895a] mt-1.5">
          {getTrimesterName(trimester)} · 距预产期还有 {daysUntilEdd} 天
        </div>
        <div className="inline-block mt-2.5 px-3 py-1 bg-[rgba(232,124,62,0.15)] rounded-chip text-[11px] text-primary border border-[rgba(232,124,62,0.3)]">
          查看孕期知识 ›
        </div>
      </div>

      {/* 右侧孕妇插画 SVG */}
      <div className="absolute right-4 bottom-0 w-[110px] h-[130px] flex items-end justify-center">
        <svg viewBox="0 0 110 130" fill="none" className="w-full h-full">
          <ellipse cx="55" cy="95" rx="30" ry="28" fill="#fcd4a0" />
          <ellipse cx="62" cy="100" rx="22" ry="20" fill="#f4b382" />
          <circle cx="55" cy="52" r="22" fill="#fcd4a0" />
          <path d="M33 48 Q35 28 55 26 Q75 28 77 48" fill="#8B5E3C" />
          <circle cx="47" cy="52" r="2" fill="#8B5E3C" />
          <circle cx="63" cy="52" r="2" fill="#8B5E3C" />
          <path d="M49 59 Q55 64 61 59" stroke="#c97b5a" strokeWidth="1.5" fill="none" strokeLinecap="round" />
          <circle cx="43" cy="58" r="5" fill="rgba(255,150,120,0.25)" />
          <circle cx="67" cy="58" r="5" fill="rgba(255,150,120,0.25)" />
          <path d="M25 85 Q18 95 22 108" stroke="#fcd4a0" strokeWidth="8" strokeLinecap="round" fill="none" />
          <path d="M85 85 Q92 95 88 108" stroke="#fcd4a0" strokeWidth="8" strokeLinecap="round" fill="none" />
          <path d="M42 120 L38 130" stroke="#fcd4a0" strokeWidth="9" strokeLinecap="round" />
          <path d="M68 120 L72 130" stroke="#fcd4a0" strokeWidth="9" strokeLinecap="round" />
          <path d="M25 85 Q28 70 55 68 Q82 70 85 85 L82 123 Q55 128 28 123 Z" fill="#f8c4d4" opacity="0.7" />
        </svg>
      </div>
    </div>
  )
}
