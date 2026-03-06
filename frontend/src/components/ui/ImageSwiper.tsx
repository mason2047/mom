'use client'

import { useState, useRef, useCallback } from 'react'
import { cn } from '@/lib/utils'

/**
 * 图片轮播组件
 * 支持 touch 滑动、圆点指示器、页码显示
 */

interface ImageSwiperProps {
  images: { src: string; alt?: string; emoji?: string }[]
  className?: string
  height?: number
}

export default function ImageSwiper({ images, className = '', height = 200 }: ImageSwiperProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const containerRef = useRef<HTMLDivElement>(null)
  const startX = useRef(0)
  const isDragging = useRef(false)
  const dragDelta = useRef(0)

  const total = images.length

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    isDragging.current = true
    startX.current = e.touches[0].clientX
    dragDelta.current = 0
  }, [])

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    if (!isDragging.current) return
    dragDelta.current = e.touches[0].clientX - startX.current
  }, [])

  const handleTouchEnd = useCallback(() => {
    isDragging.current = false
    const threshold = 50
    if (dragDelta.current < -threshold && currentIndex < total - 1) {
      setCurrentIndex(currentIndex + 1)
    } else if (dragDelta.current > threshold && currentIndex > 0) {
      setCurrentIndex(currentIndex - 1)
    }
    dragDelta.current = 0
  }, [currentIndex, total])

  return (
    <div className={cn('relative overflow-hidden rounded-card', className)} style={{ height }}>
      {/* Slides */}
      <div
        ref={containerRef}
        className="flex h-full transition-transform duration-300 ease-out touch-pan-y"
        style={{ transform: `translateX(-${currentIndex * 100}%)` }}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {images.map((img, i) => (
          <div
            key={i}
            className="w-full h-full flex-shrink-0 bg-gradient-to-br from-[#f0f0f0] to-[#e8e8e8] flex items-center justify-center"
          >
            {img.emoji ? (
              <span className="text-7xl">{img.emoji}</span>
            ) : (
              <div className="w-full h-full bg-[#f0f0f0] flex items-center justify-center text-text-muted text-sm">
                {img.alt || `图片 ${i + 1}`}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Dots Indicator */}
      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
        {images.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrentIndex(i)}
            className={cn(
              'rounded-full transition-all duration-200',
              i === currentIndex
                ? 'w-2.5 h-2.5 bg-white shadow-md'
                : 'w-[7px] h-[7px] bg-white/50'
            )}
          />
        ))}
      </div>

      {/* Page Counter */}
      <div className="absolute bottom-3 right-3 bg-black/50 text-white text-[10px] px-2 py-0.5 rounded-[10px]">
        {currentIndex + 1}/{total}
      </div>
    </div>
  )
}
