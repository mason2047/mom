'use client'

import Link from 'next/link'
import NavBar from '@/components/layout/NavBar'
import Badge from '@/components/ui/Badge'
import ToggleSwitch from '@/components/ui/ToggleSwitch'

/**
 * P07 - 产检详情页
 * 展示检查项目、注意事项、携带清单、提醒设置
 */

const CHECKUP_ITEMS = [
  {
    icon: '&#128300;',
    title: '大排畸超声（II级/III级）',
    desc: '系统排查胎儿重大结构性异常，包括心脏、脑部、脊柱、四肢等器官发育情况，是孕期最重要的超声检查之一。',
  },
  {
    icon: '&#129656;',
    title: '血常规',
    desc: '检测血红蛋白、白细胞、血小板等指标，排查贫血及感染。',
  },
  {
    icon: '&#129514;',
    title: '尿常规',
    desc: '检测尿蛋白、尿糖等，监测肾功能和妊娠糖尿病风险。',
  },
]

const BRING_LIST = [
  { text: '产检手册/母婴健康手册', checked: true },
  { text: '身份证 + 医保卡', checked: true },
  { text: '上次产检报告单', checked: true },
  { text: '宽松上衣（方便检查）', checked: false },
  { text: '一瓶水（排畸后可饮用）', checked: false },
]

export default function CheckupDetailPage() {
  return (
    <div className="flex flex-col min-h-screen bg-bg">
      <NavBar title="产检详情" backHref="/checkup" />

      <div className="flex-1 overflow-y-auto hide-scrollbar pb-24">
        {/* Hero */}
        <div className="bg-gradient-to-br from-[#fff6f0] to-white px-5 py-5 border-b border-border">
          <div className="flex items-center gap-2 mb-2">
            <Badge variant="info">第3次产检</Badge>
            <span className="text-[13px] text-text-muted">孕20~24周</span>
          </div>
          <h1 className="text-xl font-bold text-text-primary mb-1">大排畸超声检查</h1>
          <div className="text-[13px] text-text-secondary flex items-center gap-1">
            <span dangerouslySetInnerHTML={{ __html: '&#128197;' }} />
            预计产检时间：2026年3月26日（周四）
          </div>
        </div>

        {/* 检查项目 */}
        <div className="bg-white mx-4 mt-3 rounded-card p-4 shadow-card">
          <h2 className="text-[13px] font-semibold text-text-primary mb-3 flex items-center gap-1.5">
            <span dangerouslySetInnerHTML={{ __html: '&#128203;' }} /> 本次检查项目
          </h2>
          {CHECKUP_ITEMS.map((item, i) => (
            <div
              key={item.title}
              className={`flex items-start gap-2.5 py-2.5 ${
                i < CHECKUP_ITEMS.length - 1 ? 'border-b border-[#f9f5f0]' : ''
              }`}
            >
              <span className="text-lg flex-shrink-0 mt-0.5" dangerouslySetInnerHTML={{ __html: item.icon }} />
              <div>
                <div className="text-sm font-medium text-text-primary mb-0.5">{item.title}</div>
                <div className="text-xs text-text-secondary leading-relaxed">{item.desc}</div>
              </div>
            </div>
          ))}
        </div>

        {/* 注意事项 */}
        <div className="bg-white mx-4 mt-3 rounded-card p-4 shadow-card">
          <h2 className="text-[13px] font-semibold text-text-primary mb-3 flex items-center gap-1.5">
            &#9888;&#65039; 注意事项
          </h2>
          <div className="bg-[#fff8f3] border-l-[3px] border-primary rounded-lg p-3">
            <div className="text-xs text-[#a06030] leading-relaxed">
              <strong>排畸超声重点提醒：</strong><br /><br />
              · 建议穿着宽松、容易掀开腹部的衣物<br />
              · 胎儿配合度影响检查时长，部分孕妇需等待30~60分钟<br />
              · 检查前适量饮水（非空腹），保持轻松心情<br /><br />
              · 血常规+尿常规 <strong>无需空腹</strong>，检查顺序灵活
            </div>
          </div>
        </div>

        {/* 记得带上 */}
        <div className="bg-white mx-4 mt-3 rounded-card p-4 shadow-card">
          <h2 className="text-[13px] font-semibold text-text-primary mb-3 flex items-center gap-1.5">
            &#128230; 记得带上
          </h2>
          <div className="flex flex-col gap-2">
            {BRING_LIST.map((item) => (
              <div key={item.text} className="flex items-center gap-2 text-[13px] text-text-secondary">
                <div
                  className={`w-4 h-4 rounded flex items-center justify-center flex-shrink-0 text-[10px] text-white ${
                    item.checked ? 'bg-green' : 'bg-border'
                  }`}
                >
                  {item.checked && '&#10003;'}
                </div>
                {item.text}
              </div>
            ))}
          </div>
        </div>

        {/* 提醒设置 */}
        <div className="bg-white mx-4 mt-3 mb-4 rounded-card p-4 shadow-card">
          <h2 className="text-[13px] font-semibold text-text-primary mb-3 flex items-center gap-1.5">
            &#128276; 提醒设置
          </h2>
          <div className="flex flex-col gap-2.5">
            {[
              { label: '提前3天提醒（3月23日）', on: true },
              { label: '提前1天提醒（3月25日）', on: true },
              { label: '当天早晨提醒（07:30）', on: false },
            ].map((item) => (
              <div key={item.label} className="flex justify-between items-center">
                <span className="text-[13px] text-text-secondary">{item.label}</span>
                <ToggleSwitch checked={item.on} onChange={() => {}} />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Actions */}
      <div className="flex gap-2.5 p-4 bg-white border-t border-border sticky bottom-0">
        <button className="flex-1 h-[46px] rounded-[12px] border-[1.5px] border-border-dark bg-white text-[15px] font-semibold text-text-secondary">
          修改时间
        </button>
        <Link
          href="/checkup/record"
          className="flex-1 h-[46px] rounded-[12px] bg-primary text-white text-[15px] font-semibold flex items-center justify-center"
        >
          记录产检结果
        </Link>
      </div>
    </div>
  )
}
