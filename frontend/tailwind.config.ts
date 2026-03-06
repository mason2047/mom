import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // 主色系 - 橙色
        primary: {
          DEFAULT: '#e87c3e',
          50: '#fff8f3',
          100: '#fff3eb',
          200: '#ffe8d0',
          300: '#fcd8b0',
          400: '#f4b382',
          500: '#e87c3e',
          600: '#FF8C42',
          700: '#FF6030',
          800: '#c05020',
          900: '#5a3010',
        },
        // 绿色
        green: {
          DEFAULT: '#4CAF7D',
          50: '#e8f5ee',
          100: '#c8e6c9',
          200: '#7dd4a8',
          300: '#4CAF7D',
          400: '#388e3c',
          500: '#2e7d32',
          600: '#1b5e20',
        },
        // 玫红色 - 月子规划专用
        rose: {
          DEFAULT: '#E8607A',
          50: '#fff0f4',
          100: '#ffe0ea',
          200: '#ffb8c8',
          300: '#ff8090',
          400: '#E8607A',
          500: '#c04060',
        },
        // 蓝色
        blue: {
          DEFAULT: '#5B8BF5',
          50: '#eef2ff',
          100: '#e3f2fd',
          200: '#bbdefb',
          300: '#90caf9',
          400: '#5B8BF5',
          500: '#1565c0',
        },
        // 紫色
        purple: {
          DEFAULT: '#9B6FD4',
          50: '#f3f0ff',
          100: '#f3e5f5',
          200: '#ce93d8',
          300: '#9B6FD4',
          400: '#7b1fa2',
        },
        // 红色
        danger: {
          DEFAULT: '#E05252',
          50: '#fef0f0',
          100: '#ffebee',
          200: '#ffe0e0',
          300: '#E05252',
          400: '#e53935',
          500: '#b71c1c',
        },
        // 金色
        gold: {
          DEFAULT: '#E8A020',
          50: '#fffbec',
          100: '#fff8e0',
          200: '#ffe8b0',
          300: '#f0b429',
          400: '#E8A020',
        },
        // 蓝绿色 - 饮食助手专用
        teal: {
          DEFAULT: '#1DC8A0',
          50: '#f0faf5',
          100: '#e8f9f2',
          200: '#d0f0e8',
          300: '#7dd4c0',
          400: '#1DC8A0',
          500: '#1a8a6a',
          600: '#2a6a50',
        },
        // 背景色系
        bg: {
          DEFAULT: '#f5f1ec',
          warm: '#fdf6ee',
          cream: '#fff8f0',
          page: '#e8e0d8',
        },
        // 边框色
        border: {
          DEFAULT: '#f0ebe4',
          light: '#f5f1ec',
          medium: '#e8e2da',
          dark: '#e0d8d0',
        },
        // 文本色
        text: {
          primary: '#1a1a1a',
          secondary: '#555555',
          tertiary: '#888888',
          muted: '#aaaaaa',
          light: '#cccccc',
        },
      },
      borderRadius: {
        'card': '16px',
        'phone': '44px',
        'chip': '20px',
        'button': '14px',
        'input': '10px',
      },
      boxShadow: {
        'card': '0 2px 8px rgba(0,0,0,0.04)',
        'card-md': '0 2px 12px rgba(0,0,0,0.06)',
        'card-lg': '0 3px 14px rgba(0,0,0,0.1)',
        'phone': '0 24px 60px rgba(0,0,0,0.22)',
        'button': '0 6px 20px rgba(255,140,66,0.4)',
        'float': '0 4px 14px rgba(232,124,62,0.4)',
      },
      fontFamily: {
        sans: [
          '-apple-system',
          'BlinkMacSystemFont',
          'PingFang SC',
          'Helvetica Neue',
          'sans-serif',
        ],
      },
      animation: {
        'breathe': 'breathe 3s ease-in-out infinite',
        'float1': 'float1 2.8s ease-in-out infinite',
        'float2': 'float2 3.4s ease-in-out infinite',
        'pulse-glow': 'pulse-glow 0.83s ease-in-out infinite',
        'typing': 'typing 1.2s ease-in-out infinite',
        'slide-up': 'slideUp 0.3s ease-out',
      },
      keyframes: {
        slideUp: {
          '0%': { transform: 'translateY(100%)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        breathe: {
          '0%, 100%': { transform: 'scale(1)' },
          '50%': { transform: 'scale(1.03)' },
        },
        float1: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-4px)' },
        },
        float2: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(3px)' },
        },
        'pulse-glow': {
          '0%, 100%': {
            boxShadow: '0 0 0 4px rgba(232,124,62,0.2), 0 0 0 10px rgba(232,124,62,0.08)',
          },
          '50%': {
            boxShadow: '0 0 0 8px rgba(232,124,62,0.3), 0 0 0 18px rgba(232,124,62,0.1)',
          },
        },
        typing: {
          '0%, 80%, 100%': { transform: 'scale(0.8)', opacity: '0.4' },
          '40%': { transform: 'scale(1)', opacity: '1' },
        },
      },
    },
  },
  plugins: [],
}
export default config
