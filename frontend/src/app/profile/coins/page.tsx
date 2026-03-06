'use client'

import { useRouter } from 'next/navigation'
import NavBar from '@/components/layout/NavBar'
import RedeemShop from '@/components/business/RedeemShop'
import InviteBanner from '@/components/business/InviteBanner'

/**
 * 幸孕币 / 成就页
 * 展示币余额、"去兑换"/"积分明细"按钮、今日可赚进度条、
 * 每日任务（含"去记录"跳转）、成就徽章、积分明细列表
 */

const DAILY_TASKS = [
  { icon: '&#10004;', title: '每日签到', coins: 5, done: true, route: undefined },
  { icon: '&#9878;&#65039;', title: '记录体重', coins: 10, done: true, route: '/health/weight' },
  { icon: '&#128218;', title: '阅读本周知识', coins: 5, done: true, route: '/home/knowledge' },
  { icon: '&#129397;', title: '记录血压', coins: 10, done: false, route: '/health/blood-pressure' },
  { icon: '&#128118;', title: '记录胎动', coins: 10, done: false, route: '/health/fetal-movement' },
  { icon: '&#129367;', title: '使用饮食助手', coins: 5, done: false, route: '/diet' },
]

const ACHIEVEMENTS = [
  { icon: '&#127775;', title: '初来乍到', desc: '完成建档', unlocked: true },
  { icon: '&#128170;', title: '健康达人', desc: '连续7天记录体重', unlocked: true },
  { icon: '&#127942;', title: '知识先锋', desc: '阅读10篇知识', unlocked: true },
  { icon: '&#128142;', title: '全勤妈妈', desc: '连续30天打卡', unlocked: false },
  { icon: '&#127937;', title: '产检全通', desc: '完成所有产检', unlocked: false },
  { icon: '&#128081;', title: '饮食管家', desc: '连续14天记录饮食', unlocked: false },
]

const STREAK_DAYS = [true, true, true, true, true, false, false]

/** Mock 积分明细 */
interface CoinDetailItem {
  icon: string
  name: string
  date: string
  amount: number  // 正数收入，负数支出
}

const COIN_DETAILS: CoinDetailItem[] = [
  { icon: '&#128214;', name: '阅读本周妈妈健康内容', date: '03-05 09:20', amount: 5 },
  { icon: '&#9878;&#65039;', name: '记录体重', date: '03-05 08:45', amount: 10 },
  { icon: '&#128722;', name: '兑换摄影折扣券', date: '03-04 14:30', amount: -300 },
  { icon: '&#128293;', name: '连续签到7天奖励', date: '03-04 00:01', amount: 50 },
  { icon: '&#128156;', name: '邀请好友完成首次记录', date: '03-03 16:22', amount: 20 },
]

/** 今日已赚 */
const TODAY_EARNED = 35
const DAILY_LIMIT = 200

