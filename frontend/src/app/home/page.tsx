'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import TabBar from '@/components/layout/TabBar'
import PregnancyBanner from '@/components/business/PregnancyBanner'
import BabyTalkCard from '@/components/business/BabyTalkCard'
import HealthQuickCards from '@/components/business/HealthQuickCards'
import ProgressBar from '@/components/ui/ProgressBar'
import Card from '@/components/ui/Card'
import Badge from '@/components/ui/Badge'
import { calculateGestationalInfo, getTrimesterName } from '@/lib/utils'
import MomChangeModal from '@/components/business/MomChangeModal'
import type { GestationalInfo } from '@/types'

/**
 * 首页 Tab
 * 展示孕周信息、宝宝说、妈妈健康、产检信息、健康记录
 */

// Mock 数据 - 基于原型中的孕14周3天
const MOCK_LMP = '2025-11-25'

export default function HomePage() {
  const gestationalInfo = calculateGestationalInfo(MOCK_LMP)
  const [showMomChangeModal, setShowMomChangeModal] = useState(false)

  // 首次进入自动弹出妈妈变化弹窗
  useEffect(() => {
    const dismissed = sessionStorage.getItem('mom_change_dismissed')
    if (!dismissed) {
      const timer = setTimeout(() => setShowMomChangeModal(true), 500)
      return () => clearTimeout(timer)
    }
  }, [])

  const handleDismissMomChange = () => {
    setShowMomChangeModal(false)
    sessionStorage.setItem('mom_change_dismissed', 'true')
  }

  return (
    <div className="flex flex-col min-h-screen bg-bg-warm">

      <div className="flex-1 overflow-y-auto hide-scrollbar">
        {/* 顶部 Banner */}
        <PregnancyBanner
          gestationalInfo={gestationalInfo}
          currentDate={new Date().toISOString()}
        />

        {/* 气泡区域 */}
        <BubbleSection gestationalInfo={gestationalInfo} />

        {/* 宝宝说 */}
        <BabyTalkCard
          fruitEmoji={gestationalInfo.fruitComparison.emoji}
          text={`妈妈，我现在有${gestationalInfo.fruitComparison.lengthCm}cm啦，大概一颗${gestationalInfo.fruitComparison.name}那么大！我的手指头和脚趾头都长出来了，我最近很喜欢伸懒腰，你感受到了吗？我还开始会做小表情了，会皱眉和微笑哦，是不是很厉害？`}
        />

        {/* 妈妈健康 */}
        <div className="mx-4 mb-3">
          <Card onClick={() => { window.location.href = '/home/knowledge' }}>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-rose flex items-center gap-1">
                &#129328; 妈妈健康
              </span>
              <span className="text-xs text-text-light">&#8250;</span>
            </div>
            <p className="text-xs text-text-secondary leading-relaxed">
              进入孕中期第一周，你可能会发现孕早期的恶心感正在慢慢减轻，身体终于迎来了相对舒适的阶段~本周宝宝已经有山竹那么大，开始会做鬼脸了！
            </p>
            <span className="inline-block mt-2 px-2 py-0.5 bg-rose-50 text-rose rounded-[10px] text-[10px]">
              &#128070; 点击查看本周详情
            </span>
          </Card>
        </div>

        {/* 孕程进度 */}
        <div className="mx-4 mb-3">
          <Card>
            <div className="text-center text-sm text-[#5a3010] font-semibold mb-3">
              &#127793; 距离预产期 {gestationalInfo.daysUntilEdd} 天 &#127793;
            </div>
            <ProgressBar percent={gestationalInfo.progressPercent} showDot />
            <div className="flex justify-between mt-2">
              {(['first', 'second', 'third'] as const).map((t) => {
                const isCurrent = gestationalInfo.trimester === t
                const isPast = ['first'].includes(t) && gestationalInfo.trimester !== 'first'
                const ranges = { first: '6~13周', second: '14~27周', third: '28~40周' }
                return (
                  <div
                    key={t}
                    className={`text-center text-[10px] ${
                      isCurrent ? 'text-primary font-bold' : isPast ? 'text-primary-400' : 'text-text-muted'
                    }`}
                  >
                    <div className={`w-1.5 h-1.5 rounded-full mx-auto mb-0.5 ${
                      isCurrent ? 'bg-primary' : isPast ? 'bg-primary-400' : 'bg-border-dark'
                    }`} />
                    {getTrimesterName(t)}
                    <div className="text-[9px] text-text-light">{ranges[t]}</div>
                  </div>
                )
              })}
            </div>
          </Card>
        </div>

        {/* 产检信息 */}
        <div className="px-4 mb-3">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-bold text-text-primary">&#128197;&#65039; 产检信息</span>
            <Link
              href="/checkup"
              className="text-[11px] text-primary"
            >
              查看全部 ›
            </Link>
          </div>
          <Card>
            <div className="flex items-center gap-1.5 mb-2.5">
              <Badge variant="warning">产检重点</Badge>
              <span className="text-xs text-text-muted">孕14周</span>
            </div>
            <div className="flex flex-wrap gap-1.5 mb-2.5">
              <span className="text-[11px] px-2 py-0.5 rounded-chip bg-primary-100 text-primary border border-primary-400">
                中期唐筛 ⚠️
              </span>
              {['无创DNA', '血常规', '尿常规', 'B超'].map((item) => (
                <span key={item} className="text-[11px] px-2 py-0.5 rounded-md bg-bg text-[#5a3010] border border-[#f0e0c8]">
                  {item}
                </span>
              ))}
            </div>
            <div className="text-[11px] text-primary bg-[#fff9f0] rounded-lg px-2.5 py-1.5 mb-2">
              ⚠️ 唐筛窗口期 14~20周，本周是最佳时机，请尽快预约
            </div>
            <div className="border-t border-border-light pt-2.5 flex items-center justify-between">
              <div>
                <div className="text-xs font-bold text-text-primary mb-0.5">孕15周产检计划</div>
                <div className="text-[11px] text-text-tertiary">2026年3月18日（周三）</div>
              </div>
              <Link
                href="/checkup"
                className="px-4 py-2 bg-gradient-to-r from-primary-400 to-primary text-white rounded-chip text-xs font-bold shadow-button"
              >
                记录产检
              </Link>
            </div>
          </Card>
        </div>

        {/* 健康记录 */}
        <div className="px-4 mb-5">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-bold text-text-primary">&#128202; 健康记录</span>
            <Link
              href="/health"
              className="text-[11px] text-primary"
            >
              查看趋势 ›
            </Link>
          </div>
          <HealthQuickCards
            cards={[
              { icon: '⚖️', iconBg: '#fff3e0', label: '体重', value: '58.2', unit: 'kg', hint: '本周+0.3kg ✓', hintType: 'normal', actionText: '+ 记录今日体重' },
              { icon: '🩺', iconBg: '#e8f5e9', label: '血压', value: '118/76', unit: 'mmHg', hint: '正常范围 ✓', hintType: 'normal', actionText: '+ 记录血压' },
              { icon: '🩸', iconBg: '#fce4ec', label: '血糖', value: '5.2', unit: 'mmol/L', hint: '空腹正常 ✓', hintType: 'normal', actionText: '+ 记录血糖' },
              { icon: '👶', iconBg: '#e3f2fd', label: '胎动', value: '—', unit: '', hint: '28周后开始记录', hintType: 'disabled', actionText: '暂不可用', disabled: true },
            ]}
            onCardAction={() => { window.location.href = '/health' }}
          />
        </div>
      </div>

      <TabBar />

      {/* P04: 妈妈变化弹窗 */}
      <MomChangeModal
        visible={showMomChangeModal}
        weekNumber={gestationalInfo.weeks}
        onDismiss={handleDismissMomChange}
        onLearnMore={() => {
          handleDismissMomChange()
          window.location.href = '/home/knowledge'
        }}
      />
    </div>
  )
}

