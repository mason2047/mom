'use client'

import { useRouter } from 'next/navigation'
import NavBar from '@/components/layout/NavBar'

/**
 * 月子中心详情页
 * 轮播图、基本信息、套餐选择、设施服务、用户评价
 */

const PACKAGES = [
  { name: '标准套餐 · 28天', price: '39,800', desc: '单人间、三餐一点、基础产后康复', selected: false },
  { name: '尊享套餐 · 28天', price: '58,800', desc: 'VIP套房、定制月子餐、一对一催乳、宝宝SPA', selected: true },
  { name: '皇后套餐 · 42天', price: '89,800', desc: '独栋别墅、私人管家、全套产后修复', selected: false },
]

const FEATURES = [
  '24h专业护理',
  '新生儿游泳',
  '产后瑜伽',
  '母乳指导',
  '营养月子餐',
  '宝宝早教',
  '中医调理',
  '心理疏导',
]

const REVIEWS = [
  {
    name: '小L妈妈',
    week: '产后2个月',
    stars: 5,
    text: '环境非常好，护士很专业负责！月子餐很好吃而且每天不重样。产后康复效果也很明显，推荐给准妈妈们！',
  },
  {
    name: '朵朵妈',
    week: '孕36周预定',
    stars: 4,
    text: '参观了好几家最终选了这里，性价比很高。唯一不足是停车位有点紧张。',
  },
]

export default function CenterDetailPage() {
  const router = useRouter()

  return (
    <div className="flex flex-col min-h-screen bg-bg">
      <NavBar title="中心详情" onBack={() => router.back()} />

      <div className="flex-1 overflow-y-auto hide-scrollbar pb-24">
        {/* Hero Image */}
        <div className="w-full h-[200px] bg-gradient-to-br from-[#fff0f4] to-[#ffe0ea] flex items-center justify-center text-[70px] relative">
          &#127968;
          <div className="absolute bottom-2.5 left-1/2 -translate-x-1/2 flex gap-1.5">
            <div className="w-4 h-1.5 rounded bg-white" />
            <div className="w-1.5 h-1.5 rounded-full bg-white/50" />
            <div className="w-1.5 h-1.5 rounded-full bg-white/50" />
          </div>
        </div>

        {/* Info */}
        <div className="bg-white px-5 py-4 border-b border-border">
          <div className="flex gap-1.5 mb-2">
            <span className="bg-rose/90 text-white text-[10px] px-1.5 py-0.5 rounded-lg font-semibold">&#10003; 已认证</span>
            <span className="bg-gold/90 text-white text-[10px] px-1.5 py-0.5 rounded-lg font-semibold">&#11088; 推荐</span>
          </div>
          <h1 className="text-xl font-bold text-text-primary mb-1">爱帝宫月子中心</h1>
          <div className="text-[13px] text-text-muted flex items-center gap-1 mb-1">
            &#128205; 北京市朝阳区望京SOHO T3 · 距你3.2km
          </div>
          <div className="flex gap-3 text-xs text-text-muted mt-1.5">
            <span className="flex items-center gap-1 text-gold">&#11088; 4.8</span>
            <span>326条评价</span>
            <span>已服务 1200+ 家庭</span>
          </div>
        </div>

        {/* Packages */}
        <div className="bg-white mx-4 mt-3 rounded-card p-3.5 shadow-card">
          <h2 className="text-sm font-semibold text-text-primary mb-2.5 flex items-center gap-1.5">
            &#128179; 套餐选择
          </h2>
          {PACKAGES.map((pkg) => (
            <div
              key={pkg.name}
              className={`border-[1.5px] rounded-[12px] p-3 mb-2 ${
                pkg.selected ? 'border-rose bg-[#fff8fa]' : 'border-border'
              }`}
            >
              <div className="text-sm font-semibold text-text-primary mb-1">{pkg.name}</div>
              <div className="text-lg font-bold text-rose">&#165;{pkg.price}</div>
              <div className="text-xs text-text-muted mt-1">{pkg.desc}</div>
            </div>
          ))}
        </div>

        {/* Features */}
        <div className="bg-white mx-4 mt-3 rounded-card p-3.5 shadow-card">
          <h2 className="text-sm font-semibold text-text-primary mb-2.5 flex items-center gap-1.5">
            &#10024; 设施与服务
          </h2>
          <div className="grid grid-cols-2 gap-2">
            {FEATURES.map((f) => (
              <div key={f} className="flex items-center gap-1.5 text-xs text-text-secondary">
                <span className="text-green text-[13px]">&#10003;</span> {f}
              </div>
            ))}
          </div>
        </div>

        {/* Reviews */}
        <div className="bg-white mx-4 mt-3 mb-4 rounded-card p-3.5 shadow-card">
          <h2 className="text-sm font-semibold text-text-primary mb-2.5 flex items-center gap-1.5">
            &#128172; 用户评价
          </h2>
          {REVIEWS.map((review, i) => (
            <div
              key={review.name}
              className={`py-3 ${i < REVIEWS.length - 1 ? 'border-b border-border' : ''}`}
            >
              <div className="flex items-center gap-2 mb-1.5">
                <div className="w-7 h-7 rounded-full bg-gradient-to-br from-[#ffb8c8] to-[#ff8090] flex items-center justify-center text-xs text-white font-semibold">
                  {review.name[0]}
                </div>
                <span className="text-[13px] font-medium text-text-primary">{review.name}</span>
                <span className="text-[11px] text-text-muted">{review.week}</span>
                <span className="text-xs text-gold ml-auto">
                  {'&#11088;'.repeat(review.stars)}
                </span>
              </div>
              <p className="text-xs text-text-secondary leading-relaxed">{review.text}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="flex gap-2.5 p-4 bg-white border-t border-border sticky bottom-0">
        <button className="flex-1 h-12 rounded-[12px] bg-[#fff0f4] border-[1.5px] border-rose text-[15px] font-semibold text-rose">
          &#128172; 在线咨询
        </button>
        <button
          onClick={() => router.push('/maternity/booking')}
          className="flex-1 h-12 rounded-[12px] bg-gradient-to-br from-rose to-[#c04060] text-[15px] font-semibold text-white"
        >
          立即预约
        </button>
      </div>
    </div>
  )
}
