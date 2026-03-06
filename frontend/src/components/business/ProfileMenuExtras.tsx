'use client'

import Link from 'next/link'

/**
 * P19: 个人中心扩展菜单项组件
 * 包含：我的积分、邀请有礼、我的活动
 */

/** 幸孕币迷你卡片 */
function CoinMiniCard({ amount }: { amount: number }) {
  return (
    <div className="bg-gradient-to-r from-[#fff8f0] to-[#ffeedd] rounded-[10px] px-3 py-1.5 flex items-center gap-1.5 mr-2">
      <span className="text-lg font-extrabold text-primary">{amount.toLocaleString()}</span>
      <span className="text-[11px] text-[#c0956a]">币</span>
    </div>
  )
}

interface MenuItemConfig {
  icon: string
  iconBg: string
  title: string
  desc: string
  route?: string
  badge?: React.ReactNode
}

const EXTRA_MENU_ITEMS: MenuItemConfig[] = [
  {
    icon: '&#129689;',
    iconBg: 'bg-[#fff8e8]',
    title: '我的积分',
    desc: '幸孕币 · 今日已得35币',
    route: '/profile/coins',
    badge: <CoinMiniCard amount={1280} />,
  },
  {
    icon: '&#128156;',
    iconBg: 'bg-purple-50',
    title: '邀请有礼',
    desc: '邀请闺蜜，每人最高+65币',
    route: '/profile/invite',
    badge: (
      <span className="bg-primary text-white text-[11px] font-semibold px-2 py-0.5 rounded-[10px]">
        已邀3人
      </span>
    ),
  },
  {
    icon: '&#127914;',
    iconBg: 'bg-green-50',
    title: '我的活动',
    desc: '孕期活动 · 健康讲座',
    badge: (
      <span className="bg-primary-100 text-primary text-[11px] font-semibold px-2 py-0.5 rounded-[10px] border border-[rgba(232,116,74,0.2)]">
        1场可报名
      </span>
    ),
  },
]

export default function ProfileMenuExtras() {
  return (
    <div className="px-4 mt-4">
      <div className="text-xs text-text-muted font-semibold mb-2 px-1 tracking-wider">
        会员权益
      </div>
      <div className="bg-white rounded-card overflow-hidden shadow-card-md">
        {EXTRA_MENU_ITEMS.map((item, i) => {
          const content = (
            <>
              <div
                className={`w-[38px] h-[38px] rounded-[10px] flex items-center justify-center text-xl flex-shrink-0 ${item.iconBg}`}
                dangerouslySetInnerHTML={{ __html: item.icon }}
              />
              <div className="flex-1 min-w-0">
                <div className="text-[15px] font-semibold text-text-primary">{item.title}</div>
                <div className="text-xs text-text-secondary mt-0.5">{item.desc}</div>
              </div>
              <div className="flex items-center gap-1.5 flex-shrink-0">
                {item.badge}
                <span className="text-sm text-text-muted">&#8250;</span>
              </div>
            </>
          )

          const className = `w-full flex items-center px-4 py-3.5 gap-3 text-left active:bg-[#faf7f3] transition-colors ${
            i < EXTRA_MENU_ITEMS.length - 1 ? 'border-b border-border' : ''
          }`

          return item.route ? (
            <Link key={item.title} href={item.route} className={className}>
              {content}
            </Link>
          ) : (
            <div key={item.title} className={className}>
              {content}
            </div>
          )
        })}
      </div>
    </div>
  )
}

/** 扩展的快捷数据条第4项 */
export function SampleCountStat() {
  return (
    <div className="flex-1 flex flex-col items-center gap-0.5">
      <span className="text-xl font-extrabold text-primary">3次</span>
      <span className="text-[11px] text-[#9a7a65]">已领小样</span>
    </div>
  )
}
