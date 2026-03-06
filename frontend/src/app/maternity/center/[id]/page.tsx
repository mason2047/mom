import Link from 'next/link'
import NavBar from '@/components/layout/NavBar'

/**
 * 月子中心详情页
 * 轮播图、基本信息、套餐选择、设施服务、用户评价
 */

const PACKAGES = [
  { name: '标准双人间套餐', price: '18,800', desc: '含三餐月子餐 · 新生儿护理 · 妈妈护理 · 产后恢复课程', selected: false },
  { name: '尊享单人间套餐', price: '26,800', desc: '独立套房 · 专属月嫂24h陪护 · GDM定制月子餐 · 全套产后恢复', selected: true },
  { name: '豪华套房套餐', price: '38,000', desc: '豪华亲子套房 · 高级月嫂 · 私人营养师 · VIP催乳顾问', selected: false },
]

const FEATURES = [
  '24h专业护士值班',
  '三餐营养月子餐',
  '新生儿护理培训',
  '产后恢复课程',
  '母乳喂养指导',
  '宝宝游泳/抚触',
  'GDM控糖餐定制',
  '孕产期心理疏导',
]

const NEARBY_CENTERS = [
  { name: '安心月子', price: '12,800', emoji: '&#127968;', bgFrom: '#f0f8ff', bgTo: '#e0ecff' },
  { name: '康乐产后', price: '22,000', emoji: '&#127800;', bgFrom: '#fff8e0', bgTo: '#ffe8b0' },
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
  return (
    <div className="flex flex-col min-h-screen bg-bg">
      <NavBar title="中心详情" backHref="/maternity" />

      <div className="flex-1 overflow-y-auto hide-scrollbar pb-24">
        {/* Hero Image / Swiper */}
        <div className="w-full h-[200px] bg-gradient-to-br from-[#fff0f4] to-[#ffe0ea] flex items-center justify-center text-[70px] relative">
          &#127973;
          <div className="absolute top-2.5 left-2.5 flex gap-1.5">
            <span className="bg-rose/90 text-white text-[10px] px-1.5 py-0.5 rounded-lg font-semibold">&#9733; 认证机构</span>
            <span className="bg-gold/90 text-white text-[10px] px-1.5 py-0.5 rounded-lg font-semibold">AI金牌推荐</span>
          </div>
          <div className="absolute bottom-2.5 left-1/2 -translate-x-1/2 flex gap-1.5">
            <div className="w-4 h-1.5 rounded bg-white" />
            <div className="w-1.5 h-1.5 rounded-full bg-white/50" />
            <div className="w-1.5 h-1.5 rounded-full bg-white/50" />
            <div className="w-1.5 h-1.5 rounded-full bg-white/50" />
            <div className="w-1.5 h-1.5 rounded-full bg-white/50" />
          </div>
          <div className="absolute bottom-[30px] right-2.5 bg-black/50 text-white text-[10px] px-2 py-0.5 rounded-lg">1 / 5</div>
        </div>

        {/* Info */}
        <div className="bg-white px-5 py-4 border-b border-border">
          <div className="flex gap-1.5 mb-2">
            <span className="bg-[#fff0f4] text-rose text-[10px] px-2 py-0.5 rounded-md font-medium">GDM月子餐</span>
            <span className="bg-[#f0f9f5] text-green text-[10px] px-2 py-0.5 rounded-md font-medium">双胞胎专区</span>
            <span className="bg-[#f0f4ff] text-blue text-[10px] px-2 py-0.5 rounded-md font-medium">剖宫产护理</span>
          </div>
          <h1 className="text-xl font-bold text-text-primary mb-1">馨和月子养护中心</h1>
          <div className="text-[13px] text-text-muted flex items-center gap-1 mb-1">
            &#128205; 北京市朝阳区建国路88号 · 距您约3.2公里
          </div>
          <div className="flex gap-3 text-xs text-text-muted mt-1.5">
            <span className="flex items-center gap-1 text-gold">&#11088; <strong>4.9</strong> 分</span>
            <span>&#128172; 328条评价</span>
            <span>&#128106; 1200+家庭</span>
          </div>
        </div>

        {/* Packages */}
        <div className="bg-white mx-4 mt-3 rounded-card p-3.5 shadow-card">
          <h2 className="text-sm font-semibold text-text-primary mb-2.5 flex items-center gap-1.5">
            &#128716; 套餐选择
          </h2>
          {PACKAGES.map((pkg) => (
            <div
              key={pkg.name}
              className={`border-[1.5px] rounded-[12px] p-3 mb-2 ${
                pkg.selected ? 'border-rose bg-[#fff8fa]' : 'border-border'
              }`}
            >
              <div className="flex justify-between items-center">
                <div className="text-sm font-semibold text-text-primary mb-1">
                  {pkg.name}{pkg.selected && ' \u2713'}
                </div>
                {pkg.selected && (
                  <div className="text-[10px] text-rose">已选中</div>
                )}
              </div>
              <div className="text-lg font-bold text-rose">
                &#165;{pkg.price}
                <span className="text-xs text-text-muted font-normal"> / 28天</span>
              </div>
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
        <div className="bg-white mx-4 mt-3 rounded-card p-3.5 shadow-card">
          <h2 className="text-sm font-semibold text-text-primary mb-2.5 flex items-center gap-1.5">
            &#128172; 用户评价（326条）
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
                <div>
                  <span className="text-[13px] font-medium text-text-primary">{review.name}</span>
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs text-gold">
                      {Array.from({ length: review.stars }).map((_, j) => '\u2605').join('')}
                    </span>
                    <span className="text-[10px] text-text-muted">{review.week}</span>
                  </div>
                </div>
              </div>
              <p className="text-xs text-text-secondary leading-relaxed">{review.text}</p>
            </div>
          ))}
          <div className="text-center pt-2.5">
            <span className="text-[13px] text-rose cursor-pointer">查看全部评价 &#8250;</span>
          </div>
        </div>

        {/* 附近妈妈也在看 */}
        <div className="px-4 mt-3 mb-4">
          <div className="text-[13px] font-semibold text-text-primary mb-2">附近妈妈也在看</div>
          <div className="flex gap-2 overflow-x-auto hide-scrollbar pb-1">
            {NEARBY_CENTERS.map((c) => (
              <div
                key={c.name}
                className="flex-shrink-0 w-[120px] bg-white rounded-[12px] overflow-hidden shadow-card"
              >
                <div
                  className="h-[70px] flex items-center justify-center text-[28px]"
                  style={{ background: `linear-gradient(135deg, ${c.bgFrom}, ${c.bgTo})` }}
                  dangerouslySetInnerHTML={{ __html: c.emoji }}
                />
                <div className="p-2">
                  <div className="text-xs font-semibold text-text-primary mb-0.5">{c.name}</div>
                  <div className="text-xs text-rose">&#165;{c.price}起</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="flex gap-2.5 p-4 bg-white border-t border-border sticky bottom-0">
        <button className="flex-1 h-12 rounded-[12px] bg-[#fff0f4] border-[1.5px] border-rose text-[15px] font-semibold text-rose">
          &#128172; 在线咨询
        </button>
        <Link
          href="/maternity/booking"
          className="flex-1 h-12 rounded-[12px] bg-gradient-to-br from-rose to-[#c04060] text-[15px] font-semibold text-white flex items-center justify-center"
        >
          立即预约
        </Link>
      </div>
    </div>
  )
}
