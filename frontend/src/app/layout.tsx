import type { Metadata, Viewport } from 'next'
import '@/styles/globals.css'

export const metadata: Metadata = {
  title: 'MOM孕期助手 - 为你的宝宝保驾护航',
  description: '智能孕期健康管理平台，提供产检提醒、AI报告解读、饮食管理、月子规划等一站式服务',
  keywords: '孕期,产检,孕周,孕期管理,妊娠糖尿病,月子,月嫂',
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: '#fdf6ee',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="zh-CN">
      <body className="min-h-screen bg-bg">
        {children}
      </body>
    </html>
  )
}
