/** @type {import('next').NextConfig} */
const nextConfig = {
  // 移动端优化：禁止字体大小自动调整
  experimental: {
    // 启用 App Router 优化
  },
  // 图片域名白名单
  images: {
    domains: [],
    // 生产环境可配置 CDN
  },
}

module.exports = nextConfig
