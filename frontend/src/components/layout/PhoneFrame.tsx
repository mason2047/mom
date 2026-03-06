'use client'

/**
 * 手机模拟器外框组件
 * 开发模式下用于模拟手机屏幕展示效果
 * 生产环境可以不使用此组件
 */
interface PhoneFrameProps {
  children: React.ReactNode
  label?: string
}

export default function PhoneFrame({ children, label }: PhoneFrameProps) {
  return (
    <div className="flex flex-col items-center">
      <div className="w-[375px] h-[812px] bg-bg rounded-phone overflow-hidden shadow-phone relative flex flex-col">
        <div className="w-[375px] h-[812px] overflow-y-auto overflow-x-hidden hide-scrollbar flex flex-col">
          {children}
        </div>
      </div>
      {label && (
        <div className="text-[13px] text-text-tertiary text-center mt-3 font-medium">
          {label}
        </div>
      )}
    </div>
  )
}
