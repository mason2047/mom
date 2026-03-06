'use client'

import { useRouter } from 'next/navigation'
import NavBar from '@/components/layout/NavBar'

/**
 * 月嫂详情页
 * 基本信息、证书、技能、排期日历、评价、预约
 */

const SKILLS = ['母乳喂养指导', '产后康复', '新生儿洗澡', '月子餐制作', '早教互动', '催乳通乳']
const CERTS = ['高级母婴护理师', '催乳师证', '营养师证', '心理咨询师']

export default function NannyDetailPage() {
  const router = useRouter()

  return (
    <div className="flex flex-col min-h-screen bg-bg">
      <NavBar title="月嫂详情" onBack={() => router.back()} />

      <div className="flex-1 overflow-y-auto hide-scrollbar pb-24">
        {/* Profile */}
        <div className="bg-white px-5 py-5 border-b border-border">
          <div className="flex gap-3.5">
            <div className="w-[72px] h-[72px] rounded-full bg-gradient-to-br from-[#ffb8c8] to-[#ff8090] flex items-center justify-center text-[36px] flex-shrink-0">
              &#128105;
            </div>
            <div className="flex-1">
              <h1 className="text-xl font-bold text-text-primary mb-0.5">王月嫂</h1>
              <div className="text-xs text-text-muted mb-2">8年经验 · 服务 200+ 家庭</div>
              <div className="flex gap-1.5 flex-wrap">
                {['金牌月嫂', '催乳师', '早教'].map((tag) => (
                  <span key={tag} className="text-[10px] bg-[#fff0f4] text-rose px-1.5 py-0.5 rounded-md">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
            <div className="text-right">
              <div className="text-gold text-sm">&#11088; 4.9</div>
              <div className="text-[10px] text-text-muted">156评</div>
            </div>
          </div>
        </div>

        {/* Certs */}
        <div className="bg-white mx-4 mt-3 rounded-card p-3.5 shadow-card">
          <h2 className="text-sm font-semibold text-text-primary mb-2.5">&#128196; 资质证书</h2>
          <div className="flex flex-wrap gap-1.5">
            {CERTS.map((cert) => (
              <span key={cert} className="text-[10px] bg-[#f0f9f5] text-green px-2 py-1 rounded-md font-medium">
                &#10003; {cert}
              </span>
            ))}
          </div>
        </div>

        {/* Skills */}
        <div className="bg-white mx-4 mt-3 rounded-card p-3.5 shadow-card">
          <h2 className="text-sm font-semibold text-text-primary mb-2.5">&#128170; 专业技能</h2>
          <div className="grid grid-cols-2 gap-2">
            {SKILLS.map((skill) => (
              <div key={skill} className="flex items-center gap-1.5 text-xs text-text-secondary">
                <span className="text-rose">&#10003;</span> {skill}
              </div>
            ))}
          </div>
        </div>

        {/* Availability */}
        <div className="bg-white mx-4 mt-3 rounded-card p-3.5 shadow-card">
          <h2 className="text-sm font-semibold text-text-primary mb-2.5">&#128197; 档期排布</h2>
          <div className="flex gap-1 mb-1.5">
            {['一', '二', '三', '四', '五', '六', '日'].map((d, i) => (
              <div
                key={d}
                className={`flex-1 h-7 rounded-md flex items-center justify-center text-[10px] font-medium ${
                  [0, 1, 4, 5, 6].includes(i) ? 'bg-[#e8f5ee] text-green' : 'bg-border text-text-muted'
                }`}
              >
                {d}
              </div>
            ))}
          </div>
          <div className="flex gap-3 text-[10px] text-text-muted">
            <span className="flex items-center gap-1"><span className="w-2 h-2 rounded bg-[#e8f5ee]" />可预约</span>
            <span className="flex items-center gap-1"><span className="w-2 h-2 rounded bg-border" />已满</span>
          </div>
        </div>

        {/* Price */}
        <div className="bg-white mx-4 mt-3 rounded-card p-3.5 shadow-card">
          <h2 className="text-sm font-semibold text-text-primary mb-2">&#128176; 服务价格</h2>
          <div className="text-2xl font-bold text-rose">
            &#165;16,800<span className="text-[13px] text-text-muted font-normal">/月（26天）</span>
          </div>
          <div className="text-xs text-text-muted mt-1">含住家服务，每周休息1天</div>
        </div>

        {/* Reviews */}
        <div className="bg-white mx-4 mt-3 mb-4 rounded-card p-3.5 shadow-card">
          <h2 className="text-sm font-semibold text-text-primary mb-2.5">&#128172; 雇主评价</h2>
          <div className="py-2.5 border-b border-border">
            <div className="flex items-center gap-2 mb-1">
              <div className="w-6 h-6 rounded-full bg-gradient-to-br from-[#ffb8c8] to-[#ff8090] flex items-center justify-center text-[10px] text-white font-semibold">
                M
              </div>
              <span className="text-[13px] font-medium text-text-primary">小M妈妈</span>
              <span className="text-[11px] text-text-muted">产后1个月</span>
            </div>
            <p className="text-xs text-text-secondary leading-relaxed">
              王月嫂特别专业！宝宝黄疸她第一时间发现并提醒我们去医院，月子餐做的也很好吃。强烈推荐！
            </p>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="flex gap-2.5 p-4 bg-white border-t border-border sticky bottom-0">
        <button className="flex-1 h-12 rounded-[12px] bg-[#fff0f4] border-[1.5px] border-rose text-[15px] font-semibold text-rose">
          &#128172; 在线沟通
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
