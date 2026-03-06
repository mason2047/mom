'use client'

import Link from 'next/link'
import TabBar from '@/components/layout/TabBar'
import ProfileMenuExtras from '@/components/business/ProfileMenuExtras'
import InviteBanner from '@/components/business/InviteBanner'

/**
 * 我的 Tab - 个人中心
 * 展示用户信息、孕周进度、功能菜单入口
 */

const MENU_SECTIONS = [
  {
    title: '孕期工具',
    items: [
      { icon: '&#128203;', iconBg: 'icon-bg-orange', title: '产检计划', desc: '查看和记录产检', route: '/checkup', badge: '下次: 3/18' },
      { icon: '&#128202;', iconBg: 'icon-bg-orange', title: '健康记录', desc: '体重/血压/血糖趋势', route: '/health' },
      { icon: '&#129367;', iconBg: 'icon-bg-green', title: '饮食助手', desc: '热量记录与控糖管理', route: '/diet' },
      { icon: '&#128218;', iconBg: 'icon-bg-blue', title: '孕期知识', desc: '每周发育和健康指南', route: '/home/knowledge' },
    ],
  },
  {
    title: '生活服务',
    items: [
      { icon: '&#127968;', iconBg: 'icon-bg-purple', title: '月子规划', desc: '月子中心 / 月嫂预约', route: '/maternity' },
      { icon: '&#127942;', iconBg: 'icon-bg-gold', title: '成就徽章', desc: '查看孕期成就进度', route: '/profile/achievements' },
      { icon: '&#128722;', iconBg: 'icon-bg-gold', title: '幸孕币商城', desc: '兑换母婴好物', route: '/profile/coins' },
    ],
  },
  {
    title: '账户设置',
    items: [
      { icon: '&#128276;', iconBg: 'icon-bg-orange', title: '提醒设置', desc: '产检提醒、每日记录提醒', route: '/profile/settings' },
      { icon: '&#128100;', iconBg: 'icon-bg-gray', title: '个人信息', desc: '修改昵称、头像', route: '/profile/edit' },
      { icon: '&#9881;&#65039;', iconBg: 'icon-bg-gray', title: '更多设置', desc: '隐私、缓存、关于', route: '/profile/settings' },
    ],
  },
]

export default function ProfilePage() {
  return (
    <div className="flex flex-col min-h-screen bg-[#faf8f5]">

      <div className="flex-1 overflow-y-auto hide-scrollbar">
        {/* 用户信息头部 */}
        <div className="bg-gradient-to-br from-[#fef5ee] to-[#fce9d8] px-5 pt-5 pb-6">
          <div className="flex items-center gap-3.5">
            <div className="w-[66px] h-[66px] rounded-full bg-gradient-to-br from-[#f0b429] via-[#ffd700] to-[#e8a020] p-[3px] flex-shrink-0 shadow-[0_4px_16px_rgba(232,116,74,0.25)]">
            <div className="w-full h-full rounded-full bg-gradient-to-br from-[#f5c4a8] to-[#e8a07a] flex items-center justify-center text-[30px]">
              &#128118;
            </div>
            </div>
            <div className="flex-1">
              <div className="text-xl font-bold text-[#2a1a0e] mb-1">小明妈妈</div>
              <div className="text-xs text-[#9a7a65]">MOM ID: MOM20260301</div>
            </div>
            <button className="w-8 h-8 bg-white/70 rounded-full flex items-center justify-center text-base border border-white/90">
              &#9998;&#65039;
            </button>
          </div>

          {/* 快捷数据条 */}
          <div className="mt-4 bg-white/65 rounded-[14px] py-3 flex backdrop-blur-sm">
            {[
              { num: '14+3', label: '当前孕周' },
              { num: '182', label: '距预产期' },
              { num: '1,280', label: '幸孕币' },
              { num: '3次', label: '产检次数' },
            ].map((item, i, arr) => (
              <div
                key={item.label}
                className={`flex-1 flex flex-col items-center gap-0.5 ${i < arr.length - 1 ? 'border-r border-[rgba(232,116,74,0.15)]' : ''}`}
              >
                <span className="text-xl font-extrabold text-primary">{item.num}</span>
                <span className="text-[11px] text-[#9a7a65]">{item.label}</span>
              </div>
            ))}
          </div>

          {/* 孕周进度条 */}
          <div className="mt-2.5 mx-0">
            <div className="h-1 bg-[rgba(232,116,74,0.15)] rounded overflow-hidden">
              <div className="h-full w-[35%] bg-gradient-to-r from-primary-400 to-primary rounded" />
            </div>
            <div className="flex justify-between mt-1 text-[10px] text-[#9a7a65]">
              <span>孕1周</span>
              <span>孕14周 &#8226; 当前</span>
              <span>孕40周</span>
            </div>
          </div>
        </div>

        {/* 会员权益菜单 */}
        <ProfileMenuExtras />

        {/* 邀请好友 Banner */}
        <InviteBanner />

        {/* 菜单区域 */}
        {MENU_SECTIONS.map((section) => (
          <div key={section.title} className="px-4 mt-4">
            <div className="text-xs text-text-muted font-semibold mb-2 px-1 tracking-wider">
              {section.title}
            </div>
            <div className="bg-white rounded-card overflow-hidden shadow-card-md">
              {section.items.map((item, i) => (
                <Link
                  key={item.title}
                  href={item.route}
                  className={`w-full flex items-center px-4 py-3.5 gap-3 text-left active:bg-[#faf7f3] transition-colors ${
                    i < section.items.length - 1 ? 'border-b border-border' : ''
                  }`}
                >
                  <div
                    className={`w-[38px] h-[38px] rounded-[10px] flex items-center justify-center text-xl flex-shrink-0 ${
                      item.iconBg === 'icon-bg-orange' ? 'bg-primary-100' :
                      item.iconBg === 'icon-bg-green' ? 'bg-green-50' :
                      item.iconBg === 'icon-bg-blue' ? 'bg-blue-50' :
                      item.iconBg === 'icon-bg-purple' ? 'bg-purple-50' :
                      item.iconBg === 'icon-bg-gold' ? 'bg-gold-50' :
                      'bg-[#f4f4f4]'
                    }`}
                    dangerouslySetInnerHTML={{ __html: item.icon }}
                  />
                  <div className="flex-1">
                    <div className="text-[15px] font-semibold text-text-primary">{item.title}</div>
                    <div className="text-xs text-text-secondary mt-0.5">{item.desc}</div>
                  </div>
                  <div className="flex items-center gap-1.5">
                    {item.badge && (
                      <span className="bg-primary-100 text-primary text-[11px] font-semibold px-2 py-0.5 rounded-[10px] border border-[rgba(232,116,74,0.2)]">
                        {item.badge}
                      </span>
                    )}
                    <span className="text-sm text-text-muted">&#8250;</span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        ))}

        {/* 版本号 */}
        <div className="text-center py-5 text-xs text-text-muted">
          MOM孕期助手 v1.0.0
        </div>
      </div>

      <TabBar />
    </div>
  )
}
