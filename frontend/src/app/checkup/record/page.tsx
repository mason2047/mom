'use client'

import { useState } from 'react'
import NavBar from '@/components/layout/NavBar'
import Chip from '@/components/ui/Chip'

/**
 * P08 - 产检记录填写页
 * 填写基础信息、打卡检查项目、上传报告、医生嘱咐
 */

const RESULT_OPTIONS = ['一切正常', '有指标异常', '需要复查']
const CHECK_ITEMS = ['大排畸超声', '血常规', '尿常规', '血压测量', '体重测量']

export default function CheckupRecordPage() {
  const [actualDate, setActualDate] = useState('2026-03-26')
  const [hospital, setHospital] = useState('北京妇产医院')
  const [result, setResult] = useState('一切正常')
  const [completedItems, setCompletedItems] = useState(['大排畸超声', '血常规', '尿常规'])
  const [uploadedImages, setUploadedImages] = useState([
    { id: '1', icon: '&#129656;', label: '血常规' },
    { id: '2', icon: '&#129514;', label: '尿常规' },
  ])
  const [notes, setNotes] = useState(
    '宝宝发育正常，各项指标在参考范围内。下次产检孕24-28周，需做糖耐量试验，提前空腹8小时。'
  )

  const toggleItem = (item: string) => {
    setCompletedItems((prev) =>
      prev.includes(item) ? prev.filter((i) => i !== item) : [...prev, item]
    )
  }

  const handleSubmit = () => {
    // TODO: call checkupApi.createCheckupRecord
    window.location.href = '/checkup'
  }

  return (
    <div className="flex flex-col min-h-screen bg-bg">
      <NavBar title="记录产检结果" backHref="/checkup" />

      <div className="flex-1 overflow-y-auto hide-scrollbar">
        {/* 基础信息 */}
        <div className="bg-white mx-4 mt-3 rounded-card p-4 shadow-card">
          <h2 className="text-[15px] font-semibold text-text-primary mb-4">
            &#128203; 基础信息
          </h2>
          <div className="mb-3.5">
            <label className="text-[13px] text-text-secondary font-medium mb-1.5 block">产检名称</label>
            <input
              className="form-input-filled"
              value="第3次产检 · 大排畸超声"
              readOnly
            />
          </div>
          <div className="mb-3.5">
            <label className="text-[13px] text-text-secondary font-medium mb-1.5 block">实际产检日期</label>
            <input
              type="date"
              className="form-input"
              value={actualDate}
              onChange={(e) => setActualDate(e.target.value)}
            />
          </div>
          <div className="mb-3.5">
            <label className="text-[13px] text-text-secondary font-medium mb-1.5 block">就诊医院</label>
            <input
              type="text"
              className="form-input"
              value={hospital}
              onChange={(e) => setHospital(e.target.value)}
              placeholder="请输入医院名称"
            />
          </div>
          <div>
            <label className="text-[13px] text-text-secondary font-medium mb-1.5 block">产检结果</label>
            <div className="flex gap-2 flex-wrap">
              {RESULT_OPTIONS.map((opt) => (
                <Chip
                  key={opt}
                  label={opt === '一切正常' ? `${opt} &#10003;` : opt}
                  active={result === opt}
                  onClick={() => setResult(opt)}
                />
              ))}
            </div>
          </div>
        </div>

        {/* 检查项目打卡 */}
        <div className="bg-white mx-4 mt-3 rounded-card p-4 shadow-card">
          <h2 className="text-[15px] font-semibold text-text-primary mb-4">
            &#9989; 完成检查项目
          </h2>
          <div className="flex flex-wrap gap-2">
            {CHECK_ITEMS.map((item) => (
              <button
                key={item}
                onClick={() => toggleItem(item)}
                className={`px-3.5 py-1.5 rounded-chip border-[1.5px] text-xs transition-colors ${
                  completedItems.includes(item)
                    ? 'bg-[#eef2ff] border-blue text-blue'
                    : 'bg-white border-border-dark text-text-secondary'
                }`}
              >
                {item}
              </button>
            ))}
          </div>
          <p className="text-[11px] text-text-muted mt-2.5">点击选中本次已完成的检查项目</p>
        </div>

        {/* 上传报告 */}
        <div className="bg-white mx-4 mt-3 rounded-card p-4 shadow-card">
          <h2 className="text-[15px] font-semibold text-text-primary mb-4">
            &#128196; 上传检查报告
          </h2>
          <div className="flex gap-2.5 mb-2.5 flex-wrap">
            {uploadedImages.map((img) => (
              <div
                key={img.id}
                className="w-[70px] h-[70px] rounded-[10px] bg-[#e8f5ee] flex flex-col items-center justify-center text-[10px] text-green relative"
              >
                <span className="text-xl" dangerouslySetInnerHTML={{ __html: img.icon }} />
                {img.label}
                <button
                  onClick={() => {
                    if (window.confirm(`确定删除「${img.label}」图片？`)) {
                      setUploadedImages((prev) => prev.filter((i) => i.id !== img.id))
                    }
                  }}
                  className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-danger text-white text-xs flex items-center justify-center shadow-sm"
                >
                  x
                </button>
              </div>
            ))}
            <button className="w-[70px] h-[70px] rounded-[10px] bg-bg border-2 border-dashed border-border-dark flex items-center justify-center text-xl text-text-muted">
              +
            </button>
          </div>
          <p className="text-[11px] text-text-muted">拍照或从相册选择，上传后AI自动解读报告指标</p>
        </div>

        {/* 医生嘱咐 */}
        <div className="bg-white mx-4 mt-3 mb-4 rounded-card p-4 shadow-card">
          <h2 className="text-[15px] font-semibold text-text-primary mb-4">
            &#128172; 医生嘱咐 / 备注
          </h2>
          <textarea
            className="w-full h-20 rounded-input border-[1.5px] border-border-dark p-3 text-sm text-text-primary bg-[#fafaf8] outline-none resize-none leading-relaxed focus:border-primary"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="记录本次产检医生的建议、下次产检注意事项等..."
          />
        </div>
      </div>

      {/* Submit */}
      <div className="p-4 bg-white border-t border-border sticky bottom-0">
        <button onClick={handleSubmit} className="btn-primary">
          保存产检记录
        </button>
      </div>
    </div>
  )
}
