'use client'

import { useState } from 'react'
import Link from 'next/link'
import NavBar from '@/components/layout/NavBar'
import Accordion from '@/components/ui/Accordion'
import WeekChipSelector from '@/components/business/WeekChipSelector'
import { calculateGestationalInfo, getFruitComparison } from '@/lib/utils'

type TabType = 'mom' | 'baby'

const MOCK_LMP = '2025-11-25'
const AVAILABLE_WEEKS = [12, 13, 14, 15, 16]

export default function KnowledgePage() {
  const [activeTab, setActiveTab] = useState<TabType>('mom')
  const [selectedWeek, setSelectedWeek] = useState(14)
  const fruit = getFruitComparison(selectedWeek)

  return (
    <div className="flex flex-col min-h-screen bg-bg">
      <NavBar title="孕期知识" backHref="/home" />

      <div className="flex-1 overflow-y-auto hide-scrollbar">
        {/* Week Chip Selector */}
        <WeekChipSelector
          weeks={AVAILABLE_WEEKS}
          currentWeek={selectedWeek}
          onSelect={setSelectedWeek}
        />

        {/* Tab Switch */}
        <div className="flex bg-white border-b border-border">
          <button
            onClick={() => setActiveTab('mom')}
            className={`flex-1 py-2.5 text-[13px] font-medium text-center border-b-2 transition-colors ${
              activeTab === 'mom'
                ? 'text-primary border-primary font-bold'
                : 'text-text-muted border-transparent'
            }`}
          >
            妈妈健康
          </button>
          <button
            onClick={() => setActiveTab('baby')}
            className={`flex-1 py-2.5 text-[13px] font-medium text-center border-b-2 transition-colors ${
              activeTab === 'baby'
                ? 'text-primary border-primary font-bold'
                : 'text-text-muted border-transparent'
            }`}
          >
            宝宝发育
          </button>
        </div>

        {activeTab === 'mom' ? (
          <MomHealthContent week={selectedWeek} fruit={fruit} />
        ) : (
          <BabyDevContent week={selectedWeek} fruit={fruit} />
        )}

        {/* Tip Card */}
        <div className="mx-4 mb-5 bg-[#fff8f3] border-l-[3px] border-primary rounded-r-[12px] px-3.5 py-3">
          <div className="text-xs text-[#a06030] leading-relaxed">
            <strong>&#128161; 温馨提示：</strong>以上内容仅供参考，具体情况请结合产检结果和医生建议。每个宝宝发育进度略有不同，轻微差异属于正常现象。
          </div>
        </div>
      </div>

      {/* AI Float Button */}
      <Link
        href="/assistant"
        className="fixed right-4 bottom-24 w-12 h-12 bg-gradient-to-br from-primary-400 to-primary rounded-full flex items-center justify-center text-[22px] shadow-button z-20"
      >
        &#129302;
        <div className="absolute -top-0.5 -right-0.5 w-3.5 h-3.5 bg-danger rounded-full border-2 border-white" />
      </Link>
    </div>
  )
}

// ============================================================
// P02: 妈妈健康详情
// ============================================================

interface FruitInfo {
  emoji: string
  name: string
  lengthCm: number
  weightG: number
}

