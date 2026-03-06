'use client'

import { useState } from 'react'
import NavBar from '@/components/layout/NavBar'
import BookingExtrasForm from '@/components/business/BookingExtrasForm'

/**
 * 月子服务预约表单页
 * 填写联系人、日期、套餐选择、备注、确认预约
 */

export default function BookingPage() {
  const [contactName, setContactName] = useState('')
  const [phone, setPhone] = useState('')
  const [startDate, setStartDate] = useState('')
  const [agreed, setAgreed] = useState(true)

  const handleSubmit = () => {
    // TODO: maternityApi.createBooking
    window.location.href = '/maternity/booking/success'
  }

  return (
    <div className="flex flex-col min-h-screen bg-bg">
      <NavBar title="预约填写" backHref="/maternity" />

      <div className="flex-1 overflow-y-auto hide-scrollbar">
        {/* 预约信息摘要 */}
        <div className="bg-gradient-to-br from-[#fff0f4] to-[#fff8f8] px-5 py-3.5 border-b border-border flex items-center gap-3">
          <div className="w-12 h-12 rounded-[10px] bg-gradient-to-br from-[#fff0f4] to-[#ffd8e0] flex items-center justify-center text-2xl flex-shrink-0">
            &#127973;
          </div>
          <div>
            <div className="text-sm font-semibold text-text-primary">馨和月子养护中心</div>
            <div className="text-xs text-text-muted mt-0.5">尊享单人间套餐 · &#165;26,800 / 28天</div>
          </div>
        </div>

        {/* 入住信息 - P31 */}
        <div className="bg-white mx-4 mt-3 rounded-card p-4 shadow-card">
          <h2 className="text-[15px] font-semibold text-text-primary mb-3.5">&#128100; 入住信息</h2>
          <div className="mb-3.5">
            <label className="text-[13px] text-text-secondary font-medium mb-1.5 block">入住日期</label>
            <input
              type="date"
              className="form-input"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
            />
            <p className="text-[11px] text-text-muted mt-1">
              &#128161; 已根据你的预产期（8月15日）自动推算为产后第3天
            </p>
          </div>
        </div>

        {/* 分娩信息 & 特殊需求 & 费用确认 */}
        <BookingExtrasForm />

        {/* 联系信息 */}
        <div className="bg-white mx-4 mt-3 rounded-card p-4 shadow-card">
          <h2 className="text-[15px] font-semibold text-text-primary mb-3.5">&#128222; 联系信息</h2>
          <div className="mb-3.5">
            <label className="text-[13px] text-text-secondary font-medium mb-1.5 block">联系人姓名</label>
            <input
              type="text"
              className="form-input"
              value={contactName}
              onChange={(e) => setContactName(e.target.value)}
              placeholder="请输入姓名"
            />
          </div>
          <div className="mb-3.5">
            <label className="text-[13px] text-text-secondary font-medium mb-1.5 block">手机号码</label>
            <input
              type="tel"
              className="form-input"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="请输入手机号"
            />
          </div>
        </div>

        <div className="h-4" />
      </div>

      {/* Submit */}
      <div className="p-4 bg-white border-t border-border">
        <div className="flex items-start gap-2 mb-3">
          <button
            onClick={() => setAgreed(!agreed)}
            className={`w-[18px] h-[18px] rounded flex items-center justify-center text-[11px] flex-shrink-0 mt-0.5 ${
              agreed ? 'bg-rose text-white' : 'bg-border'
            }`}
          >
            {agreed && '&#10003;'}
          </button>
          <span className="text-xs text-text-muted leading-relaxed">
            我已阅读并同意 <span className="text-rose">《月子服务预约协议》</span> 和 <span className="text-rose">《用户隐私政策》</span>
          </span>
        </div>
        <button
          onClick={handleSubmit}
          disabled={!agreed}
          className="w-full h-[50px] rounded-button bg-gradient-to-br from-rose to-[#c04060] text-white text-base font-semibold disabled:opacity-50"
        >
          提交预约申请
        </button>
      </div>
    </div>
  )
}
