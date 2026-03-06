'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Chip from '@/components/ui/Chip'
import { calculateBMI, getBMICategory, getBMICategoryName, getRecommendedWeightGain, calculateEDD, formatDate } from '@/lib/utils'

/**
 * 建档引导页
 * 用户录入孕期基础信息：末次月经、体重、身高、孕产情况
 */

type Step = 1 | 2 | 3

export default function OnboardingPage() {
  const router = useRouter()
  const [step, setStep] = useState<Step>(1)
  const [showSuccessModal, setShowSuccessModal] = useState(false)

  // 表单状态
  const [lmpDate, setLmpDate] = useState('2025-11-25')
  const [weight, setWeight] = useState('55')
  const [height, setHeight] = useState('165')
  const [parityType, setParityType] = useState<'primipara' | 'multipara'>('primipara')
  const [fetusType, setFetusType] = useState<'singleton' | 'twins'>('singleton')
  const [riskFactors, setRiskFactors] = useState<string[]>(['gestational_diabetes'])
  const [hospital, setHospital] = useState('')

  // 计算值
  const weightNum = parseFloat(weight) || 0
  const heightNum = parseFloat(height) || 0
  const bmi = weightNum > 0 && heightNum > 0 ? calculateBMI(weightNum, heightNum) : 0
  const bmiCategory = bmi > 0 ? getBMICategory(bmi) : 'normal'
  const recommendedGain = getRecommendedWeightGain(bmiCategory)
  const eddDate = lmpDate ? calculateEDD(lmpDate) : ''

  const toggleRisk = (risk: string) => {
    if (risk === 'none') {
      setRiskFactors(['none'])
      return
    }
    setRiskFactors((prev) => {
      const filtered = prev.filter((r) => r !== 'none')
      return filtered.includes(risk)
        ? filtered.filter((r) => r !== risk)
        : [...filtered, risk]
    })
  }

  const handleSubmit = () => {
    // TODO: 调用 profileApi.createProfile
    setShowSuccessModal(true)
  }

  return (
    <div className="min-h-screen bg-bg flex flex-col">

      {/* Hero with Step Indicator */}
      <div className="bg-gradient-to-br from-[#fff8f0] to-[#fff0e8] px-5 pt-6 pb-5 text-center border-b border-border">
        <div className="flex justify-center gap-1.5 mb-4">
          {[1, 2, 3].map((s) => (
            <div
              key={s}
              className={s === step ? 'w-5 h-2 rounded bg-primary' : 'w-2 h-2 rounded-full bg-border-dark'}
            />
          ))}
        </div>
        <div className="text-6xl mb-3">
          {step === 1 ? '\u{1F4CB}' : step === 2 ? '\u2696\uFE0F' : '\u{1F931}'}
        </div>
        <h1 className="text-xl font-bold text-text-primary mb-1.5">
          {step === 1 ? '基础孕期信息' : step === 2 ? '体格信息' : '孕产情况'}
        </h1>
        <p className="text-[13px] text-text-tertiary leading-relaxed">
          {step === 1
            ? <>录入末次月经日期，系统自动计算<br />你的预产期和当前孕周</>
            : step === 2
            ? <>录入体重和身高，计算BMI<br />获取个性化增重建议</>
            : <>补充孕产情况（选填），帮助我们<br />提供更精准的健康管理服务</>}
        </p>
      </div>

      {/* 表单内容 */}
      <div className="flex-1 overflow-y-auto hide-scrollbar">
        {/* Step 1: 基础孕期信息 */}
        {step === 1 && <div className="card mx-4 mt-3">
          <h2 className="text-sm font-semibold text-text-primary mb-3.5">&#128221; 基础孕期信息</h2>

          <div className="mb-3.5">
            <label className="text-[13px] text-text-secondary font-medium mb-1.5 flex justify-between">
              末次月经日期（LMP）
              <span className="text-primary text-[11px]">必填</span>
            </label>
            <input
              type="date"
              value={lmpDate}
              onChange={(e) => setLmpDate(e.target.value)}
              className="form-input-filled"
            />
            <p className="text-[11px] text-text-muted mt-1">系统将自动计算你的预产期和当前孕周</p>
          </div>

          {eddDate && (
            <div className="bg-[#fff8f3] rounded-input p-3 text-xs text-[#a06030] leading-relaxed">
              &#128204; 根据末次月经日期计算：<br />
              · <strong>预产期：{eddDate}</strong><br />
              · 当前孕周：<strong>孕14周3天</strong>
            </div>
          )}

          <div className="mt-3.5">
            <label className="text-[13px] text-text-secondary font-medium mb-1.5 flex justify-between">
              预产期
              <span className="text-primary text-[11px]">自动计算（可修改）</span>
            </label>
            <input
              type="date"
              value={eddDate}
              readOnly
              className="form-input-filled"
            />
          </div>
        </div>}

        {/* Step 2: 体格信息 */}
        {step === 2 && <div className="card mx-4 mt-3">
          <h2 className="text-sm font-semibold text-text-primary mb-3.5">&#9878;&#65039; 体格信息</h2>

          <div className="mb-3.5">
            <label className="text-[13px] text-text-secondary font-medium mb-1.5 flex justify-between">
              孕前体重<span className="text-primary text-[11px]">必填</span>
            </label>
            <div className="flex gap-2 items-center">
              <input
                type="number"
                value={weight}
                onChange={(e) => setWeight(e.target.value)}
                className="form-input-filled flex-1 text-center text-lg font-semibold"
              />
              <span className="text-[13px] text-text-muted">kg</span>
            </div>
          </div>

          <div className="mb-3.5">
            <label className="text-[13px] text-text-secondary font-medium mb-1.5 flex justify-between">
              身高<span className="text-primary text-[11px]">必填</span>
            </label>
            <div className="flex gap-2 items-center">
              <input
                type="number"
                value={height}
                onChange={(e) => setHeight(e.target.value)}
                className="form-input-filled flex-1 text-center text-lg font-semibold"
              />
              <span className="text-[13px] text-text-muted">cm</span>
            </div>
          </div>

          {bmi > 0 && (
            <div className="bg-[#fff8f3] rounded-input p-3 text-xs text-[#a06030] leading-relaxed">
              &#128204; 孕前BMI：<strong>{bmi}</strong>（{getBMICategoryName(bmiCategory)}）<br />
              · 全孕期建议增重：<strong>{recommendedGain.min}~{recommendedGain.max} kg</strong><br />
              · 参考 {recommendedGain.standard}
            </div>
          )}
        </div>}

        {/* Step 3: 孕产情况 */}
        {step === 3 && <div className="card mx-4 mt-3 mb-4">
          <h2 className="text-sm font-semibold text-text-primary mb-3.5">&#129329; 孕产情况（选填）</h2>

          <div className="mb-3.5">
            <label className="text-[13px] text-text-secondary font-medium mb-1.5 block">初/经产妇</label>
            <div className="flex gap-2">
              <Chip
                label="初产妇（第一胎）"
                active={parityType === 'primipara'}
                onClick={() => setParityType('primipara')}
              />
              <Chip
                label="经产妇"
                active={parityType === 'multipara'}
                onClick={() => setParityType('multipara')}
              />
            </div>
          </div>

          <div className="mb-3.5">
            <label className="text-[13px] text-text-secondary font-medium mb-1.5 block">是否双胎</label>
            <div className="flex gap-2">
              <Chip
                label="单胎"
                active={fetusType === 'singleton'}
                onClick={() => setFetusType('singleton')}
              />
              <Chip
                label="双胎/多胎"
                active={fetusType === 'twins'}
                onClick={() => setFetusType('twins')}
              />
            </div>
          </div>

          <div className="mb-3.5">
            <label className="text-[13px] text-text-secondary font-medium mb-1.5 block">高危因素（可多选）</label>
            <div className="flex flex-wrap gap-2">
              {[
                { key: 'hypertension_history', label: '妊高症史' },
                { key: 'gestational_diabetes', label: '妊娠糖尿病' },
                { key: 'advanced_age', label: '高龄（>35岁）' },
                { key: 'none', label: '无' },
              ].map((item) => (
                <Chip
                  key={item.key}
                  label={item.label}
                  active={riskFactors.includes(item.key)}
                  onClick={() => toggleRisk(item.key)}
                />
              ))}
            </div>
          </div>

          <div>
            <label className="text-[13px] text-text-secondary font-medium mb-1.5 block">就诊医院</label>
            <input
              type="text"
              value={hospital}
              onChange={(e) => setHospital(e.target.value)}
              placeholder="搜索医院（选填）"
              className="form-input"
            />
          </div>
        </div>}
      </div>

      {/* 底部按钮 - 分步导航 */}
      <div className="p-4 bg-white border-t border-border sticky bottom-0">
        <div className="flex gap-2.5">
          {step > 1 && (
            <button
              onClick={() => setStep((step - 1) as Step)}
              className="h-[50px] px-6 rounded-button border-[1.5px] border-border-dark text-text-secondary text-base font-semibold"
            >
              上一步
            </button>
          )}
          <button
            onClick={step < 3 ? () => setStep((step + 1) as Step) : handleSubmit}
            className="btn-primary flex-1"
          >
            {step < 3 ? '下一步' : '完成建档'}
          </button>
        </div>
      </div>

      {/* 建档成功弹窗 */}
      {showSuccessModal && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-[6px]" />
          <div className="relative bg-white rounded-[24px] px-6 py-8 text-center w-[300px] shadow-[0_20px_60px_rgba(0,0,0,0.25)]">
            <div className="text-[52px] mb-3">&#127881;</div>
            <h2 className="text-[22px] font-extrabold text-text-primary mb-2">太棒了！</h2>
            <p className="text-sm text-text-tertiary leading-relaxed mb-3.5">
              你已经成功开启了孕期准备的第一步
            </p>
            <div className="inline-block bg-[#fff8f3] rounded-input px-4 py-2.5 mb-5">
              <div className="text-[15px] font-bold text-primary">
                预产期 {eddDate ? formatDate(eddDate) : ''}
              </div>
              <div className="text-xs text-text-muted mt-0.5">
                当前孕周 · 孕14周3天
              </div>
            </div>
            <button
              onClick={() => router.push('/home')}
              className="w-full h-[50px] rounded-button bg-gradient-to-r from-primary-400 to-primary-700 text-white text-base font-semibold"
            >
              开始孕期旅程 →
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
