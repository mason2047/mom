'use client'

import { useState } from 'react'
import Link from 'next/link'
import NavBar from '@/components/layout/NavBar'

/**
 * P28 - 月子规划服务发现页
 * 月子中心 / 月嫂 Tab切换，筛选条件，服务列表
 */

type TabType = 'center' | 'nanny'

const MOCK_CENTERS = [
  {
    id: '1',
    name: '爱帝宫月子中心',
    rating: 4.8,
    reviews: 326,
    distance: '3.2km',
    price: '39,800',
    tags: ['明星推荐', '五星级', '产后康复'],
    cert: true,
    rec: true,
    bedsLeft: 3,
  },
  {
    id: '2',
    name: '馨月汇月子中心',
    rating: 4.6,
    reviews: 218,
    distance: '5.1km',
    price: '28,800',
    tags: ['中医调理', '母婴同室'],
    cert: true,
    rec: false,
    bedsLeft: 0,
  },
]

const MOCK_NANNIES = [
  {
    id: '1',
    name: '王月嫂',
    exp: '8年经验',
    rating: 4.9,
    reviews: 156,
    price: '16,800',
    tags: ['金牌月嫂', '催乳师', '早教'],
    certs: ['高级母婴护理师', '催乳师证'],
    available: [true, true, false, false, true, true, true],
  },
]

const FILTER_CHIPS = ['综合推荐 \u25be', '地区 \u25be', '价格 \u25be', '评分4.5+', '特色 \u25be']

