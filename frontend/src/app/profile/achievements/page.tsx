'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import NavBar from '@/components/layout/NavBar'

/**
 * P22-C - 成就中心完整页
 * 展示所有成就徽章、进度、解锁状态
 */

type AchievementStatus = 'unlocked' | 'near' | 'in_progress' | 'locked'
type TabKey = 'all' | 'unlocked' | 'in_progress' | 'locked'

interface AchievementItem {
  id: string
  icon: string
  name: string
  desc: string
  status: AchievementStatus
  coins: number
  progress?: number
  progressMax?: number
  progressLabel?: string
  unlockedAt?: string
}

const MOCK_ACHIEVEMENTS: AchievementItem[] = [
  {
    id: '1',
    icon: '🌱',
    name: '孕期起步',
    desc: '完成建档 + 录入预产期 + 首次签到',
    status: 'unlocked',
    coins: 80,
    progress: 3,
    progressMax: 3,
    unlockedAt: '2026-01-10',
  },
  {
    id: '2',
    icon: '📋',
    name: '产检达人',
    desc: '按时完成前3次产检并在App标记',
    status: 'unlocked',
    coins: 100,
    progress: 3,
    progressMax: 3,
    unlockedAt: '2026-02-18',
  },
  {
    id: '3',
    icon: '💪',
    name: '健康达人',
    desc: '连续7天记录体重',
    status: 'unlocked',
    coins: 100,
    progress: 7,
    progressMax: 7,
    unlockedAt: '2026-02-25',
  },
  {
    id: '4',
    icon: '⚖️',
    name: '健康记录入门',
    desc: '累计完成30次健康记录（任意工具）',
    status: 'near',
    coins: 80,
    progress: 27,
    progressMax: 30,
    progressLabel: '已完成 27 / 30',
  },
  {
    id: '5',
    icon: '🍎',
    name: '知识探索者',
    desc: '阅读完成连续10个孕周的宝宝发育/妈妈健康内容',
    status: 'in_progress',
    coins: 100,
    progress: 4,
    progressMax: 10,
    progressLabel: '已完成 4 / 10 孕周',
  },
  {
    id: '6',
    icon: '🤰',
    name: '孕中期守护者',
    desc: '进入孕14周，且最近7天有>=3次记录行为',
    status: 'locked',
    coins: 120,
    progressLabel: '当前：孕14周（差记录次数）',
  },
  {
    id: '7',
    icon: '📊',
    name: '数据管理师',
    desc: '累计上传并解读5份检验报告',
    status: 'locked',
    coins: 100,
    progress: 1,
    progressMax: 5,
    progressLabel: '已上传 1 / 5 份',
  },
  {
    id: '8',
    icon: '🌟',
    name: '全程陪伴奖',
    desc: '从建档到孕39周，每月至少15天活跃记录',
    status: 'locked',
    coins: 300,
    progressLabel: '最高荣誉成就',
  },
]

const TAB_OPTIONS: { key: TabKey; label: string }[] = [
  { key: 'all', label: '全部' },
  { key: 'unlocked', label: '已解锁' },
  { key: 'in_progress', label: '进行中' },
  { key: 'locked', label: '未开始' },
]

const STATUS_CONFIG: Record<AchievementStatus, { label: string; className: string }> = {
  unlocked: { label: '✓ 已解锁', className: 'text-green bg-[#e8f5ee]' },
  near: { label: '⚡ 即将达成', className: 'text-primary bg-[#fff3eb]' },
  in_progress: { label: '进行中', className: 'text-blue bg-[#eef2ff]' },
  locked: { label: '🔒 未解锁', className: 'text-text-muted bg-bg' },
}

