'use client'

/**
 * 热门兑换商城组件
 * 展示 3 个兑换商品卡片（母婴小样/产检优惠券/月子中心体验）
 */

interface RedeemItem {
  icon: string
  name: string
  coins: number
  desc: string
}

const REDEEM_ITEMS: RedeemItem[] = [
  { icon: '🍼', name: '母婴小样礼包', coins: 500, desc: '品牌奶粉/护肤试用装' },
  { icon: '🏥', name: '产检优惠券', coins: 800, desc: '合作医院产检减免20元' },
  { icon: '🏠', name: '月子中心体验', coins: 1200, desc: '参观体验+精美伴手礼' },
]

export default function RedeemShop() {
  return (
    <div className="bg-white mx-4 mt-3 rounded-card p-4 shadow-card">
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-sm font-semibold text-text-primary">🎁 热门兑换</h2>
        <span className="text-xs text-primary">查看全部 &gt;</span>
      </div>
      <div className="grid grid-cols-3 gap-2.5">
        {REDEEM_ITEMS.map((item) => (
          <div
            key={item.name}
            className="bg-[#fff8f0] rounded-[12px] p-3 text-center flex flex-col items-center"
          >
            <div className="text-3xl mb-1.5">{item.icon}</div>
            <div className="text-[12px] font-semibold text-text-primary mb-0.5">{item.name}</div>
            <div className="text-[10px] text-text-muted mb-2 line-clamp-1">{item.desc}</div>
            <div className="text-[11px] font-bold text-gold mb-1.5">{item.coins} 币</div>
            <button className="w-full py-1 rounded-chip bg-primary text-white text-[11px] font-medium">
              去兑换
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}
