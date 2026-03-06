'use client'

/**
 * P09-E: 情感支持对话场景 Mock 数据与安心资源链接卡片
 */

import type { ChatMessage } from '@/types'

/** 情感支持场景的 mock 消息 */
export const EMOTIONAL_SUPPORT_MESSAGES: ChatMessage[] = [
  {
    id: 'emo-1',
    role: 'user',
    type: 'text',
    content: '最近太累了，孕吐虽然好了，但心情还是很焦虑...',
    timestamp: '2026-03-06T14:35:00Z',
  },
  {
    id: 'emo-2',
    role: 'assistant',
    type: 'text',
    content:
      '抱抱你 孕早期刚过，身体在适应的同时，心理的压力也在一起累积，这种感受非常正常，你已经很棒了！\n\n孕14周前后，很多妈妈都会经历一段"情绪缓冲期"——早孕反应结束了，但对未知的焦虑开始浮现。这是孕激素和心理双重调整的阶段。\n\n你现在焦虑的，主要是哪方面呢？是担心宝宝健康、还是工作生活的变化、或者其他的事情？',
    timestamp: '2026-03-06T14:36:00Z',
  },
  {
    id: 'emo-3',
    role: 'user',
    type: 'text',
    content: '主要是担心唐筛结果，万一高风险怎么办',
    timestamp: '2026-03-06T14:37:00Z',
  },
  {
    id: 'emo-4',
    role: 'assistant',
    type: 'text',
    content:
      '这份担心很真实，我完全理解你。\n\n先给你一个安心数据：中期唐筛整体高风险率只有约3~5%，绝大多数妈妈都是低风险结果。\n\n而且，即使唐筛显示高风险，也**不代表宝宝有问题**，只是提示需要进一步检查（无创DNA或羊水穿刺），确诊率才是真正重要的数据。\n\n在结果出来之前，与其一直担心，不如把能做的事情做好：按时产检、保持好心情、适当运动。你身边有人陪你去产检吗？',
    timestamp: '2026-03-06T14:38:00Z',
    metadata: {
      links: [
        { text: '了解唐筛高风险后的处理流程', route: '/home/knowledge' },
        { text: '孕期焦虑自我疏导小技巧', route: '/home/knowledge' },
        { text: '记录今日心情（情绪日记）', route: '/assistant' },
      ],
    },
  },
]

/** 安心资源链接卡片组件 */
interface ComfortResourceCardProps {
  links: { text: string; route: string }[]
  onLinkClick?: (route: string) => void
}

export function ComfortResourceCard({ links, onLinkClick }: ComfortResourceCardProps) {
  return (
    <div className="bg-[#fdf6ee] rounded-[10px] px-3 py-2.5 mt-1.5">
      <div className="text-[11px] text-primary font-bold mb-1.5">
        &#128155; 给你一些安心资源
      </div>
      {links.map((link, i) => (
        <button
          key={i}
          onClick={() => onLinkClick?.(link.route)}
          className={`w-full text-left px-0 py-1.5 text-xs text-primary flex items-center gap-1 ${
            i < links.length - 1 ? 'border-b border-border-light' : ''
          }`}
        >
          <span>&#8250;</span> {link.text}
        </button>
      ))}
    </div>
  )
}