export default function AchievementsPage() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState<TabKey>('all')

  const unlockedCount = MOCK_ACHIEVEMENTS.filter((a) => a.status === 'unlocked').length
  const totalCoins = MOCK_ACHIEVEMENTS.filter((a) => a.status === 'unlocked').reduce((sum, a) => sum + a.coins, 0)
  const pendingCoins = MOCK_ACHIEVEMENTS.filter((a) => a.status !== 'unlocked').reduce((sum, a) => sum + a.coins, 0)

  const filteredAchievements = MOCK_ACHIEVEMENTS.filter((a) => {
    if (activeTab === 'all') return true
    if (activeTab === 'unlocked') return a.status === 'unlocked'
    if (activeTab === 'in_progress') return a.status === 'in_progress' || a.status === 'near'
    return a.status === 'locked'
  })

  return (
    <div className="flex flex-col min-h-screen bg-bg">
      <NavBar
        title="成就中心"
        onBack={() => router.back()}
        rightContent={
          <span className="text-xs text-text-muted">已解锁 {unlockedCount}/{MOCK_ACHIEVEMENTS.length}</span>
        }
      />

      <div className="flex-1 overflow-y-auto hide-scrollbar">
        {/* Summary Card */}
        <div className="mx-4 mt-3 bg-gradient-to-br from-[#fdf0e0] to-[#fce8cc] rounded-card p-4 shadow-card-md">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm font-bold text-[#3d1f00] mb-2">🏅 孕期成就进度</div>
              <div className="flex gap-5">
                <div>
                  <div className="text-2xl font-extrabold text-primary">{unlockedCount}</div>
                  <div className="text-[11px] text-[#8a5a30]">已解锁</div>
                </div>
                <div>
                  <div className="text-2xl font-extrabold text-gold">{totalCoins}</div>
                  <div className="text-[11px] text-[#8a5a30]">已获币</div>
                </div>
                <div>
                  <div className="text-2xl font-extrabold text-text-muted">{pendingCoins}</div>
                  <div className="text-[11px] text-[#8a5a30]">待解锁</div>
                </div>
              </div>
            </div>
            <div className="text-5xl">🏆</div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 px-4 pt-4 pb-2">
          {TAB_OPTIONS.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`px-3.5 py-[7px] rounded-chip text-xs font-medium border-[1.5px] transition-colors ${
                activeTab === tab.key
                  ? 'bg-primary border-primary text-white'
                  : 'bg-white border-border-dark text-text-secondary'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Achievement List */}
        <div className="px-4 pb-5 flex flex-col gap-2.5">
          {filteredAchievements.map((achievement) => {
            const config = STATUS_CONFIG[achievement.status]
            const isNear = achievement.status === 'near'
            const isLocked = achievement.status === 'locked'
            const progressPercent =
              achievement.progress && achievement.progressMax
                ? (achievement.progress / achievement.progressMax) * 100
                : 0

            return (
              <div
                key={achievement.id}
                className={`bg-white rounded-card p-4 shadow-card ${
                  isNear ? 'border-[1.5px] border-primary' : ''
                } ${isLocked ? 'opacity-70' : ''}`}
              >
                {/* Header */}
                <div className="flex items-start gap-3 mb-2">
                  <span className={`text-2xl ${isLocked ? 'opacity-50' : ''}`}>
                    {achievement.icon}
                  </span>
                  <div className="flex-1">
                    <div className="text-[13px] font-semibold text-text-primary">
                      {achievement.name}
                    </div>
                    <div className="text-[11px] text-text-muted mt-0.5">{achievement.desc}</div>
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    <span
                      className={`text-[10px] px-2 py-0.5 rounded-[10px] font-medium ${config.className}`}
                    >
                      {config.label}
                    </span>
                    {isNear && (
                      <span className="text-[10px] px-2 py-0.5 rounded-[10px] font-bold bg-primary text-white">
                        快到了!
                      </span>
                    )}
                  </div>
                </div>

                {/* Progress Bar */}
                {achievement.progressMax && (
                  <div className="h-2 bg-[#f0e8dc] rounded-full overflow-hidden mb-2">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${
                        achievement.status === 'unlocked'
                          ? 'bg-green'
                          : isNear
                          ? 'bg-gradient-to-r from-primary-400 to-primary'
                          : 'bg-gradient-to-r from-[#f5c07a] to-primary'
                      }`}
                      style={{ width: `${progressPercent}%` }}
                    />
                  </div>
                )}

                {/* Detail */}
                <div className="flex items-center justify-between">
                  <span
                    className={`text-xs font-medium ${
                      achievement.status === 'unlocked' ? 'text-green' : 'text-gold'
                    }`}
                  >
                    {achievement.status === 'unlocked'
                      ? `已获得 +${achievement.coins}币`
                      : achievement.coins >= 300
                      ? `完成可得 +${achievement.coins}币 🏆`
                      : `完成可得 +${achievement.coins}币`}
                  </span>
                  <span className="text-xs text-text-muted">
                    {achievement.status === 'unlocked'
                      ? `解锁于 ${achievement.unlockedAt}`
                      : achievement.progressLabel || ''}
                  </span>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
