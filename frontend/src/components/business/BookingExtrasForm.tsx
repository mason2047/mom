'use client'

import { useState } from 'react'
import Chip from '@/components/ui/Chip'

/**
 * P11-Booking: 预约表单补全组件
 * 分娩方式、是否双胎、特殊需求、费用确认
 */

export type DeliveryType = 'vaginal' | 'cesarean'
export type TwinType = 'singleton' | 'twins'

interface BookingExtrasFormProps {
  onDeliveryTypeChange?: (type: DeliveryType) => void
  onTwinTypeChange?: (type: TwinType) => void
  onSpecialNeedsChange?: (needs: string[]) => void
}

const SPECIAL_NEEDS = [
  { key: 'gdm_meal', label: 'GDM定制餐' },
  { key: 'breastfeed', label: '母乳指导' },
  { key: 'cesarean_care', label: '剖宫产护理' },
  { key: 'postpartum_repair', label: '产后修复' },
  { key: 'newborn_care', label: '新生儿专护' },
  { key: 'traditional_meal', label: '中药膳调理' },
]

export default function BookingExtrasForm({
  onDeliveryTypeChange,
  onTwinTypeChange,
  onSpecialNeedsChange,
}: BookingExtrasFormProps) {
  const [deliveryType, setDeliveryType] = useState<DeliveryType>('vaginal')
  const [twinType, setTwinType] = useState<TwinType>('singleton')
  const [specialNeeds, setSpecialNeeds] = useState<string[]>([])

  const handleDeliveryChange = (type: DeliveryType) => {
    setDeliveryType(type)
    onDeliveryTypeChange?.(type)
  }

  const handleTwinChange = (type: TwinType) => {
    setTwinType(type)
    onTwinTypeChange?.(type)
  }

  const toggleNeed = (key: string) => {
    const updated = specialNeeds.includes(key)
      ? specialNeeds.filter((n) => n !== key)
      : [...specialNeeds, key]
    setSpecialNeeds(updated)
    onSpecialNeedsChange?.(updated)
  }

  return (
    <>
      {/* 分娩方式 */}
      <div className="bg-white mx-4 mt-3 rounded-card p-4 shadow-card">
        <h2 className="text-[15px] font-semibold text-text-primary mb-3.5">
          &#129328; 分娩信息
        </h2>

        <div className="mb-3.5">
          <label className="text-[13px] text-text-secondary font-medium mb-1.5 block">
            分娩方式
          </label>
          <div className="flex gap-2">
            <Chip
              label="顺产"
              active={deliveryType === 'vaginal'}
              onClick={() => handleDeliveryChange('vaginal')}
              variant="rose"
            />
            <Chip
              label="剖宫产"
              active={deliveryType === 'cesarean'}
              onClick={() => handleDeliveryChange('cesarean')}
              variant="rose"
            />
          </div>
        </div>

        <div>
          <label className="text-[13px] text-text-secondary font-medium mb-1.5 block">
            是否双胎
          </label>
          <div className="flex gap-2">
            <Chip
              label="单胎"
              active={twinType === 'singleton'}
              onClick={() => handleTwinChange('singleton')}
              variant="rose"
            />
            <Chip
              label="双胎/多胎"
              active={twinType === 'twins'}
              onClick={() => handleTwinChange('twins')}
              variant="rose"
            />
          </div>
        </div>
      </div>

      {/* 特殊需求 */}
      <div className="bg-white mx-4 mt-3 rounded-card p-4 shadow-card">
        <h2 className="text-[15px] font-semibold text-text-primary mb-3.5">
          &#128203; 特殊需求（可多选）
        </h2>
        <div className="flex flex-wrap gap-2">
          {SPECIAL_NEEDS.map((item) => (
            <Chip
              key={item.key}
              label={item.label}
              active={specialNeeds.includes(item.key)}
              onClick={() => toggleNeed(item.key)}
              variant="rose"
            />
          ))}
        </div>
      </div>

      {/* 费用确认 */}
      <div className="bg-white mx-4 mt-3 rounded-card p-4 shadow-card">
        <h2 className="text-[15px] font-semibold text-text-primary mb-3.5">
          &#128176; 费用确认
        </h2>
        <div className="bg-[#f0faf5] rounded-[10px] p-3 flex justify-between items-center">
          <div>
            <div className="text-[13px] text-text-secondary">尊享单人间套餐 · 28天</div>
            <div className="text-[11px] text-text-muted mt-0.5">V1.0意向预约无需支付定金</div>
          </div>
          <div className="text-right">
            <div className="text-[11px] text-text-muted">意向预约</div>
            <div className="text-xl font-bold text-rose">免费</div>
          </div>
        </div>
        <div className="text-[11px] text-text-muted mt-2 leading-relaxed">
          · 提交后机构将在24小时内电话回访确认<br />
          · 确认后可签订服务协议并支付定金锁定床位
        </div>
      </div>
    </>
  )
}
