'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import NavBar from '@/components/layout/NavBar'
import HistoryReportList, { MOCK_HISTORY_REPORTS } from '@/components/business/HistoryReportList'

/**
 * AI报告上传页
 * 支持拍照或从相册选择报告图片，选择报告类型
 */

const REPORT_TYPES = [
  { key: 'blood_routine', label: '血常规', icon: '&#129656;' },
  { key: 'urine_routine', label: '尿常规', icon: '&#129514;' },
  { key: 'liver_function', label: '肝功能', icon: '&#129516;' },
  { key: 'glucose', label: '糖耐量/血糖', icon: '&#128137;' },
  { key: 'thyroid', label: '甲状腺功能', icon: '&#129516;' },
  { key: 'ultrasound', label: 'B超/彩超', icon: '&#128302;' },
  { key: 'tang_screen', label: '唐筛/无创DNA', icon: '&#129516;' },
  { key: 'other', label: '其他报告', icon: '&#128196;' },
]

export default function ReportUploadPage() {
  const router = useRouter()
  const [selectedType, setSelectedType] = useState('blood_routine')
  const [uploadedFiles, setUploadedFiles] = useState<string[]>([])

  const handleUpload = () => {
    // Simulate upload - in real app would use reportApi.uploadImage
    setUploadedFiles([...uploadedFiles, 'report_1.jpg'])
  }

  const handleSubmit = () => {
    // TODO: reportApi.uploadReport
    router.push('/assistant/report-result/1')
  }

  return (
    <div className="flex flex-col min-h-screen bg-bg">
      <NavBar title="AI报告解读" onBack={() => router.back()} />

      <div className="flex-1 overflow-y-auto hide-scrollbar">
        {/* Hero */}
        <div className="bg-gradient-to-br from-[#fdf0e0] to-[#fce8cc] px-5 py-5 text-center border-b border-border">
          <div className="text-5xl mb-3">&#128202;</div>
          <h2 className="text-lg font-bold text-[#3d1f00] mb-1">上传检验报告</h2>
          <p className="text-xs text-[#8a5a30]">
            拍照或上传报告图片，AI帮你解读每个指标
          </p>
        </div>

        {/* 选择报告类型 */}
        <div className="bg-white mx-4 mt-3 rounded-card p-4 shadow-card">
          <h2 className="text-[15px] font-semibold text-text-primary mb-3">&#128203; 报告类型</h2>
          <div className="grid grid-cols-4 gap-2">
            {REPORT_TYPES.map((type) => (
              <button
                key={type.key}
                onClick={() => setSelectedType(type.key)}
                className={`flex flex-col items-center gap-1 py-2.5 rounded-[10px] border-[1.5px] transition-all duration-200 ${
                  selectedType === type.key
                    ? 'border-primary bg-primary-100 scale-[1.05]'
                    : 'border-border bg-white scale-100'
                }`}
              >
                <span className="text-xl" dangerouslySetInnerHTML={{ __html: type.icon }} />
                <span className="text-[10px] text-text-secondary">{type.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* 上传区域 */}
        <div className="bg-white mx-4 mt-3 rounded-card p-4 shadow-card">
          <h2 className="text-[15px] font-semibold text-text-primary mb-3">&#128247; 上传报告图片</h2>

          {uploadedFiles.length > 0 && (
            <div className="flex gap-2.5 mb-3">
              {uploadedFiles.map((file, i) => (
                <div
                  key={i}
                  className="w-[80px] h-[80px] rounded-[10px] bg-[#e8f5ee] flex flex-col items-center justify-center text-green"
                >
                  <span className="text-2xl">&#128196;</span>
                  <span className="text-[10px]">已上传</span>
                </div>
              ))}
            </div>
          )}

          <button
            onClick={handleUpload}
            className="w-full border-2 border-dashed border-border-dark rounded-[12px] py-6 text-center active:bg-[#f9f5f0]"
          >
            <div className="text-3xl mb-1.5">&#128247;</div>
            <div className="text-[13px] text-text-muted">点击拍照或从相册选择</div>
            <div className="text-[11px] text-text-light mt-1">支持 JPG、PNG 格式</div>
          </button>
        </div>

        {/* History Reports */}
        <div className="px-4 mt-3">
          <HistoryReportList
            reports={MOCK_HISTORY_REPORTS}
            onItemClick={(id) => router.push(`/assistant/report-result/${id}`)}
          />
        </div>

        {/* Tips */}
        <div className="mx-4 mt-3 mb-4 bg-[#fff8f3] border-l-[3px] border-primary rounded-r-[12px] px-3.5 py-3">
          <div className="text-xs text-[#a06030] leading-relaxed">
            <strong>&#128161; 拍摄建议：</strong><br />
            · 保持报告单平整，避免遮挡<br />
            · 光线充足，避免反光和阴影<br />
            · 确保文字和数字清晰可读<br />
            · 如有多页，请逐页上传
          </div>
        </div>
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
