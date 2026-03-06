import NavBar from '@/components/layout/NavBar'
import Accordion from '@/components/ui/Accordion'

/**
 * P-Share - 邀请有礼页
 * 邀请闺蜜使用 MOM 获取幸孕币奖励
 */

interface ShareCardItem {
  emoji: string
  title: string
  desc: string
  coinSelf: number
  coinFriend: number
  available: boolean
  tag: string
}

interface InviteRecord {
  avatar: string
  name: string
  date: string
  weekInfo: string
  coins: number
  status: 'complete' | 'ongoing'
}

const REWARD_STEPS = [
  { icon: '📤', coin: 15, name: '分享卡片\n完成注册' },
  { icon: '📝', coin: 20, name: '首次健康\n记录' },
  { icon: '🔥', coin: 30, name: '连续签到\n7天' },
]

const SHARE_CARDS: ShareCardItem[] = [
  {
    emoji: '🤰',
    title: '宝宝发育卡',
    desc: '「孕14周宝宝说：我现在有8.7cm啦！手指已经能感觉到了~」',
    coinSelf: 15,
    coinFriend: 30,
    available: true,
    tag: '本周可用',
  },
  {
    emoji: '🍋',
    title: '水果对照卡',
    desc: '「我的宝宝现在像一颗柠檬大小」方形分享卡',
    coinSelf: 10,
    coinFriend: 30,
    available: true,
    tag: '本周可用',
  },
  {
    emoji: '📋',
    title: '产检打卡成就卡',
    desc: '完成本次产检后解锁，生成成就感打卡卡片',
    coinSelf: 20,
    coinFriend: 30,
    available: false,
    tag: '待产检',
  },
  {
    emoji: '🗓️',
    title: '孕期日历卡',
    desc: '「我已陪伴宝宝成长 98 天」里程碑纪念卡',
    coinSelf: 10,
    coinFriend: 30,
    available: true,
    tag: '本周可用',
  },
]

const INVITE_RECORDS: InviteRecord[] = [
  { avatar: '😊', name: '孕妈雪儿', date: '2026-03-01', weekInfo: '孕12周', coins: 65, status: 'complete' },
  { avatar: '🌸', name: '宝妈圆圆', date: '2026-02-26', weekInfo: '孕16周', coins: 65, status: 'complete' },
  { avatar: '🍀', name: '准妈妈小朵', date: '2026-03-04', weekInfo: '孕8周', coins: 15, status: 'ongoing' },
]

const RULES = [
  '每孕周每类内容卡片仅可触发1次分享奖励，新孕周（每7天）自动解锁新机会',
  '奖励在被邀请人完成实质行为（注册/健康记录/连续签到）后24小时内自动到账',
  '被邀请人必须是新用户（未注册过MOM小程序），老用户点击不计入奖励',
  '分享奖励单独计算，不占用每日200币上限，每日最高分享奖励上限100币',
]

