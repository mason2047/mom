'use client'

/**
 * P10: 历史报告列表组件
 * 展示已上传的历史报告，包含图标、名称、日期、状态 badge
 */

interface HistoryReport {
  id: string
  icon: string
  iconBg: string
  name: string
  date: string
  weekLabel: string
  status: 'normal' | 'warn' | 'alert'
  statusText: string
}

interface HistoryReportListProps {
  reports: HistoryReport[]
  onItemClick?: (reportId: string) => void
}

const STATUS_STYLES: Record<string, string> = {
  normal: 'bg-[#e8f5e9] text-green',
  warn: 'bg-[#fff3e0] text-primary',
  alert: 'bg-[#ffebee] text-danger',
}

/** 历史报告 Mock 数据 */
export const MOCK_HISTORY_REPORTS: HistoryReport[] = [
  {
    id: 'hr-1',
    icon: '&#129656;',
    iconBg: '#fff3e0',
    name: '血常规',
    date: '2026-03-01',
    weekLabel: '孕13周产检',
    status: 'warn',
    statusText: '偏低',
  },
  {
    id: 'hr-2',
    icon: '&#128167;',
    iconBg: '#e8f5e9',
    name: '尿常规',
    date: '2026-03-01',
    weekLabel: '孕13周产检',
    status: 'normal',
    statusText: '正常',
  },
  {
    id: 'hr-3',
    icon: '&#128300;',
    iconBg: '#e3f2fd',
    name: '肝肾功能',
    date: '2026-02-10',
    weekLabel: '孕11周产检',
    status: 'normal',
    statusText: '正常',
  },
]

export default function HistoryReportList({ reports, onItemClick }: HistoryReportListProps) {
  if (reports.length === 0) return null

  return (
    <div className="mt-4">
      <h3 className="text-[13px] font-bold text-text-primary mb-2.5">历史报告</h3>
      <div className="flex flex-col gap-2">
        {reports.map((report) => (
          <button
            key={report.id}
            onClick={() => onItemClick?.(report.id)}
            className="bg-white rounded-[14px] px-3.5 py-3 flex items-center gap-3 shadow-card text-left active:bg-bg-warm transition-colors"
          >
            {/* 图标 */}
            <div
              className="w-10 h-10 rounded-[10px] flex items-center justify-center text-xl flex-shrink-0"
              style={{ background: report.iconBg }}
              dangerouslySetInnerHTML={{ __html: report.icon }}
            />
            {/* 信息 */}
            <div className="flex-1 min-w-0">
              <div className="text-[13px] font-bold text-text-primary">{report.name}</div>
              <div className="text-[11px] text-text-muted mt-0.5">
                {report.date} · {report.weekLabel}
              </div>
            </div>
            {/* 状态 Badge */}
            <span
              className={`text-[10px] font-bold px-2 py-0.5 rounded-[10px] ${STATUS_STYLES[report.status]}`}
            >
              {report.statusText}
            </span>
          </button>
        ))}
      </div>
    </div>
  )
}
