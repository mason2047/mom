'use client'

/**
 * P09: 聊天消息时间戳日期分割线
 * 显示 "今天 9:20" 样式的 chip
 */

interface ChatDateDividerProps {
  text: string
}

export default function ChatDateDivider({ text }: ChatDateDividerProps) {
  return (
    <div className="text-center my-2.5">
      <span className="inline-block px-3 py-0.5 bg-black/5 rounded-[10px] text-[10px] text-text-muted">
        {text}
      </span>
    </div>
  )
}