function MomHealthContent({ week, fruit }: { week: number; fruit: FruitInfo }) {
  return (
    <>
      {/* Hero */}
      <div className="bg-gradient-to-br from-[#fdf0e0] to-[#fde8cc] px-5 py-5 flex items-center gap-3">
        <div className="text-[60px]">&#129328;</div>
        <div>
          <h2 className="text-xl font-extrabold text-[#5a3010]">孕{week}周</h2>
          <p className="text-xs text-[#b8895a] mt-1">妈妈健康 · 本周详情</p>
          <p className="text-[11px] text-[#b8895a] mt-0.5">孕中期第{week - 13}周</p>
        </div>
      </div>

      <div className="p-4 flex flex-col gap-2">
        {/* 本周健康概述 */}
        <Accordion title="&#128203; 本周健康概述" defaultOpen>
          <p className="text-xs text-text-secondary leading-[1.8]">
            进入孕中期第一周，你可能会发现孕早期的恶心感正在慢慢减轻，身体终于迎来了相对舒适的阶段~本周宝宝已经有{fruit.name}那么大，开始会做鬼脸了！这周最值得关注的是：<strong className="text-text-primary">记得预约唐氏筛查</strong>，窗口期14~20周，错过需要更复杂的检查哦。
          </p>
        </Accordion>

        {/* 身体变化 */}
        <Accordion title="&#129658; 身体变化" defaultOpen>
          <div className="space-y-2">
            <div className="text-xs text-text-secondary leading-[1.8]">
              <strong className="text-text-primary">腰背酸痛</strong> — 子宫增大导致重心前移，建议睡觉时左侧卧，垫腰枕
            </div>
            <div className="text-xs text-text-secondary leading-[1.8]">
              <strong className="text-text-primary">乳房增大</strong> — 乳腺发育，孕激素升高，更换合适孕妇内衣
            </div>
            <div className="text-xs text-text-secondary leading-[1.8]">
              <strong className="text-text-primary">偶尔头晕</strong> — 血容量增加、血压稍低，起身动作放慢
            </div>
            <div className="text-xs text-text-secondary leading-[1.8]">
              <strong className="text-text-primary">皮肤变化</strong> — 腹部、乳房可能出现妊娠纹，及早使用橄榄油按摩
            </div>
            <div className="mt-2">
              <span className="text-[11px] font-bold text-danger block mb-1">&#9888;&#65039; 需警惕的信号</span>
              <span className="block text-[11px] text-danger bg-[#fff5f5] rounded-lg px-2.5 py-1 mb-1">
                &#128680; 阴道出血超过月经量 → 立即就医
              </span>
              <span className="block text-[11px] text-danger bg-[#fff5f5] rounded-lg px-2.5 py-1">
                &#128680; 剧烈腹痛持续超过30分钟 → 立即就医
              </span>
            </div>
          </div>
        </Accordion>

        {/* 心理变化 */}
        <Accordion title="&#128173; 心理变化">
          <p className="text-xs text-text-secondary leading-[1.8]">
            本周很多妈妈会开始感受到宝宝的真实存在感，可能伴随着小小的激动和不安。情绪波动是正常现象，孕激素水平变化会影响心情。建议每天留出10分钟做胎教，和宝宝说说话，这也是很好的减压方式~
          </p>
          <div className="mt-2 px-2.5 py-1.5 bg-[#f3e5f5] rounded-lg text-[11px] text-[#7b1fa2]">
            &#128156; 给准爸爸：多关心妈妈的情绪变化，多一个拥抱，就是最好的支持
          </div>
        </Accordion>

        {/* 营养提醒 */}
        <Accordion title="&#129367; 营养提醒">
          <div className="text-[11px] font-bold text-text-primary mb-2">本周重点：铁质 + DHA</div>
          <div className="space-y-1">
            {[
              { emoji: '&#129385;', text: '瘦肉红肉 — 血红素铁最易吸收' },
              { emoji: '&#128031;', text: '深海鱼 — 补充DHA促进大脑发育' },
              { emoji: '&#129388;', text: '深绿蔬菜 — 叶酸+铁双补' },
              { emoji: '&#127818;', text: '维C水果 — 促进铁质吸收' },
            ].map((item) => (
              <div key={item.text} className="flex items-center gap-2 py-0.5">
                <span className="text-xl" dangerouslySetInnerHTML={{ __html: item.emoji }} />
                <span className="text-[11px] text-text-secondary">{item.text}</span>
              </div>
            ))}
          </div>
          <div className="mt-2 text-[11px] text-danger">
            &#10060; 忌：生鱼片、高汞鱼类（金枪鱼）、酒精
          </div>
        </Accordion>

        {/* 如何安心度过这一周 */}
        <Accordion title="&#9989; 如何安心度过这一周">
          <div className="space-y-0">
            <ChecklistItem done text="本周需预约唐筛，窗口期14~20周" actionLabel="产检日历 ›" actionHref="/checkup" />
            <ChecklistItem text="记录今日体重（本周目标增重0.3~0.5kg）" actionLabel="记录体重 ›" actionHref="/health/weight" />
            <ChecklistItem text="量一次血压并记录" actionLabel="记录血压 ›" actionHref="/health/blood-pressure" />
            <ChecklistItem done text="尝试左侧卧睡，使用腰枕缓解腰背酸痛" />
            <ChecklistItem text="今天和准爸爸分享一件让你开心的事" noBorder />
          </div>
        </Accordion>
      </div>
    </>
  )
}

function ChecklistItem({
  done = false,
  text,
  actionLabel,
  actionHref,
  noBorder = false,
}: {
  done?: boolean
  text: string
  actionLabel?: string
  actionHref?: string
  noBorder?: boolean
}) {
  return (
    <div className={`flex items-center gap-2 py-1.5 ${noBorder ? '' : 'border-b border-[#f5f0ea]'}`}>
      <div
        className={`w-[18px] h-[18px] rounded-[5px] border-2 flex items-center justify-center text-[10px] flex-shrink-0 ${
          done ? 'bg-primary border-primary text-white' : 'border-border-dark'
        }`}
      >
        {done && '✓'}
      </div>
      <span className="text-[11px] text-text-secondary flex-1">{text}</span>
      {actionLabel && actionHref && (
        <Link
          href={actionHref}
          className="px-2 py-0.5 bg-[#fff3e0] rounded-[10px] text-[10px] text-primary whitespace-nowrap"
        >
          {actionLabel}
        </Link>
      )}
    </div>
  )
}

