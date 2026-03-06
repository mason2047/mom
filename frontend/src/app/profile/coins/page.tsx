import Link from 'next/link'
import NavBar from '@/components/layout/NavBar'
import RedeemShop from '@/components/business/RedeemShop'
import InviteBanner from '@/components/business/InviteBanner'

/**
 * P20 · 我的幸孕币
 * 余额卡片、今日任务、连续签到、成就中心、邀请有礼、兑换商城、积分明细
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
  { icon: '&#127793;', name: '孕期起步', status: 'done' as const, label: '&#10003; 已解锁' },
  { icon: '&#128203;', name: '产检达人', status: 'done' as const, label: '&#10003; 已解锁' },
  { icon: '&#9878;&#65039;', name: '健康记录入门', status: 'near' as const, label: '12/30' },
  { icon: '&#127822;', name: '知识探索者', status: 'locked' as const, label: '4/10' },
  { icon: '&#129328;', name: '孕中期守护者', status: 'locked' as const, label: '未解锁' },
]

const STREAK_DAYS: ('done' | 'today')[] = ['done', 'done', 'done', 'done', 'done', 'done', 'today']
const DAY_LABELS = ['一', '二', '三', '四', '五', '六', '日']

interface CoinDetailItem {
  icon: string
  name: string
  date: string
  amount: number
}

const COIN_DETAILS: CoinDetailItem[] = [
  { icon: '&#128214;', name: '阅读本周妈妈健康内容', date: '03-05 09:20', amount: 5 },
  { icon: '&#9878;&#65039;', name: '记录体重', date: '03-05 08:45', amount: 10 },
  { icon: '&#128722;', name: '兑换摄影折扣券', date: '03-04 14:30', amount: -300 },
  { icon: '&#128293;', name: '连续签到7天奖励', date: '03-04 00:01', amount: 50 },
  { icon: '&#128156;', name: '邀请好友完成首次记录', date: '03-03 16:22', amount: 20 },
]

const TODAY_EARNED = 35
const DAILY_LIMIT = 200

export default function CoinsPage() {
  return (
    <div className="flex flex-col min-h-screen bg-bg">
      <NavBar title="我的幸孕币" backHref="/profile" rightContent={
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
          <div className="flex gap-2">
            <button className="flex-1 h-9 rounded-button bg-[#5a3010] text-white text-[13px] font-semibold">
              &#128717; 去兑换
            </button>
            <button className="flex-1 h-9 rounded-button bg-white/60 text-[#5a3010] text-[13px] font-medium">
              &#128203; 积分明细
            </button>
          </div>
        </div>

        {/* 今日可赚进度条 + 每日任务 */}
        <div className="bg-white mx-4 mt-3 rounded-card p-4 shadow-card">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-semibold text-text-primary">&#128293; 今日可赚幸孕币</span>
            <span className="text-xs text-text-muted">上限{DAILY_LIMIT}币/日</span>
          </div>
          <div className="flex items-center gap-2 mb-3">
            <span className="text-xs text-text-secondary">今日已得</span>
            <div className="flex-1 h-2 bg-border rounded overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-primary-400 to-primary rounded"
                style={{ width: `${(TODAY_EARNED / DAILY_LIMIT) * 100}%` }}
              />
            </div>
            <span className="text-xs text-primary font-semibold">{TODAY_EARNED} / {DAILY_LIMIT}币</span>
          </div>

          {/* Task List */}
          <div className="flex flex-col gap-0">
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
                  <Link
                    href={task.route}
                    className="px-3 py-1 rounded-chip text-xs font-medium bg-primary text-white"
                  >
                    去记录 &#8594;
                  </Link>
                ) : (
                  <button className="px-3 py-1 rounded-chip text-xs font-medium bg-primary text-white">
                    去完成
                  </button>
                )}
              </div>
            ))}
          </div>

          {/* 全部任务完成奖励 */}
          <div className="mt-2 flex items-center justify-between bg-[#fff8f0] rounded-lg px-3 py-2">
            <span className="text-[11px] text-[#8a5a30]">&#127919; 今日完成全部任务额外获得</span>
            <span className="text-[12px] font-bold text-primary">+30币 冲！</span>
          </div>
        </div>

        {/* 连续签到 */}
        <div className="bg-white mx-4 mt-3 rounded-card p-4 shadow-card">
          <div className="flex items-center justify-between mb-1">
            <span className="text-sm font-semibold text-text-primary">&#128197; 连续签到</span>
            <span className="text-xs text-primary font-semibold">&#128293; 已连续 12 天</span>
          </div>
          <div className="text-[11px] text-text-muted mb-3 text-right">再坚持 2 天 +50币</div>

          <div className="flex gap-1.5">
            {DAY_LABELS.map((d, i) => (
              <div key={d} className="flex-1 flex flex-col items-center gap-1">
                <span className="text-[10px] text-text-muted">{d}</span>
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold ${
                    STREAK_DAYS[i] === 'done'
                      ? 'bg-primary text-white'
                      : STREAK_DAYS[i] === 'today'
                      ? 'bg-[#fff3e0] text-primary border-2 border-primary'
                      : 'bg-bg text-text-muted'
                  }`}
                >
                  {STREAK_DAYS[i] === 'done' ? '&#10003;' : STREAK_DAYS[i] === 'today' ? '今' : d}
                </div>
              </div>
            ))}
          </div>

          {/* 里程碑 */}
          <div className="mt-3 flex items-center justify-between bg-[#fff8f0] rounded-lg px-3 py-2">
            <span className="text-[11px] text-[#8a5a30]">&#127941; 下一里程碑：连续14天签到</span>
            <span className="text-[12px] font-bold text-primary">+100币</span>
          </div>
        </div>

        {/* 成就中心 - 横向滚动 */}
        <div className="bg-white mx-4 mt-3 rounded-card p-4 shadow-card">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-semibold text-text-primary">&#127941; 成就中心</span>
            <Link href="/profile/achievements" className="text-xs text-primary">全部 &#8250;</Link>
          </div>
          <div className="flex gap-2.5 overflow-x-auto hide-scrollbar -mx-1 px-1">
            {ACHIEVEMENTS.map((ach) => {
              const isNear = ach.status === 'near'
              const isLocked = ach.status === 'locked'
              return (
                <div
                  key={ach.name}
                  className={`flex-shrink-0 w-[100px] rounded-[12px] py-3 px-2 text-center ${
                    isNear
                      ? 'bg-[#fff3e0] border-[1.5px] border-primary'
                      : ach.status === 'done'
                      ? 'bg-[#fff8f0]'
                      : 'bg-bg opacity-60'
                  }`}
                >
                  {isNear && (
                    <span className="text-[9px] font-bold text-primary bg-white px-1.5 py-0.5 rounded-[6px] mb-1 inline-block">
                      快到了
                    </span>
                  )}
                  <div
                    className={`text-2xl mb-1 ${isLocked ? 'opacity-50' : ''}`}
                    dangerouslySetInnerHTML={{ __html: ach.icon }}
                  />
                  <div className="text-[11px] font-semibold text-text-primary">{ach.name}</div>
                  <div
                    className={`text-[10px] mt-0.5 font-medium ${
                      ach.status === 'done'
                        ? 'text-green'
                        : isNear
                        ? 'text-primary'
                        : 'text-text-muted'
                    }`}
                    dangerouslySetInnerHTML={{ __html: ach.label }}
                  />
                </div>
              )
            })}
          </div>
        </div>

        {/* 邀请有礼 Banner */}
        <InviteBanner />

        {/* 兑换商城 */}
        <RedeemShop />

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
      </div>
    </div>
  )
}
