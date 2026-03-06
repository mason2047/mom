'use client'

import { useRouter } from 'next/navigation'

/**
 * 导航栏组件
 * 支持返回按钮、标题、右侧操作
 */
interface NavBarProps {
  title: string
  showBack?: boolean
  backHref?: string
  onBack?: () => void
  rightContent?: React.ReactNode
  className?: string
}

export default function NavBar({
  title,
  showBack = true,
  backHref,
  onBack,
  rightContent,
  className = '',
}: NavBarProps) {
  const router = useRouter()

  const handleBack = () => {
    if (onBack) {
      onBack()
    } else if (backHref) {
      router.push(backHref)
    } else {
      router.back()
    }
  }

  return (
    <div
      className={`h-[52px] bg-white flex items-center px-4 border-b border-border gap-3 sticky top-11 z-[99] ${className}`}
    >
      {showBack ? (
        <button
          onClick={handleBack}
          className="w-8 h-8 rounded-full bg-bg flex items-center justify-center text-base"
          aria-label="返回"
        >
          &#8249;
        </button>
      ) : (
        <div className="w-8" />
      )}
      <div className="flex-1 text-[17px] font-semibold text-text-primary text-center">
        {title}
      </div>
      <div className="w-8 flex items-center justify-end">
        {rightContent || <div className="w-8" />}
      </div>
    </div>
  )
}
