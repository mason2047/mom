import Link from 'next/link'

/**
 * 引导首屏（Splash）
 * 展示品牌信息和核心功能亮点，引导用户登录
 */

const FEATURES = [
  { icon: '📅', text: '智能产检提醒，不漏一次检查' },
  { icon: '🔬', text: 'AI解读检验报告，看懂每个数值' },
  { icon: '👶', text: '每周宝宝发育，陪伴整个孕程' },
  { icon: '🤖', text: 'MOM智能助手，随时解答困惑' },
]

export default function SplashPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#FFF3E8] via-[#FFE8D0] to-[#F5EAF0] flex flex-col items-center justify-between px-8 pb-12 pt-0">

      {/* Logo & 品牌 */}
      <div className="text-center mt-4">
        <div className="w-[72px] h-[72px] rounded-[22px] bg-gradient-to-br from-primary-600 to-primary-700 flex items-center justify-center text-4xl mx-auto mb-4 shadow-[0_8px_24px_rgba(255,140,66,0.35)]">
          🤱
        </div>
        <h1 className="text-[28px] font-extrabold text-text-primary tracking-wide mb-1.5">
          MOM孕期助手
        </h1>
        <p className="text-[15px] text-text-tertiary">为你的宝宝保驾护航</p>
        <div className="text-[90px] leading-none mt-2">🤰</div>
      </div>

      {/* 功能亮点 */}
      <div className="w-full space-y-2.5 mb-2">
        {FEATURES.map((f, i) => (
          <div
            key={i}
            className="flex items-center gap-2.5 bg-white/60 rounded-xl px-3.5 py-2.5 backdrop-blur-sm"
          >
            <span className="text-xl w-9 text-center">{f.icon}</span>
            <span className="text-[13px] text-text-secondary font-medium">{f.text}</span>
          </div>
        ))}
      </div>

      {/* 登录按钮 */}
      <div className="w-full">
        <Link
          href="/home"
          className="btn-wechat"
        >
          <span className="text-xl">💬</span>
          微信一键登录
        </Link>
        <p className="text-[13px] text-text-muted text-center mt-3">
          已有账号？<Link href="/home" className="text-primary">直接登录</Link>
        </p>
      </div>
    </div>
  )
}
