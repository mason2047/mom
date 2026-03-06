'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import NavBar from '@/components/layout/NavBar'
import ToggleSwitch from '@/components/ui/ToggleSwitch'

/**
 * 设置页
 * 提醒设置、隐私设置、缓存管理、关于信息
 */

export default function SettingsPage() {
  const router = useRouter()
  const [checkupReminder, setCheckupReminder] = useState(true)
  const [dailyReminder, setDailyReminder] = useState(true)
  const [dietReminder, setDietReminder] = useState(false)
  const [kickReminder, setKickReminder] = useState(false)

  return (
    <div className="flex flex-col min-h-screen bg-bg">
      <NavBar title="设置" onBack={() => router.back()} />

      <div className="flex-1 overflow-y-auto hide-scrollbar">
        {/* 提醒设置 */}
        <div className="bg-white mx-4 mt-3 rounded-card p-4 shadow-card">
          <h2 className="text-sm font-semibold text-text-primary mb-3">&#128276; 提醒设置</h2>
          {[
            { label: '产检提醒', sub: '产检前3天 + 1天提醒', value: checkupReminder, onChange: setCheckupReminder },
            { label: '每日记录提醒', sub: '每天 08:00 提醒记录体重', value: dailyReminder, onChange: setDailyReminder },
            { label: '饮食记录提醒', sub: '每日三餐后提醒记录', value: dietReminder, onChange: setDietReminder },
            { label: '胎动提醒', sub: '每天 20:00 提醒开始计数', value: kickReminder, onChange: setKickReminder },
          ].map((item, i, arr) => (
            <div
              key={item.label}
              className={`flex items-center justify-between py-3 ${
                i < arr.length - 1 ? 'border-b border-border' : ''
              }`}
            >
              <div>
                <div className="text-sm text-text-primary">{item.label}</div>
                <div className="text-[11px] text-text-muted mt-0.5">{item.sub}</div>
              </div>
              <ToggleSwitch checked={item.value} onChange={item.onChange} />
            </div>
          ))}
        </div>

        {/* 隐私设置 */}
        <div className="bg-white mx-4 mt-3 rounded-card p-4 shadow-card">
          <h2 className="text-sm font-semibold text-text-primary mb-3">&#128274; 隐私设置</h2>
          {[
            { label: '数据加密存储', sub: '所有健康数据本地加密' },
            { label: '匿名分享', sub: '分享报告时自动隐去个人信息' },
          ].map((item, i, arr) => (
            <div
              key={item.label}
              className={`flex items-center justify-between py-3 ${
                i < arr.length - 1 ? 'border-b border-border' : ''
              }`}
            >
              <div>
                <div className="text-sm text-text-primary">{item.label}</div>
                <div className="text-[11px] text-text-muted mt-0.5">{item.sub}</div>
              </div>
              <ToggleSwitch checked={true} onChange={() => {}} />
            </div>
          ))}
        </div>

        {/* 其他 */}
        <div className="bg-white mx-4 mt-3 mb-4 rounded-card overflow-hidden shadow-card">
          {[
            { label: '清除缓存', sub: '当前缓存 12.3MB' },
            { label: '用户协议', sub: '' },
            { label: '隐私政策', sub: '' },
            { label: '关于MOM', sub: 'v1.0.0' },
          ].map((item, i, arr) => (
            <button
              key={item.label}
              className={`w-full flex items-center justify-between px-4 py-3.5 text-left ${
                i < arr.length - 1 ? 'border-b border-border' : ''
              }`}
            >
              <div>
                <div className="text-sm text-text-primary">{item.label}</div>
                {item.sub && <div className="text-[11px] text-text-muted mt-0.5">{item.sub}</div>}
              </div>
              <span className="text-sm text-text-muted">&#8250;</span>
            </button>
          ))}
        </div>

        {/* Logout */}
        <div className="px-4 mb-6">
          <button className="w-full h-[46px] rounded-card border-[1.5px] border-danger text-danger text-[15px] font-medium bg-white">
            退出登录
          </button>
        </div>
      </div>
    </div>
  )
}
