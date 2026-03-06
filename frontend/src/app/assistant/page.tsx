'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import TabBar from '@/components/layout/TabBar'
import ChatBubble from '@/components/business/ChatBubble'
import type { ChatMessage } from '@/types'

/**
 * MOM助手 Tab - AI 对话界面
 * 包含欢迎区、孕周信息卡、快捷功能、聊天区域
 */

const MOCK_MESSAGES: ChatMessage[] = [
  {
    id: '1',
    role: 'assistant',
    type: 'text',
    content: '你好宝妈~ 现在孕14周3天了，进入孕中期第一周，恭喜你熬过了最辛苦的孕早期！\n\n本周最重要的事是预约中期唐筛，窗口期14~20周，不要错过哦！有什么想问的吗？',
    timestamp: '2026-03-06T09:20:00Z',
  },
  {
    id: '2',
    role: 'user',
    type: 'text',
    content: '中期唐筛、羊水穿刺、无创DNA有什么区别？',
    timestamp: '2026-03-06T09:21:00Z',
  },
  {
    id: '3',
    role: 'assistant',
    type: 'text',
    content: '这三个都是排查胎儿染色体异常的检查，区别在于准确率和风险：\n\n**中期唐筛** — 抽血+超声，筛查唐氏风险。准确率约70~85%，有假阳性，费用低，适合所有孕妈 ✅\n\n**无创DNA** — 抽妈妈血，检测胎儿DNA，准确率>99%，无创伤，但费用较高（约1500~2500元）\n\n**羊水穿刺** — 直接取羊水，准确率接近100%，但有0.5%流产风险，通常作为高风险后的确诊手段 ⚠️\n\n建议：唐筛高风险 → 无创或羊水穿刺；经济允许可直接选无创DNA跳过唐筛。',
    timestamp: '2026-03-06T09:22:00Z',
    metadata: {
      links: [
        { text: '查看产检日历', route: '/checkup' },
        { text: '设置下次产检提醒', route: '/checkup' },
        { text: '本周产检注意事项', route: '/checkup' },
      ],
    },
  },
  {
    id: '4',
    role: 'user',
    type: 'text',
    content: '我刚做了血常规，帮我看看',
    timestamp: '2026-03-06T09:25:00Z',
  },
  {
    id: '5',
    role: 'assistant',
    type: 'text',
    content: '收到！把血常规报告图片传给我，我来帮你解读',
    timestamp: '2026-03-06T09:25:30Z',
    metadata: {
      reportCard: {
        title: '产检报告解读',
        description: '有报告要解读，马上做第一步',
        emoji: '&#128202;',
        actionText: '马上解读',
        actionRoute: '/assistant/report-upload',
      },
    },
  },
  // P09-E: 情感支持对话场景
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
    content: '抱抱你 孕早期刚过，身体在适应的同时，心理的压力也在一起累积，这种感受非常正常，你已经很棒了！\n\n孕14周前后，很多妈妈都会经历一段"情绪缓冲期"——早孕反应结束了，但对未知的焦虑开始浮现。这是孕激素和心理双重调整的阶段。\n\n你现在焦虑的，主要是哪方面呢？是担心宝宝健康、还是工作生活的变化、或者其他的事情？',
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
    content: '这份担心很真实，我完全理解你。\n\n先给你一个安心数据：中期唐筛整体高风险率只有约3~5%，绝大多数妈妈都是低风险结果。\n\n而且，即使唐筛显示高风险，也**不代表宝宝有问题**，只是提示需要进一步检查（无创DNA或羊水穿刺），确诊率才是真正重要的数据。\n\n在结果出来之前，与其一直担心，不如把能做的事情做好：按时产检、保持好心情、适当运动。你身边有人陪你去产检吗？',
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

/** 打字机效果组件 - 逐字显示 AI 消息 */
function TypewriterBubble({
  content,
  onComplete,
}: {
  content: string
  onComplete: () => void
}) {
  const [displayedLength, setDisplayedLength] = useState(0)
  const fullText = content

  useEffect(() => {
    if (displayedLength >= fullText.length) {
      onComplete()
      return
    }
    const speed = 18 + Math.random() * 12
    const timer = setTimeout(() => setDisplayedLength((prev) => prev + 1), speed)
    return () => clearTimeout(timer)
  }, [displayedLength, fullText.length, onComplete])

  const displayed = fullText.slice(0, displayedLength)
  const html = displayed
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/\n/g, '<br />')

  return (
    <div
      className="px-3 py-2.5 rounded-card text-xs leading-[1.7] bg-white text-text-primary rounded-[4px_16px_16px_16px] shadow-card"
      dangerouslySetInnerHTML={{ __html: html }}
    />
  )
}