/** 气泡区域 - 展示宝宝大小 */
function BubbleSection({ gestationalInfo }: { gestationalInfo: GestationalInfo }) {
  return (
    <div className="bg-gradient-to-br from-[#fdf0e0] to-[#fce8cc] px-5 pt-4 pb-5">
      <div className="text-[13px] font-bold text-[#5a3010] mb-3">
        &#129531; 本周健康
      </div>
      <div className="relative h-[190px]">
        {/* 主气泡 - 宝宝 */}
        <div className="absolute right-2.5 top-2.5 w-[140px] h-[140px] rounded-full bg-gradient-to-br from-[#fde8c8] to-[#fcd4a0] flex flex-col items-center justify-center animate-breathe shadow-[0_0_0_6px_rgba(232,124,62,0.15),0_0_0_12px_rgba(232,124,62,0.07)]">
          <span className="text-5xl">&#128118;</span>
          <span className="text-[9px] text-[#8a5a30] font-semibold mt-0.5">
            孕{gestationalInfo.weeks}周胎儿
          </span>
        </div>
        {/* 中气泡 - 水果 */}
        <div className="absolute left-5 top-5 w-[90px] h-[90px] rounded-full bg-gradient-to-br from-green-100 to-[#c8e6c9] flex flex-col items-center justify-center animate-float1">
          <span className="text-[28px]">{gestationalInfo.fruitComparison.emoji}</span>
          <span className="text-[8px] text-green-500 font-bold text-center leading-tight">
            宝宝大小<br />像{gestationalInfo.fruitComparison.name}
          </span>
        </div>
        {/* 小气泡 */}
        <div className="absolute left-[50px] bottom-2.5 w-[60px] h-[60px] rounded-full bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center animate-float2">
          <span className="text-[22px]">&#10084;&#65039;</span>
        </div>
      </div>
    </div>
  )
}
