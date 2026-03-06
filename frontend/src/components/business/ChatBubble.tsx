'use client'

import { cn } from '@/lib/utils'
import type { ChatMessage, LinkSuggestion } from '@/types'

/**
 * 聊天气泡组件
 * 支持 AI 和用户两种角色的消息展示
 */
interface ChatBubbleProps {
  message: ChatMessage
  onLinkClick?: (link: LinkSuggestion) => void
}

export default function ChatBubble({ message, onLinkClick }: ChatBubbleProps) {
  const isUser = message.role === 'user'

  // 打字动画
  if (message.type === 'typing') {
    return (
      <div className="flex items-end gap-2 mb-3.5">
        <AvatarAI />
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
    )
  }

  return (
    <div className={cn('flex items-end gap-2 mb-3.5', isUser ? 'flex-row-reverse' : 'flex-row')}>
      {!isUser && <AvatarAI />}
      <div className="max-w-[240px]">
        {!isUser && (
          <div className="text-[10px] text-text-muted mb-1">MOM助手</div>
        )}
        <div
          className={cn(
            'px-3 py-2.5 rounded-card text-xs leading-[1.7]',
            isUser
              ? 'bg-gradient-to-br from-primary-400 to-primary text-white rounded-[16px_4px_16px_16px]'
              : 'bg-white text-text-primary rounded-[4px_16px_16px_16px] shadow-card'
          )}
          dangerouslySetInnerHTML={{ __html: formatContent(message.content) }}
        />

        {/* 链接建议 */}
        {message.metadata?.links && message.metadata.links.length > 0 && (
          <div className="bg-white rounded-[10px] mt-1.5 overflow-hidden shadow-card">
            {message.metadata.links.map((link, i) => (
              <button
                key={i}
                onClick={() => onLinkClick?.(link)}
                className="w-full px-3 py-2 text-xs text-primary border-b border-border-light last:border-b-0 text-left flex items-center gap-1 hover:bg-bg-warm"
              >
                <span>&#8250;</span> {link.text}
              </button>
            ))}
          </div>
        )}

        {/* 安心资源卡片 */}
        {message.metadata?.reassuranceCard && (
          <div className="bg-[#fdf6ee] rounded-[10px] px-3 py-2.5 mt-1.5">
            <div className="text-[11px] text-primary font-bold mb-1.5">
              {message.metadata.reassuranceCard.title}
            </div>
            {message.metadata.reassuranceCard.links.map((link, i) => (
              <button
                key={i}
                onClick={() => onLinkClick?.(link)}
                className={`w-full py-1.5 text-xs text-primary text-left flex items-center gap-1 ${
                  i < message.metadata!.reassuranceCard!.links.length - 1
                    ? 'border-b border-[#f5f0ea]'
                    : ''
                }`}
              >
                <span>&#8250;</span> {link.text}
              </button>
            ))}
          </div>
        )}

        {/* 报告卡片 */}
        {message.metadata?.reportCard && (
          <div className="bg-white rounded-[14px] p-3.5 shadow-card-md mt-1.5 border border-[rgba(232,124,62,0.15)]">
            <div className="flex items-start justify-between mb-2.5">
              <div>
                <div className="text-[13px] font-extrabold text-text-primary mb-0.5">
                  {message.metadata.reportCard.title}
                </div>
                <div className="text-[11px] text-text-muted">
                  {message.metadata.reportCard.description}
                </div>
              </div>
              <span className="text-[32px]">{message.metadata.reportCard.emoji}</span>
            </div>
            <button className="w-full py-2.5 bg-gradient-to-r from-primary-400 to-primary text-white text-[13px] font-bold rounded-[10px] shadow-button">
              {message.metadata.reportCard.actionText}
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

function AvatarAI() {
  return (
    <div className="w-[30px] h-[30px] rounded-full bg-gradient-to-br from-primary-400 to-primary flex items-center justify-center text-sm flex-shrink-0 shadow-[0_2px_6px_rgba(232,124,62,0.3)]">
      &#129302;
    </div>
  )
}

/** 简易 Markdown -> HTML（加粗、换行） */
function formatContent(content: string): string {
  return content
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/\n/g, '<br />')
}
