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
        <div className="bg-[#fff8fa] rounded-[12px] border-[1.5px] border-rose/20 p-4">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm text-text-primary font-medium">尊享套餐</span>
            <span className="text-[11px] text-text-muted">28天</span>
          </div>
          <div className="flex justify-between items-baseline mb-3">
            <span className="text-xs text-text-secondary">套餐总价</span>
            <span className="text-xl font-bold text-rose">&#165;58,800</span>
          </div>
          <div className="border-t border-border pt-2.5">
            <div className="flex justify-between items-center">
              <span className="text-xs text-text-secondary">预约定金</span>
              <span className="text-base font-bold text-rose">&#165;5,000</span>
            </div>
            <p className="text-[11px] text-text-muted mt-1.5">
              定金可在入住前7天免费退款，尾款入住当天支付
            </p>
          </div>
        </div>
      </div>
    </>
  )
}