export default function InvitePage() {
  return (
    <div className="flex flex-col min-h-screen bg-bg">
      <NavBar
        title="邀请有礼"
        backHref="/profile"
        rightContent={<span className="text-[13px] text-white/70">规则</span>}
        className="!bg-[#2d1654] !border-b-0 [&>div]:!text-white [&>a]:!bg-white/20 [&>a]:!text-white"
      />

      <div className="flex-1 overflow-y-auto hide-scrollbar pb-24">
        {/* Hero */}
        <div className="bg-gradient-to-br from-[#4a1d8a] to-[#2d1654] px-5 pt-4 pb-6 text-center">
          <div className="text-5xl mb-3">💜</div>
          <h1 className="text-xl font-extrabold text-white leading-tight mb-2">
            邀请孕妈闺蜜<br />一起用 MOM 陪宝宝长大
          </h1>
          <p className="text-[13px] text-white/70 leading-relaxed">
            每成功邀请1位，你可获得最高 <b className="text-[#ffd700]">+65幸孕币</b><br />
            闺蜜注册即得 <b className="text-[#ffd700]">+30幸孕币</b> 欢迎奖励
          </p>
        </div>

        {/* Reward Steps */}
        <div className="mx-4 -mt-3 bg-white rounded-card p-4 shadow-card-md flex justify-around">
          {REWARD_STEPS.map((step, i) => (
            <div key={i} className="flex flex-col items-center gap-1.5">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#f5e0ff] to-[#e8d0ff] flex items-center justify-center text-2xl">
                {step.icon}
              </div>
              <span className="text-xs font-bold text-[#6b21a8]">+{step.coin}币</span>
              <span className="text-[10px] text-text-muted text-center leading-tight whitespace-pre-line">
                {step.name}
              </span>
            </div>
          ))}
        </div>

        {/* Shareable Content */}
        <div className="mx-4 mt-4">
          <div className="flex items-center justify-between mb-2.5">
            <span className="text-sm font-semibold text-text-primary">本孕周可分享内容</span>
            <span className="text-[11px] text-[#6b21a8] bg-[#f5e0ff] px-2 py-0.5 rounded-chip font-medium">
              孕14周
            </span>
          </div>
          <div className="flex flex-col gap-2.5">
            {SHARE_CARDS.map((card) => (
              <div
                key={card.title}
                className={`bg-white rounded-card p-3.5 shadow-card flex gap-3 ${
                  !card.available ? 'opacity-60' : ''
                }`}
              >
                <div className="text-2xl flex-shrink-0 mt-0.5">{card.emoji}</div>
                <div className="flex-1 min-w-0">
                  <div className="text-[13px] font-semibold text-text-primary">{card.title}</div>
                  <div className="text-[11px] text-text-muted mt-0.5 line-clamp-2">{card.desc}</div>
                  <div className="text-[11px] text-[#6b21a8] mt-1">
                    分享者 +{card.coinSelf}币 · 闺蜜 +{card.coinFriend}币
                  </div>
                </div>
                <div className="flex flex-col items-end justify-between flex-shrink-0">
                  <span
                    className={`text-[10px] px-2 py-0.5 rounded-[10px] font-medium ${
                      card.available
                        ? 'bg-[#e8f5ee] text-green'
                        : 'bg-bg text-text-muted'
                    }`}
                  >
                    {card.available ? '✓' : '⏳'} {card.tag}
                  </span>
                  <button
                    className={`px-3.5 py-1.5 rounded-chip text-xs font-medium mt-2 ${
                      card.available
                        ? 'bg-[#6b21a8] text-white'
                        : 'bg-border-dark text-text-muted cursor-not-allowed'
                    }`}
                    disabled={!card.available}
                  >
                    {card.available ? '分享 &gt;' : '暂不可用'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Group Bonus */}
        <div className="mx-4 mt-4">
          <div className="bg-gradient-to-r from-[#fff8ec] to-[#ffeebb] rounded-card p-4 border border-[rgba(240,180,41,0.3)]">
            <div className="flex items-center gap-2 mb-1.5">
              <span className="text-xl">👭</span>
              <span className="text-sm font-bold text-[#3a2a0a]">孕妈闺蜜群爆发奖励</span>
              <span className="ml-auto text-[13px] font-extrabold text-gold">额外 +50币</span>
            </div>
            <p className="text-xs text-[#7a6030] leading-relaxed">
              同一分享链接，同孕周内 3 位以上闺蜜完成注册，即可额外获得 +50幸孕币，分享至群时更容易触发！
            </p>
          </div>
        </div>

        {/* Invite Progress */}
        <div className="mx-4 mt-4 bg-white rounded-card p-4 shadow-card">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-semibold text-text-primary">我的邀请进度</span>
            <span className="text-xs text-primary">查看全部 &gt;</span>
          </div>
          <div className="flex bg-bg rounded-[12px] py-3 mb-3">
            {[
              { num: '3', label: '成功邀请' },
              { num: '195', label: '已获幸孕币' },
              { num: '1', label: '进行中' },
            ].map((stat, i) => (
              <div
                key={stat.label}
                className={`flex-1 text-center ${i < 2 ? 'border-r border-border' : ''}`}
              >
                <div className="text-lg font-extrabold text-[#6b21a8]">{stat.num}</div>
                <div className="text-[10px] text-text-muted">{stat.label}</div>
              </div>
            ))}
          </div>
          <div className="flex flex-col gap-2">
            {INVITE_RECORDS.map((record) => (
              <div key={record.name} className="flex items-center gap-3 py-2 border-b border-border last:border-b-0">
                <div className="w-10 h-10 rounded-full bg-[#f5e0ff] flex items-center justify-center text-xl flex-shrink-0">
                  {record.avatar}
                </div>
                <div className="flex-1">
                  <div className="text-[13px] font-medium text-text-primary">{record.name}</div>
                  <div className="text-[11px] text-text-muted">
                    {record.date} · {record.weekInfo}
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-[13px] font-bold text-[#6b21a8]">+{record.coins}币</div>
                  <span
                    className={`text-[10px] px-2 py-0.5 rounded-[10px] font-medium ${
                      record.status === 'complete'
                        ? 'bg-[#e8f5ee] text-green'
                        : 'bg-[#fff3eb] text-primary'
                    }`}
                  >
                    {record.status === 'complete' ? '已完成' : '进行中'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Rules */}
        <div className="mx-4 mt-4 mb-4">
          <Accordion icon="📌" title="邀请规则说明">
            <div className="flex flex-col gap-2">
              {RULES.map((rule, i) => (
                <div key={i} className="flex gap-2">
                  <span className="w-5 h-5 rounded-full bg-[#f5e0ff] text-[#6b21a8] text-[11px] font-bold flex items-center justify-center flex-shrink-0">
                    {i + 1}
                  </span>
                  <span className="text-xs text-text-secondary leading-relaxed">{rule}</span>
                </div>
              ))}
            </div>
          </Accordion>
        </div>
      </div>

      {/* Fixed Bottom Button */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t border-border">
        <button className="w-full h-12 rounded-[12px] bg-gradient-to-r from-[#6b21a8] to-[#9333ea] text-white text-base font-bold shadow-[0_4px_16px_rgba(107,33,168,0.35)]">
          立即邀请闺蜜
        </button>
      </div>
    </div>
  )
}
