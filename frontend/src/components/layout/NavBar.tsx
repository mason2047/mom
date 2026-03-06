import Link from 'next/link'

interface NavBarProps {
  title: string
  showBack?: boolean
  backHref?: string
  rightContent?: React.ReactNode
  className?: string
}

export default function NavBar({
  title,
  showBack = true,
  backHref = '/',
  rightContent,
  className = '',
}: NavBarProps) {
  return (
    <div
      className={`h-[52px] bg-white flex items-center px-4 border-b border-border gap-3 sticky top-0 z-[99] ${className}`}
    >
      {showBack ? (
        <Link
          href={backHref}
          className="w-8 h-8 rounded-full bg-bg flex items-center justify-center text-base"
          aria-label="返回"
        >
          ‹
        </Link>
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