export default function CoinsPage() {
  const router = useRouter()

  return (
    <div className="flex flex-col min-h-screen bg-bg">
      <NavBar title="我的幸孕币" onBack={() => router.back()} rightContent={
        <span className="text-[13px] text-primary font-medium">明细</span>
      } />

      <div className="flex-1 overflow-y-auto hide-scrollbar">
        {/* Balance Card */}
        <div className="mx-4 mt-3 bg-gradient-to-br from-[#fce4a8] to-[#f5c060] rounded-card p-5 shadow-card-md text-center">
          <div className="text-[11px] text-[#8a6020] mb-1">&#129689; 当前余额</div>
          <div className="text-4xl font-extrabold text-[#5a3010] mb-1">
            1,280<span className="text-sm font-normal ml-1">幸孕币</span>
          </div>
          <div className="text-xs text-[#a07830] mb-3">
            总获得 <strong>2,150</strong> · 总消耗 <strong>870</strong> · 到期提醒 <strong>12个月</strong>
          </div>
          {/* 去兑换 / 积分明细 按钮 */}
          <div className="flex gap-2">
            <button className="flex-1 h-9 rounded-button bg-[#5a3010] text-white text-[13px] font-semibold">
              &#128717; 去兑换
            </button>
            <button
              className="flex-1 h-9 rounded-button bg-white/60 text-[#5a3010] text-[13px] font-medium"
            >
              &#128203; 积分明细
            </button>
          </div>
        </div>

        {/* 今日可赚进度条 */}
        <div className="bg-white mx-4 mt-3 rounded-card p-4 shadow-card">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-semibold text-text-primary">&#128293; 今日可赚幸孕币</span>
            <span className="text-xs text-text-muted">上限{DAILY_LIMIT}币/日</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-text-secondary">今日已得</span>
            <div className="flex-1 h-2 bg-border rounded overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-primary-400 to-primary rounded"
                style={{ width: `${(TODAY_EARNED / DAILY_LIMIT) * 100}%` }}
              />
            </div>
            <span className="text-xs text-primary font-semibold">{TODAY_EARNED} / {DAILY_LIMIT}币</span>
          </div>
        </div>

        {/* Streak */}
        <div className="bg-white mx-4 mt-3 rounded-card p-4 shadow-card">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-semibold text-text-primary">&#128293; 连续打卡</span>
            <span className="text-xs text-primary font-semibold">已连续 5 天</span>
          </div>
          <div className="flex gap-1.5">
            {['一', '二', '三', '四', '五', '六', '日'].map((d, i) => (
              <div key={d} className="flex-1 flex flex-col items-center gap-1">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold ${
                    STREAK_DAYS[i]
                      ? 'bg-primary text-white'
                      : 'bg-bg text-text-muted'
                  }`}
                >
                  {STREAK_DAYS[i] ? '&#10003;' : d}
                </div>
                <span className="text-[10px] text-text-muted">{d}</span>
              </div>
            ))}
          </div>
          <div className="text-[11px] text-text-muted text-center mt-2">连续7天可获得 50 幸孕币奖励!</div>
        </div>

        {/* Daily Tasks with "去记录" route buttons */}
        <div className="bg-white mx-4 mt-3 rounded-card p-4 shadow-card">
          <h2 className="text-sm font-semibold text-text-primary mb-3">&#128203; 每日任务</h2>
          <div className="flex flex-col gap-2">
            {DAILY_TASKS.map((task) => (
              <div key={task.title} className="flex items-center gap-3 py-2 border-b border-border last:border-b-0">
                <span className="text-xl" dangerouslySetInnerHTML={{ __html: task.icon }} />
                <div className="flex-1">
                  <div className={`text-[13px] ${task.done ? 'text-text-muted line-through' : 'text-text-primary'}`}>
                    {task.title}
                  </div>
                  <div className={`text-[11px] ${task.done ? 'text-text-muted' : 'text-gold'}`}>+{task.coins}币</div>
                </div>
                {task.done ? (
                  <span className="px-3 py-1 rounded-chip text-xs font-medium bg-[#e8f5ee] text-green">
                    &#10004; 已完成
                  </span>
                ) : task.route ? (
                  <button
                    onClick={() => router.push(task.route!)}
                    className="px-3 py-1 rounded-chip text-xs font-medium bg-primary text-white"
                  >
                    去记录 &#8594;
                  </button>
                ) : (
                  <button className="px-3 py-1 rounded-chip text-xs font-medium bg-primary text-white">
                    去完成
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Achievements */}
        <div className="bg-white mx-4 mt-3 rounded-card p-4 shadow-card">
          <h2 className="text-sm font-semibold text-text-primary mb-3">&#127942; 成就徽章</h2>
          <div className="grid grid-cols-3 gap-3">
            {ACHIEVEMENTS.map((ach) => (
              <div
                key={ach.title}
                className={`text-center py-3 rounded-[12px] ${
                  ach.unlocked ? 'bg-[#fff8f0]' : 'bg-bg opacity-50'
                }`}
              >
                <div className="text-2xl mb-1" dangerouslySetInnerHTML={{ __html: ach.icon }} />
                <div className="text-[11px] font-semibold text-text-primary">{ach.title}</div>
                <div className="text-[10px] text-text-muted mt-0.5">{ach.desc}</div>
              </div>
            ))}
          </div>
        </div>

        {/* 积分明细列表 */}
        <div className="bg-white mx-4 mt-3 mb-5 rounded-card p-4 shadow-card">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-sm font-semibold text-text-primary">&#128203; 幸孕币明细</h2>
            <span className="text-xs text-primary cursor-pointer">全部 &#8250;</span>
          </div>
          <div className="flex flex-col">
            {COIN_DETAILS.map((item, idx) => (
              <div key={idx} className="flex items-center gap-3 py-2.5 border-b border-border last:border-b-0">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-base ${
                    item.amount > 0 ? 'bg-green-50' : 'bg-danger-50'
                  }`}
                  dangerouslySetInnerHTML={{ __html: item.icon }}
                />
                <div className="flex-1 min-w-0">
                  <div className="text-[13px] text-text-primary truncate">{item.name}</div>
                  <div className="text-[11px] text-text-muted">{item.date}</div>
                </div>
                <div
                  className={`text-sm font-semibold flex-shrink-0 ${
                    item.amount > 0 ? 'text-green' : 'text-danger'
                  }`}
                >
                  {item.amount > 0 ? '+' : ''}{item.amount}
                </div>
              </div>
            ))}
          </div>
          <button className="w-full mt-2 py-2 text-xs text-text-muted text-center">
            &#8595; 加载更多
          </button>
        </div>

        {/* 热门兑换 */}
        <RedeemShop />

        {/* 邀请有礼 Banner */}
        <InviteBanner />

        {/* 里程碑奖励提示 */}
        <div className="mx-4 mb-5 bg-gradient-to-r from-[#f0f4ff] to-[#e8f0ff] rounded-[12px] px-3.5 py-3 flex items-center gap-2.5">
          <span className="text-[24px]">&#127775;</span>
          <div>
            <div className="text-[13px] font-semibold text-blue">里程碑奖励</div>
            <div className="text-xs text-[#5B8BF5] mt-0.5">
              累计获得 2500 幸孕币可解锁"金牌妈妈"成就，再赚 350 币即可达成！
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
