'use client'

/**
 * P04: 妈妈变化弹窗（Bottom Sheet Modal）
 * 首次进入首页时自动弹出，展示当周妈妈变化信息
 */

interface MomChangeModalProps {
  visible: boolean
  weekNumber: number
  onDismiss: () => void
  onLearnMore: () => void
}

export default function MomChangeModal({ visible, weekNumber, onDismiss, onLearnMore }: MomChangeModalProps) {
  if (!visible) return null

  return (
    <div className="fixed inset-0 z-50 flex flex-col justify-end">
      {/* 遮罩 */}
      <div className="absolute inset-0 bg-black/40" onClick={onDismiss} />

      {/* Bottom Sheet */}
      <div className="relative bg-white rounded-t-3xl px-5 pt-5 pb-6 shadow-[0_-4px_20px_rgba(0,0,0,0.15)] animate-slide-up">
        {/* 拖拽手柄 */}
        <div className="w-10 h-1 bg-border-dark rounded-full mx-auto mb-4" />

        {/* 标题 */}
        <h3 className="text-base font-extrabold text-text-primary text-center mb-3.5">
          &#129328; 孕{weekNumber}周妈妈变化
        </h3>

        {/* 内容区 */}
        <div className="flex items-start gap-3.5 mb-3.5">
          {/* 图标 */}
          <div className="w-20 h-[100px] bg-gradient-to-br from-[#fdf0e0] to-[#fde8cc] rounded-[14px] flex items-center justify-center text-[44px] flex-shrink-0">
            &#129328;
          </div>

          {/* 描述文字 */}
          <div className="text-xs text-text-secondary leading-[1.8]">
            进入孕中期第一周，早孕反应正在减轻，你会感到精力逐渐恢复。子宫已长到拳头大小，腰腹开始有轻微束紧感。
            <br /><br />
            本周宝宝快速生长，骨骼开始硬化，外生殖器已可通过B超辨认，你会开始感受到些许胎动的前兆。
            <br /><br />
            最重要的事：预约中期唐氏筛查！
          </div>
        </div>

        {/* 按钮组 */}
        <div className="flex gap-2.5">
          <button
            onClick={onDismiss}
            className="flex-1 py-3 bg-bg rounded-button text-[13px] font-bold text-text-tertiary"
          >
            我知道了
          </button>
          <button
            onClick={onLearnMore}
            className="flex-1 py-3 bg-gradient-to-r from-primary-400 to-primary rounded-button text-[13px] font-bold text-white shadow-button"
          >
            了解更多
          </button>
        </div>
      </div>
    </div>
  )
}
