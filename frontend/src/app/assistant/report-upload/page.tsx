'use client'

import { useState } from 'react'
import NavBar from '@/components/layout/NavBar'
import HistoryReportList, { MOCK_HISTORY_REPORTS } from '@/components/business/HistoryReportList'

/**
 * AI报告上传页
 * 支持拍照或从相册选择报告图片，选择报告类型
 */

const REPORT_TYPES = [
  { key: 'blood_routine', label: '血常规' },
  { key: 'urine_routine', label: '尿常规' },
  { key: 'tang_screen', label: '唐氏筛查' },
  { key: 'glucose', label: '糖耐量 OGTT' },
  { key: 'liver_function', label: '肝肾功能' },
  { key: 'thyroid', label: '甲状腺功能' },
  { key: 'ultrasound', label: '超声报告' },
  { key: 'coagulation', label: '凝血功能' },
]

export default function ReportUploadPage() {
  const [selectedType, setSelectedType] = useState('blood_routine')
  const [uploadedFiles, setUploadedFiles] = useState<string[]>([])

  const handleUpload = () => {
    // Simulate upload - in real app would use reportApi.uploadImage
    setUploadedFiles([...uploadedFiles, 'report_1.jpg'])
  }

  const handleSubmit = () => {
    // TODO: reportApi.uploadReport
    window.location.href = '/assistant/report-result/1'
  }

  return (
    <div className="flex flex-col min-h-screen bg-bg">
      <NavBar title="AI诊报 · 报告上传" backHref="/assistant" />

      <div className="flex-1 overflow-y-auto hide-scrollbar p-4">
        {/* 虚线上传区 */}
        <div className="bg-white rounded-[18px] p-[30px_20px] text-center mb-4 border-2 border-dashed border-[rgba(232,124,62,0.3)]">
          <div className="w-[72px] h-[72px] bg-gradient-to-br from-[#fdf0e0] to-[#fde8cc] rounded-[20px] flex items-center justify-center text-[32px] mx-auto mb-3">
            &#128196;
          </div>
          <div className="text-[15px] font-bold text-text-primary mb-1.5">上传检验报告</div>
          <div className="text-xs text-text-muted leading-relaxed">
            支持拍照上传或从相册选择<br />
            支持同一次产检多张上传<br />
            图片质量不足时会提示重拍
          </div>

          {uploadedFiles.length > 0 && (
            <div className="flex gap-2.5 mt-3 justify-center">
              {uploadedFiles.map((file, i) => (
                <div
                  key={i}
                  className="w-[60px] h-[60px] rounded-[10px] bg-[#e8f5ee] flex flex-col items-center justify-center text-green"
                >
                  <span className="text-xl">&#128196;</span>
                  <span className="text-[10px]">已上传</span>
                </div>
              ))}
            </div>
          )}

          <div className="flex gap-2.5 mt-3.5">
            <button
              onClick={handleUpload}
              className="flex-1 py-2.5 bg-gradient-to-r from-primary-400 to-primary text-white text-xs font-bold rounded-[12px] shadow-button"
            >
              &#128247; 拍照上传
            </button>
            <button
              onClick={handleUpload}
              className="flex-1 py-2.5 bg-white text-primary border-[1.5px] border-primary-400 text-xs font-bold rounded-[12px]"
            >
              &#128444;&#65039; 从相册选择
            </button>
          </div>
        </div>

        {/* 报告类型选择 (横向 chip) */}
        <div className="mb-3.5">
          <div className="text-xs font-bold text-text-secondary mb-2">
            报告类型（可多选，系统也会自动识别）
          </div>
          <div className="flex flex-wrap gap-1.5">
            {REPORT_TYPES.map((type) => (
              <button
                key={type.key}
                onClick={() => setSelectedType(type.key)}
                className={`px-3 py-1 rounded-chip border-[1.5px] text-[11px] whitespace-nowrap ${
                  selectedType === type.key
                    ? 'bg-[#fff3e0] text-primary border-primary-400 font-bold'
                    : 'bg-white text-text-secondary border-border'
                }`}
              >
                {type.label}
              </button>
            ))}
          </div>
        </div>

        {/* History Reports */}
        <HistoryReportList
          reports={MOCK_HISTORY_REPORTS}
          onItemClick={(id) => { window.location.href = `/assistant/report-result/${id}` }}
        />
      </div>

      {/* Submit */}
      <div className="p-4 bg-white border-t border-border">
        <button
          onClick={handleSubmit}
          disabled={uploadedFiles.length === 0}
          className="btn-primary disabled:opacity-50"
        >
          开始AI解读
        </button>
      </div>
    </div>
  )
}