// ============================================================
// P03: 宝宝发育详情
// ============================================================

function BabyDevContent({ week, fruit }: { week: number; fruit: FruitInfo }) {
  return (
    <>
      {/* Hero - green theme */}
      <div className="bg-gradient-to-br from-[#e8f5e9] to-[#c8e6c9] px-5 py-5 flex items-center gap-3">
        <div className="text-[60px]">&#128118;</div>
        <div>
          <h2 className="text-xl font-extrabold text-[#1b5e20]">孕{week}周</h2>
          <p className="text-xs text-[#388e3c] mt-1">宝宝发育 · 本周情况</p>
        </div>
      </div>

      <div className="p-4 flex flex-col gap-2">
        {/* 发育概况卡片 */}
        <div className="bg-white rounded-[14px] p-3.5 shadow-card">
          <div className="flex gap-3 items-center">
            <div className="w-20 h-20 bg-gradient-to-br from-[#fde8c8] to-[#fcd4a0] rounded-full flex items-center justify-center text-4xl animate-breathe flex-shrink-0">
              &#128118;
            </div>
            <div>
              <h3 className="text-base font-extrabold text-[#5a3010]">孕{week}周发育情况</h3>
              <div className="flex gap-2.5 text-[11px] text-text-muted mt-1">
                <span>身长：{fruit.lengthCm}cm</span>
                <span>体重：{fruit.weightG}g</span>
              </div>
              <div className="text-[11px] text-[#2e7d32] mt-1">
                {fruit.emoji} 大小像一颗{fruit.name}
              </div>
            </div>
          </div>

          {/* 宝宝说 */}
          <div className="mt-3 bg-bg rounded-[10px] px-3 py-2.5 text-xs text-[#5a3010] leading-[1.7] italic border-l-[3px] border-primary">
            &#128172; 妈妈，我现在有{fruit.lengthCm}cm啦，大概一颗{fruit.name}那么大！我的手指头和脚趾头都长出来了，我最近很喜欢伸懒腰，你感受到了吗？我还开始会做小表情了，会皱眉和微笑哦！
          </div>
        </div>

        {/* 本周发育亮点 */}
        <div className="bg-white rounded-[14px] p-3.5 shadow-card">
          <div className="text-xs font-bold text-text-primary mb-2.5">&#128300; 本周发育亮点</div>
          <div className="space-y-1">
            {[
              '开始会做各种小表情（皱眉/微笑）',
              '手指甲开始生长',
              '肝脏开始分泌胆汁',
              '小家伙的脖子更灵活了，能转头',
              '眼睛虽紧闭，但已能感受到光线',
            ].map((item) => (
              <div key={item} className="flex items-start gap-1.5 text-[11px] text-text-secondary py-0.5">
                <div className="w-[5px] h-[5px] rounded-full bg-primary mt-1 flex-shrink-0" />
                <span>{item}</span>
              </div>
            ))}
          </div>
        </div>

        {/* 本周发育数据 */}
        <div className="bg-white rounded-[14px] p-3.5 shadow-card">
          <div className="text-xs font-bold text-text-primary mb-2.5">&#128208; 本周发育数据</div>
          <div className="grid grid-cols-2 gap-2.5">
            <div className="bg-[#f5f9f5] rounded-[10px] p-2.5 text-center">
              <div className="text-xl font-extrabold text-[#1b5e20]">{fruit.lengthCm}</div>
              <div className="text-[10px] text-text-muted">厘米（cm）</div>
            </div>
            <div className="bg-[#f5f9f5] rounded-[10px] p-2.5 text-center">
              <div className="text-xl font-extrabold text-[#1b5e20]">{fruit.weightG}</div>
              <div className="text-[10px] text-text-muted">克（g）</div>
            </div>
          </div>
        </div>

        {/* 水果对照 */}
        <div className="bg-gradient-to-br from-[#e8f5e9] to-[#c8e6c9] rounded-[14px] p-3.5">
          <div className="text-xs font-bold text-[#1b5e20] mb-2">&#127822; 水果对照</div>
          <div className="flex items-center gap-3">
            <span className="text-5xl">{fruit.emoji}</span>
            <div>
              <div className="text-base font-extrabold text-[#1b5e20]">{fruit.name}</div>
              <div className="text-[11px] text-[#388e3c]">参考身长约{fruit.lengthCm}cm，体重约{fruit.weightG}g</div>
              <div className="text-[10px] text-text-secondary mt-1">数据参考：Hadlock 1991</div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