export default function MaternityPage() {
  const [activeTab, setActiveTab] = useState<TabType>('center')
  const [activeFilter, setActiveFilter] = useState('综合推荐 \u25be')

  return (
    <div className="flex flex-col min-h-screen bg-bg">
      <NavBar
        title="月子规划"
        backHref="/profile"
        rightContent={<span className="text-[13px] text-rose font-medium">&#128269; 搜索</span>}
      />

      <div className="flex-1 overflow-y-auto hide-scrollbar">
        {/* AI Banner */}
        <div className="bg-gradient-to-br from-[#fff0f4] to-[#fff8f0] px-5 py-4 border-b border-border">
          <div className="bg-gradient-to-br from-rose to-[#c04060] rounded-[14px] px-4 py-3.5 flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center text-xl flex-shrink-0">
              &#127968;
            </div>
            <div className="flex-1 text-white">
              <div className="text-sm font-semibold mb-0.5">月子规划小助手</div>
              <div className="text-[11px] opacity-90">孕28周+，现在开始规划刚刚好！</div>
            </div>
            <button className="bg-white/25 text-white px-3 py-1 rounded-[14px] text-xs font-medium whitespace-nowrap">
              开始规划
            </button>
          </div>
          <div className="flex justify-between text-xs text-text-muted">
            <span>&#128205; 北京市 · 当前孕周 14周</span>
            <span className="text-rose">距预产期 182天</span>
          </div>
        </div>

        {/* Tab Switch */}
        <div className="flex px-4 py-2.5 gap-2 bg-white border-b border-border">
          <button
            onClick={() => setActiveTab('center')}
            className={`flex-1 h-9 rounded-[18px] border-[1.5px] text-[13px] font-medium flex items-center justify-center gap-1 ${
              activeTab === 'center'
                ? 'bg-rose border-rose text-white'
                : 'bg-white border-border-dark text-text-secondary'
            }`}
          >
            &#127973; 月子中心
          </button>
          <button
            onClick={() => setActiveTab('nanny')}
            className={`flex-1 h-9 rounded-[18px] border-[1.5px] text-[13px] font-medium flex items-center justify-center gap-1 ${
              activeTab === 'nanny'
                ? 'bg-rose border-rose text-white'
                : 'bg-white border-border-dark text-text-secondary'
            }`}
          >
            &#128105; 月嫂服务
          </button>
        </div>

        {/* Filters */}
        <div className="flex gap-1.5 px-4 py-2.5 overflow-x-auto hide-scrollbar bg-white">
          {FILTER_CHIPS.map((chip) => (
            <button
              key={chip}
              onClick={() => setActiveFilter(chip)}
              className={`px-3 py-1 rounded-chip border-[1.5px] text-xs whitespace-nowrap flex-shrink-0 ${
                activeFilter === chip
                  ? 'bg-rose border-rose text-white'
                  : 'bg-white border-border-dark text-text-secondary'
              }`}
            >
              {chip}
            </button>
          ))}
        </div>

        {/* Service List */}
        <div className="p-4 flex flex-col gap-3">
          {activeTab === 'center' && (
            <div className="text-xs text-text-muted py-1">
              &#129302; AI 根据你的孕周和位置为你推荐
            </div>
          )}
          {activeTab === 'center'
            ? MOCK_CENTERS.map((center) => (
                <Link
                  key={center.id}
                  href={`/maternity/center/${center.id}`}
                  className="bg-white rounded-card overflow-hidden shadow-card text-left block"
                >
                  <div className="w-full h-[130px] bg-gradient-to-br from-[#fff0f4] to-[#ffe0ea] flex items-center justify-center text-[50px] relative">
                    &#127968;
                    <div className="absolute top-2 left-2 flex gap-1.5">
                      {center.cert && (
                        <span className="bg-rose/90 text-white text-[10px] px-1.5 py-0.5 rounded-lg font-semibold">
                          &#10003; 已认证
                        </span>
                      )}
                      {center.rec && (
                        <span className="bg-gold/90 text-white text-[10px] px-1.5 py-0.5 rounded-lg font-semibold">
                          &#11088; 推荐
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="p-3.5">
                    <div className="text-base font-bold text-text-primary mb-1">{center.name}</div>
                    <div className="flex items-center gap-2.5 text-xs text-text-muted mb-2">
                      <span className="text-gold">&#11088; {center.rating}</span>
                      <span>{center.reviews}条评价</span>
                      <span>{center.distance}</span>
                    </div>
                    <div className="flex items-center justify-between mb-2">
                      <div className="text-[15px] font-bold text-rose">
                        &#165;{center.price}<span className="text-[11px] text-text-muted font-normal">起/28天</span>
                      </div>
                      {center.bedsLeft > 0 && (
                        <div className="text-[11px] text-rose font-medium">
                          &#128293; 床位剩余{center.bedsLeft}间
                        </div>
                      )}
                    </div>
                    <div className="flex flex-wrap gap-1.5 mb-2.5">
                      {center.tags.map((tag) => (
                        <span key={tag} className="text-[10px] bg-[#fff0f4] text-rose px-2 py-0.5 rounded-md">
                          {tag}
                        </span>
                      ))}
                    </div>
                    <div className="flex gap-2">
                      <span className="flex-1 h-9 rounded-button bg-bg flex items-center justify-center text-[13px] font-medium text-text-secondary">
                        查看详情
                      </span>
                      <span className="flex-1 h-9 rounded-button bg-rose flex items-center justify-center text-[13px] font-medium text-white">
                        在线咨询
                      </span>
                    </div>
                  </div>
                </Link>
              ))
            : MOCK_NANNIES.map((nanny) => (
                <Link
                  key={nanny.id}
                  href={`/maternity/nanny/${nanny.id}`}
                  className="bg-white rounded-card p-3.5 shadow-card text-left block"
                >
                  <div className="flex gap-3 mb-2.5">
                    <div className="w-[60px] h-[60px] rounded-full bg-gradient-to-br from-[#ffb8c8] to-[#ff8090] flex items-center justify-center text-[28px] flex-shrink-0">
                      &#128105;
                    </div>
                    <div className="flex-1">
                      <div className="text-base font-bold text-text-primary mb-0.5">{nanny.name}</div>
                      <div className="text-xs text-text-muted mb-1.5">{nanny.exp} · &#11088; {nanny.rating} · {nanny.reviews}评</div>
                      <div className="flex flex-wrap gap-1.5">
                        {nanny.tags.map((tag) => (
                          <span key={tag} className="text-[10px] bg-[#fff0f4] text-rose px-1.5 py-0.5 rounded-md">
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-1.5 mb-2.5">
                    {nanny.certs.map((cert) => (
                      <span key={cert} className="text-[10px] bg-[#f0f9f5] text-green px-2 py-0.5 rounded-md font-medium">
                        &#10003; {cert}
                      </span>
                    ))}
                  </div>
                  <div className="flex gap-1 mb-2.5">
                    {['一', '二', '三', '四', '五', '六', '日'].map((d, i) => (
                      <div
                        key={d}
                        className={`flex-1 h-7 rounded-md flex items-center justify-center text-[10px] font-medium ${
                          nanny.available[i] ? 'bg-[#e8f5ee] text-green' : 'bg-border text-text-muted'
                        }`}
                      >
                        {d}
                      </div>
                    ))}
                  </div>
                  <div className="text-base font-bold text-rose mb-2.5">
                    &#165;{nanny.price}<span className="text-[11px] text-text-muted font-normal">/月</span>
                  </div>
                  <div className="flex gap-2">
                    <span className="flex-1 h-9 rounded-button bg-bg flex items-center justify-center text-[13px] font-medium text-text-secondary">
                      查看详情
                    </span>
                    <span className="flex-1 h-9 rounded-button bg-rose flex items-center justify-center text-[13px] font-medium text-white">
                      立即预约
                    </span>
                  </div>
                </Link>
              ))}
        </div>
      </div>
    </div>
  )
}
