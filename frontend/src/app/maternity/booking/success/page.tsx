'use client'

import { useRouter } from 'next/navigation'

/**
 * P32 - 预约成功页
 * 包含：成功英雄区、预约信息摘要、后续步骤、操作按钮、幸孕币奖励
 */

// Mock 预约数据
const MOCK_BOOKING = {
  centerName: '馨和月子养护中心',
  packageName: '尊享单人间套餐',
  checkInDate: '2026年8月18日',
  duration: 28,
  status: '待确认',
  orderNumber: 'MOM2026031500023',
}

const NEXT_STEPS = [
  {
    num: 1,
    title: '等待回访',
    desc: '机构24小时内致电，确认入住时间和特殊需求（GDM月子餐等）',
  },
  {
    num: 2,
    title: '签署协议',
    desc: '确认后签订月子服务协议，支付定金锁档',
  },
  {
    num: 3,
    title: '孕期提醒',
    desc: '我们将在孕32周和孕36周提醒你跟进预约进度',
  },
]

export default function BookingSuccessPage() {
  const router = useRouter()

  return (
    <div className="flex flex-col min-h-screen bg-bg">

      <div className="flex-1 overflow-y-auto hide-scrollbar">
        {/* 成功英雄区 */}
        <div className="bg-gradient-to-br from-rose-50 to-[#fff8f0] px-5 pt-10 pb-8 text-center">
          <div className="w-[72px] h-[72px] rounded-full bg-gradient-to-br from-rose to-rose-500 flex items-center justify-center text-[36px] mx-auto mb-4">
            &#127881;
          </div>
          <h1 className="text-[22px] font-bold text-text-primary mb-2">预约申请已提交！</h1>
          <p className="text-sm text-text-tertiary leading-relaxed">
            机构将在 <strong>24小时内</strong> 电话联系你<br />
            确认预约详情，请保持手机畅通 &#127800;
          </p>
        </div>

        {/* 预约信息摘要卡片 */}
        <div className="mx-4 mt-4 bg-white rounded-card p-4 shadow-card">
          <h2 className="text-sm font-semibold text-text-primary mb-3 pb-2.5 border-b border-border">
            &#128203; 预约信息
          </h2>
          {[
            { label: '机构名称', value: MOCK_BOOKING.centerName },
            { label: '套餐', value: MOCK_BOOKING.packageName },
            { label: '入住日期', value: MOCK_BOOKING.checkInDate },
            { label: '入住天数', value: `${MOCK_BOOKING.duration}天` },
            { label: '预约状态', value: MOCK_BOOKING.status, highlight: true },
            { label: '预约编号', value: MOCK_BOOKING.orderNumber, small: true },
          ].map((row) => (
            <div key={row.label} className="flex justify-between py-[7px] text-[13px]">
              <span className="text-text-muted">{row.label}</span>
              <span
                className={`font-medium ${
                  row.highlight
                    ? 'text-rose'
                    : row.small
                      ? 'text-text-muted text-xs'
                      : 'text-text-primary'
                }`}
              >
                {row.value}
              </span>
            </div>
          ))}
        </div>

        {/* 后续步骤 */}
        <div className="mx-4 mt-4 bg-white rounded-card p-3.5 shadow-card">
          <div className="text-[13px] font-semibold text-text-primary mb-2">
            &#128204; 接下来你需要做：
          </div>
          {NEXT_STEPS.map((step) => (
            <div
              key={step.num}
              className="flex items-start gap-2.5 py-2 border-b border-border last:border-b-0"
            >
              <div className="w-5 h-5 rounded-full bg-rose flex items-center justify-center text-[10px] text-white font-bold flex-shrink-0 mt-0.5">
                {step.num}
              </div>
              <div className="text-[13px] text-text-secondary leading-relaxed">
                <strong>{step.title}</strong>：{step.desc}
              </div>
            </div>
          ))}
        </div>

        {/* 操作按钮 */}
        <div className="flex gap-2.5 px-4 mt-4">
          <button
            onClick={() => router.push('/maternity')}
            className="flex-1 h-[46px] rounded-[12px] bg-rose-50 text-rose border-[1.5px] border-rose text-sm font-semibold"
          >
            查看我的预约
          </button>
          <button
            onClick={() => router.push('/home')}
            className="flex-1 h-[46px] rounded-[12px] bg-gradient-to-r from-rose to-rose-500 text-white text-sm font-semibold"
          >
            返回首页
          </button>
        </div>

        {/* 幸孕币奖励提示条 */}
        <div className="mx-4 mt-4 mb-5 bg-gradient-to-r from-[#fff8e0] to-[#fff0d0] rounded-[12px] px-3.5 py-3 flex items-center gap-2.5">
          <span className="text-[24px]">&#129689;</span>
          <div>
            <div className="text-[13px] font-semibold text-[#a06020]">
              恭喜获得幸孕币奖励！
            </div>
            <div className="text-xs text-[#c08030] mt-0.5">
              完成月子预约 +200 幸孕币 · 服务结束后评价再 +30 幸孕币
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
