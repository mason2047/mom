'use client'

import { useState } from 'react'
import Card from '@/components/ui/Card'

/**
 * 宝宝说卡片组件
 * 展示宝宝的"发言"（拟人化文案）
 */
const MOCK_BABY_TALKS = [
  '妈妈，我现在已经会做鬼脸了哦！会皱眉和微笑，是不是很厉害？我的手指头和脚趾头都长出来了，最近很喜欢伸懒腰~',
  '妈妈你好呀！我现在能听到你的心跳声了，好温暖~你说话的时候我也能感觉到震动呢，多跟我聊聊天吧！',
  '今天我又长大了一点点！我的眼睛虽然还没睁开，但已经能感受到光线了。妈妈记得多晒太阳哦~',
  '妈妈，我的小手已经能握拳了！有时候还会不小心抓到自己的脐带玩，嘿嘿~',
  '我今天练习了吞咽羊水，为以后吃奶做准备呢！妈妈你吃的东西味道我都能尝到一点点哦~',
]

interface BabyTalkCardProps {
  fruitEmoji: string
  text: string
}

export default function BabyTalkCard({ fruitEmoji, text }: BabyTalkCardProps) {
  const [expanded, setExpanded] = useState(false)
  const [currentText, setCurrentText] = useState(text)
  const [talkIndex, setTalkIndex] = useState(0)

  const handleRefresh = () => {
    const nextIndex = (talkIndex + 1) % MOCK_BABY_TALKS.length
    setTalkIndex(nextIndex)
    setCurrentText(MOCK_BABY_TALKS[nextIndex])
    setExpanded(false)
  }

  return (
    <div className="mx-4 mb-3">
      <Card className="border-l-4 border-l-primary" padding="sm">
        <div className="text-xs font-bold text-primary mb-2 flex items-center gap-1">
          <span>&#128172;</span> 宝宝说
          <button
            onClick={handleRefresh}
            className="ml-auto text-[11px] text-primary font-normal active:opacity-70"
          >
            换一换
          </button>
        </div>
        <div className="flex gap-2.5">
          <div className="w-16 h-16 bg-gradient-to-br from-[#fde8c8] to-[#fcd4a0] rounded-xl flex items-center justify-center text-[30px] flex-shrink-0">
            {fruitEmoji}
          </div>
          <div className="flex-1">
            <div
              className={`text-xs text-text-secondary leading-relaxed ${
                !expanded ? 'line-clamp-3' : ''
              }`}
            >
              {currentText}
            </div>
            <button
              onClick={() => setExpanded(!expanded)}
              className="text-[11px] text-primary mt-1"
            >
              {expanded ? '收起 <' : '展开 >'}
            </button>
          </div>
        </div>
      </Card>
    </div>
  )
}