/** mock 用户是否已建档（有预产期） */
const HAS_PROFILE = true

export default function AssistantPage() {
  const router = useRouter()
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [inputText, setInputText] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const [typewriterMsgId, setTypewriterMsgId] = useState<string | null>(null)
  const chatEndRef = useRef<HTMLDivElement>(null)
  const messagesLoadedRef = useRef(false)

  // 模拟 AI 加载消息序列
  useEffect(() => {
    if (messagesLoadedRef.current) return
    messagesLoadedRef.current = true

    if (!HAS_PROFILE) return // 新用户走另一个分支

    // 先显示打字指示器，然后依次加载消息
    let currentIndex = 0
    const loadNext = () => {
      if (currentIndex >= MOCK_MESSAGES.length) return
      const msg = MOCK_MESSAGES[currentIndex]
      if (msg.role === 'assistant') {
        setIsTyping(true)
        setTimeout(() => {
          setIsTyping(false)
          setMessages((prev) => [...prev, msg])
          setTypewriterMsgId(msg.id)
          currentIndex++
        }, 800 + Math.random() * 400)
      } else {
        setMessages((prev) => [...prev, msg])
        currentIndex++
        setTimeout(loadNext, 300)
      }
    }
    loadNext()
  }, [])

  const handleTypewriterComplete = useCallback(() => {
    setTypewriterMsgId(null)
    // 加载下一条消息
    const currentLen = messages.length
    if (currentLen < MOCK_MESSAGES.length) {
      const nextMsg = MOCK_MESSAGES[currentLen]
      if (nextMsg.role === 'assistant') {
        setIsTyping(true)
        setTimeout(() => {
          setIsTyping(false)
          setMessages((prev) => [...prev, nextMsg])
          setTypewriterMsgId(nextMsg.id)
        }, 600 + Math.random() * 400)
      } else {
        setTimeout(() => {
          setMessages((prev) => [...prev, nextMsg])
          // 继续加载后续消息
          const afterUserIdx = currentLen + 1
          if (afterUserIdx < MOCK_MESSAGES.length) {
            const followUp = MOCK_MESSAGES[afterUserIdx]
            if (followUp.role === 'assistant') {
              setIsTyping(true)
              setTimeout(() => {
                setIsTyping(false)
                setMessages((prev) => [...prev, followUp])
                setTypewriterMsgId(followUp.id)
              }, 600 + Math.random() * 400)
            }
          }
        }, 300)
      }
    }
  }, [messages.length])

  // 自动滚动到底部
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, isTyping])

  const shortcuts = HAS_PROFILE
    ? [
        { icon: '&#128203;', iconBg: '#fff3e0', name: '产检记录', desc: '记录本次产检情况', route: '/checkup', disabled: false },
        { icon: '&#128300;', iconBg: '#e8f5e9', name: 'AI诊报', desc: '生化分析解读\n上传报告', route: '/assistant/report-upload', disabled: false },
        { icon: '&#129367;', iconBg: '#e3f2fd', name: '饮食助手', desc: '热量识别\n饮食控糖管理', route: '/diet', disabled: false },
      ]
    : [
        { icon: '&#128203;', iconBg: '#f5f5f5', name: '产检记录', desc: '录入预产期后解锁', route: '/checkup', disabled: true },
        { icon: '&#128300;', iconBg: '#e8f5e9', name: 'AI诊报', desc: '生化分析解读\n上传报告', route: '/assistant/report-upload', disabled: false },
        { icon: '&#129367;', iconBg: '#e3f2fd', name: '饮食助手', desc: '热量识别\n饮食控糖管理', route: '/diet', disabled: false },
      ]

  return (
    <div className="flex flex-col min-h-screen bg-bg">

      <div className="flex-1 overflow-y-auto hide-scrollbar">
        {/* 欢迎区 */}
        <div className="relative overflow-hidden bg-gradient-to-br from-[#fdf0e0] via-[#fde4c4] to-[#fcd8b0] px-5 pt-5 pb-4">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-[38px] h-[38px] bg-gradient-to-br from-primary-400 to-primary rounded-full flex items-center justify-center text-lg shadow-float">
              &#129302;
            </div>
            <div>
              <div className="text-[15px] font-extrabold text-[#5a3010]">MOM助手</div>
              <div className="text-[10px] text-[#b8895a]">孕期AI私人助理</div>
            </div>
          </div>
          <h2 className="text-xl font-extrabold text-[#3d1f00] leading-tight mb-2">
            Hi，我是MOM孕期智能助手 &#128075;
          </h2>
          <p className="text-xs text-[#8a5a30] leading-[1.8]">
            我可以为你解答各种孕期的各种疑惑。<br />
            你可以告诉我你的孕周，这样我就可以<br />
            针对性地为你解决问题。
          </p>
        </div>

        {/* 新用户未建档引导卡片 */}
        {!HAS_PROFILE && (
          <div className="mx-4 mt-3.5">
            <div className="bg-white rounded-card p-4 shadow-card-lg border-[1.5px] border-[rgba(232,124,62,0.2)]">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <div className="text-sm font-extrabold text-text-primary mb-1">预产期录入</div>
                  <div className="text-[11px] text-text-muted">完善信息后，开始孕期旅程</div>
                </div>
                <span className="text-[48px]">&#128203;</span>
              </div>
              <button
                onClick={() => router.push('/onboarding')}
                className="w-full py-3 bg-gradient-to-r from-primary-400 to-primary rounded-[12px] text-[13px] font-bold text-white shadow-button"
              >
                录入我的预产期
              </button>
            </div>
          </div>
        )}

        {/* 孕期信息卡 (仅已建档用户) */}
        {HAS_PROFILE && (
          <div className="mx-4 my-3 bg-white rounded-[14px] px-3.5 py-3 flex items-center justify-between shadow-card border border-[rgba(232,124,62,0.15)]">
            <div className="flex items-center gap-2.5">
              <span className="text-[26px]">&#129328;</span>
              <div>
                <div className="text-lg font-extrabold text-[#5a3010]">孕14周 3天</div>
                <div className="text-[10px] text-[#b8895a]">孕中期 · 第1周</div>
              </div>
            </div>
            <div className="text-right">
              <div className="text-[13px] font-bold text-primary">还有 182 天</div>
              <div className="text-[10px] text-text-muted">距预产期</div>
            </div>
          </div>
        )}

        {/* 快捷功能 */}
        <div className="px-4 pb-3">
          <div className="text-xs text-text-muted font-semibold mb-2">快捷功能</div>
          <div className="grid grid-cols-3 gap-2">
            {shortcuts.map((s) => (
              <button
                key={s.name}
                onClick={() => !s.disabled && router.push(s.route)}
                className={`bg-white rounded-[14px] p-3 text-center shadow-card transition-transform ${
                  s.disabled ? 'opacity-50 cursor-not-allowed' : 'active:scale-[0.96]'
                }`}
                disabled={s.disabled}
              >
                <div
                  className="w-11 h-11 rounded-xl flex items-center justify-center text-[26px] mx-auto mb-1.5"
                  style={{ background: s.iconBg }}
                  dangerouslySetInnerHTML={{ __html: s.icon }}
                />
                <div className="text-xs font-bold text-text-primary">{s.name}</div>
                <div className="text-[10px] text-text-muted mt-0.5 leading-tight whitespace-pre-line">
                  {s.desc}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* 聊天区域 */}
        <div className="px-4 pb-2">
          <div className="text-center my-2.5">
            <span className="inline-block px-3 py-0.5 bg-black/5 rounded-[10px] text-[10px] text-text-muted">
              今天 9:20
            </span>
          </div>

          {/* 新用户首条欢迎消息 */}
          {!HAS_PROFILE && (
            <div className="flex items-end gap-2 mb-3.5">
              <div className="w-[30px] h-[30px] rounded-full bg-gradient-to-br from-primary-400 to-primary flex items-center justify-center text-sm flex-shrink-0 shadow-[0_2px_6px_rgba(232,124,62,0.3)]">
                &#129302;
              </div>
              <div className="max-w-[240px]">
                <div className="text-[10px] text-text-muted mb-1">MOM助手</div>
                <div className="px-3 py-2.5 rounded-card text-xs leading-[1.7] bg-white text-text-primary rounded-[4px_16px_16px_16px] shadow-card">
                  你好，准妈妈~ 欢迎来到MOM助手！&#127800;<br /><br />
                  先告诉我你的预产期，这样我才能给你最精准的孕周建议。也可以直接向我提问哦！
                </div>
              </div>
            </div>
          )}

          {/* 已建档用户的消息列表（带打字机效果） */}
          {HAS_PROFILE && messages.map((msg) =>
            msg.role === 'assistant' && msg.id === typewriterMsgId ? (
              <div key={msg.id} className="flex items-end gap-2 mb-3.5">
                <div className="w-[30px] h-[30px] rounded-full bg-gradient-to-br from-primary-400 to-primary flex items-center justify-center text-sm flex-shrink-0 shadow-[0_2px_6px_rgba(232,124,62,0.3)]">
                  &#129302;
                </div>
                <div className="max-w-[240px]">
                  <div className="text-[10px] text-text-muted mb-1">MOM助手</div>
                  <TypewriterBubble
                    content={msg.content}
                    onComplete={handleTypewriterComplete}
                  />
                  {/* 链接和卡片在打字完成后显示 */}
                </div>
              </div>
            ) : (
              <ChatBubble
                key={msg.id}
                message={msg}
                onLinkClick={(link) => router.push(link.route)}
              />
            )
          )}

          {/* AI 打字指示器 */}
          {isTyping && (
            <div className="flex items-end gap-2 mb-3.5">
              <div className="w-[30px] h-[30px] rounded-full bg-gradient-to-br from-primary-400 to-primary flex items-center justify-center text-sm flex-shrink-0 shadow-[0_2px_6px_rgba(232,124,62,0.3)]">
                &#129302;
              </div>
              <div className="bg-white rounded-[4px_16px_16px_16px] shadow-card px-3.5 py-2.5">
                <div className="flex gap-1 items-center">
                  {[0, 1, 2].map((i) => (
                    <div
                      key={i}
                      className="w-[7px] h-[7px] rounded-full bg-text-light animate-typing"
                      style={{ animationDelay: `${i * 0.2}s` }}
                    />
                  ))}
                </div>
              </div>
            </div>
          )}

          <div ref={chatEndRef} />
        </div>
      </div>

      {/* 输入栏 */}
      <div className="bg-white px-4 py-2.5 flex items-center gap-2.5 border-t border-border">
        <button className="w-9 h-9 rounded-full bg-bg flex items-center justify-center text-lg flex-shrink-0">
          &#127908;
        </button>
        <input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder="向孕期智能助手提问..."
          className="flex-1 py-2 px-3.5 bg-bg rounded-chip text-[13px] text-text-tertiary outline-none"
        />
        <button className="w-9 h-9 rounded-full bg-bg flex items-center justify-center text-lg flex-shrink-0">
          &#128247;
        </button>
        <button className="w-9 h-9 rounded-full bg-gradient-to-br from-primary-400 to-primary flex items-center justify-center text-base text-white flex-shrink-0 shadow-[0_2px_8px_rgba(232,124,62,0.35)]">
          &#8593;
        </button>
      </div>

      <TabBar />
    </div>
  )
}
