'use client'

import { usePathname, useRouter } from 'next/navigation'
import { cn } from '@/lib/utils'

/**
 * 底部标签栏组件
 * 三个 Tab: 首页、MOM助手、我的
 */

interface TabItem {
  key: string
  label: string
  emoji: string
  path: string
}

const TABS: TabItem[] = [
  { key: 'home', label: '首页', emoji: '\uD83C\uDFE0', path: '/home' },
  { key: 'assistant', label: 'MOM助手', emoji: '\uD83E\uDD16', path: '/assistant' },
  { key: 'profile', label: '我的', emoji: '\uD83D\uDC64', path: '/profile' },
]

export default function TabBar() {
  const pathname = usePathname()
  const router = useRouter()

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
          <button
            key={tab.key}
            onClick={() => router.push(tab.path)}
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
          </button>
        )
      })}
    </div>
  )
}
