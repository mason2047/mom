import Link from 'next/link'

/**
 * 邀请有礼横幅组件
 * 紫色渐变背景，引导用户进入邀请页面
 */
export default function InviteBanner() {
  return (
    <Link
      href="/profile/invite"
      className="mx-4 mt-3 w-[calc(100%-32px)] bg-gradient-to-r from-[#6b21a8] to-[#9333ea] rounded-card px-4 py-3 flex items-center gap-3 shadow-card active:opacity-95 transition-opacity"
    >
      <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center text-2xl flex-shrink-0">
        💜
      </div>
      <div className="flex-1 text-left">
        <div className="text-[13px] font-bold text-white">邀请闺蜜，最高得65币</div>
        <div className="text-[11px] text-white/70 mt-0.5">闺蜜注册即送30幸孕币</div>
      </div>
      <div className="px-3 py-1.5 rounded-chip bg-white/20 text-xs font-medium text-white flex-shrink-0">
        去邀请 &gt;
      </div>
    </Link>
  )
}
