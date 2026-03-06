'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'

const TABS = [
  { key: 'home', label: '首页', emoji: '🏠', path: '/home' },
  { key: 'assistant', label: 'MOM助手', emoji: '🤖', path: '/assistant' },
  { key: 'profile', label: '我的', emoji: '👤', path: '/profile' },
]

export default function TabBar() {
  const pathname = usePathname()

  const getActiveTab = () => {
    for (const tab of TABS) {
      if (pathname.startsWith(tab.path)) {
        return tab.key
      }
    }
    return 'home'
  }

  const activeTab = getActiveTab()

  return (
    <div className="sticky bottom-0 bg-white border-t border-border flex py-1.5 pb-2.5 z-[100] safe-bottom">
      {TABS.map((tab) => {
        const isActive = activeTab === tab.key
        return (
          <Link
            key={tab.key}
            href={tab.path}
            className="flex-1 flex flex-col items-center gap-[3px] cursor-pointer"
          >
            <span className="text-[22px]">{tab.emoji}</span>
            <span
              className={cn(
                'text-[10px]',
                isActive ? 'text-primary font-semibold' : 'text-text-muted'
              )}
            >
              {tab.label}
            </span>
          </Link>
        )
      })}
    </div>
  )
}
