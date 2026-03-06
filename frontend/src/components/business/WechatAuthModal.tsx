'use client'

/**
 * P01-B: 微信授权登录弹窗（Bottom Sheet）
 * 半透明遮罩 + 底部上滑白色卡片
 */

interface WechatAuthModalProps {
  visible: boolean
  onAuth: () => void
  onSkip: () => void
  onClose: () => void
}

export default function WechatAuthModal({ visible, onAuth, onSkip, onClose }: WechatAuthModalProps) {
  if (!visible) return null

  return (
    <div className="fixed inset-0 z-50 flex flex-col justify-end">
      {/* 遮罩 */}
      <div
        className="absolute inset-0 bg-black/30 backdrop-blur-[2px]"
        onClick={onClose}
      />

      {/* 弹窗 */}
      <div className="relative bg-white rounded-t-[20px] px-6 pt-6 pb-9 shadow-[0_-4px_20px_rgba(0,0,0,0.1)] animate-slide-up">
        {/* 拖拽手柄 */}
        <div className="w-9 h-1 bg-border-dark rounded-full mx-auto mb-5" />

        {/* 微信 Logo */}
        <div className="w-14 h-14 rounded-card bg-[#07c160] flex items-center justify-center text-3xl mx-auto mb-3">
          &#128172;
        </div>

        {/* 标题 & 描述 */}
        <h3 className="text-lg font-bold text-text-primary text-center mb-1.5">
          使用微信登录
        </h3>
        <p className="text-[13px] text-text-tertiary text-center mb-5 leading-relaxed">
          授权后使用你的微信头像和昵称<br />
          开启你的孕期健康管理之旅
        </p>

        {/* 微信授权按钮 */}
        <button
          onClick={onAuth}
          className="w-full h-[50px] rounded-button bg-[#07c160] text-white text-base font-semibold flex items-center justify-center gap-2 mb-2.5"
        >
          <span className="text-xl">&#128172;</span>
          微信一键授权登录
        </button>

        {/* 跳过按钮 */}
        <button
          onClick={onSkip}
          className="w-full h-11 rounded-button bg-bg text-text-tertiary text-sm"
        >
          暂不授权，仅浏览
        </button>

        {/* 隐私政策 */}
        <p className="text-[11px] text-text-light text-center mt-3 leading-relaxed">
          登录即代表你已阅读并同意<br />
          <span className="text-primary">《用户协议》</span> 和 <span className="text-primary">《隐私政策》</span>
        </p>
      </div>
    </div>
  )
}
