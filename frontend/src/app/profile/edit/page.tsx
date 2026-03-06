'use client'

import { useState } from 'react'
import NavBar from '@/components/layout/NavBar'

/**
 * 个人信息编辑页
 * 修改昵称、头像、末次月经、预产期等基本信息
 */

export default function ProfileEditPage() {
  const [nickname, setNickname] = useState('小明妈妈')
  const [lmpDate, setLmpDate] = useState('2025-11-25')
  const [weight, setWeight] = useState('55')
  const [height, setHeight] = useState('165')
  const [hospital, setHospital] = useState('北京妇产医院')

  const handleSave = () => {
    // TODO: profileApi.updateProfile
    window.location.href = '/profile'
  }

  return (
    <div className="flex flex-col min-h-screen bg-bg">
      <NavBar title="个人信息" backHref="/profile" />

      <div className="flex-1 overflow-y-auto hide-scrollbar">
        {/* Avatar */}
        <div className="bg-white px-5 py-6 flex flex-col items-center border-b border-border">
          <div className="w-[80px] h-[80px] rounded-full bg-gradient-to-br from-[#f5c4a8] to-[#e8a07a] border-[3px] border-white/80 flex items-center justify-center text-[40px] shadow-[0_4px_16px_rgba(232,116,74,0.25)] mb-2">
            &#128118;
          </div>
          <button className="text-xs text-primary font-medium">修改头像</button>
        </div>

        {/* Form */}
        <div className="bg-white mx-4 mt-3 rounded-card p-4 shadow-card">
          <div className="mb-3.5">
            <label className="text-[13px] text-text-secondary font-medium mb-1.5 block">昵称</label>
            <input
              type="text"
              className="form-input"
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
            />
          </div>
          <div className="mb-3.5">
            <label className="text-[13px] text-text-secondary font-medium mb-1.5 block">MOM ID</label>
            <input
              type="text"
              className="form-input-filled"
              value="MOM20260301"
              readOnly
            />
          </div>
        </div>

        <div className="bg-white mx-4 mt-3 rounded-card p-4 shadow-card">
          <h2 className="text-sm font-semibold text-text-primary mb-3">&#129328; 孕期信息</h2>
          <div className="mb-3.5">
            <label className="text-[13px] text-text-secondary font-medium mb-1.5 block">末次月经日期</label>
            <input
              type="date"
              className="form-input"
              value={lmpDate}
              onChange={(e) => setLmpDate(e.target.value)}
            />
          </div>
          <div className="grid grid-cols-2 gap-3 mb-3.5">
            <div>
              <label className="text-[13px] text-text-secondary font-medium mb-1.5 block">孕前体重(kg)</label>
              <input
                type="number"
                className="form-input text-center"
                value={weight}
                onChange={(e) => setWeight(e.target.value)}
              />
            </div>
            <div>
              <label className="text-[13px] text-text-secondary font-medium mb-1.5 block">身高(cm)</label>
              <input
                type="number"
                className="form-input text-center"
                value={height}
                onChange={(e) => setHeight(e.target.value)}
              />
            </div>
          </div>
          <div>
            <label className="text-[13px] text-text-secondary font-medium mb-1.5 block">就诊医院</label>
            <input
              type="text"
              className="form-input"
              value={hospital}
              onChange={(e) => setHospital(e.target.value)}
              placeholder="请输入医院名称"
            />
          </div>
        </div>

        <div className="h-4" />
      </div>

      <div className="p-4 bg-white border-t border-border">
        <button onClick={handleSave} className="btn-primary">
          保存修改
        </button>
      </div>
    </div>
  )
}
