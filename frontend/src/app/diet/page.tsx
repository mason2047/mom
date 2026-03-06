'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import NavBar from '@/components/layout/NavBar'
import FoodReplacementCard, { MOCK_REPLACEMENTS } from '@/components/business/FoodReplacementCard'

/**
 * P18-A / P18-B - 饮食健康助手
 * AI对话式交互，食物识别，热量追踪，GDM控糖模式
 */

interface FoodItem {
  name: string
  kcal: number
  gi: 'low' | 'mid' | 'high'
}

const MOCK_FOOD: FoodItem[] = [
  { name: '白米饭（1碗）', kcal: 210, gi: 'high' },
  { name: '清炒西兰花', kcal: 85, gi: 'low' },
  { name: '番茄炒蛋', kcal: 140, gi: 'low' },
  { name: '紫菜蛋花汤', kcal: 45, gi: 'low' },
]

const GI_CONFIG = {
  low: { label: '低GI', className: 'bg-[#e8f5ee] text-green' },
  mid: { label: '中GI', className: 'bg-[#fff3eb] text-primary' },
  high: { label: '高GI', className: 'bg-[#fef0f0] text-danger' },
}

/** 首次使用问卷步骤 */
interface SurveyStep {
  question: string
  options: { key: string; text: string }[]
  multiSelect?: boolean
}

const SURVEY_STEPS: SurveyStep[] = [
  {
    question: '你好！在为你提供饮食建议前，我想先了解一下你的需求~\n\n请问你使用饮食助手主要是为了：',
    options: [
      { key: 'A', text: '控制孕期体重增长，避免长太快' },
      { key: 'B', text: '妊娠糖尿病饮食管理，控制血糖' },
      { key: 'C', text: '营养均衡，确保宝宝发育' },
      { key: 'D', text: '以上都有' },
    ],
  },
  {
    question: '了解了~请问你目前有被诊断为妊娠期糖尿病（GDM）吗？',
    options: [
      { key: 'A', text: '是，已确诊' },
      { key: 'B', text: '医生说要控制，还未正式确诊' },
      { key: 'C', text: '没有，只是想预防' },
    ],
  },
  {
    question: '最后一个问题~你有以下过敏或饮食忌口吗？（可多选）',
    options: [
      { key: 'A', text: '牛奶/乳制品' },
      { key: 'B', text: '鸡蛋' },
      { key: 'C', text: '海鲜/虾蟹' },
      { key: 'D', text: '坚果类' },
      { key: 'E', text: '无' },
    ],
    multiSelect: true,
  },
]

/** 根据选择确定模式 */
function getModeLabel(selections: Record<number, string[]>): string {
  const step1 = selections[0]?.[0]
  const step2 = selections[1]?.[0]
  if (step1 === 'B' || step2 === 'A') return 'GDM控糖模式'
  if (step1 === 'A') return '体重管理模式'
  return '营养均衡模式'
}

export default function DietPage() {
  const router = useRouter()
  const [inputText, setInputText] = useState('')
  const [isFirstUse, setIsFirstUse] = useState(true)
  const [surveyStep, setSurveyStep] = useState(0)
  const [surveySelections, setSurveySelections] = useState<Record<number, string[]>>({})
  const [surveyComplete, setSurveyComplete] = useState(false)

  const handleSurveySelect = (stepIndex: number, key: string) => {
    const step = SURVEY_STEPS[stepIndex]
    if (step.multiSelect) {
      // 多选：如果选了"无"则清除其他，否则取消"无"
      setSurveySelections((prev) => {
        const current = prev[stepIndex] || []
        if (key === 'E') return { ...prev, [stepIndex]: ['E'] }
        const filtered = current.filter((k) => k !== 'E')
        return {
          ...prev,
          [stepIndex]: filtered.includes(key)
            ? filtered.filter((k) => k !== key)
            : [...filtered, key],
        }
      })
    } else {
      setSurveySelections((prev) => ({ ...prev, [stepIndex]: [key] }))
      // 自动进入下一步
      setTimeout(() => {
        if (stepIndex < SURVEY_STEPS.length - 1) {
          setSurveyStep(stepIndex + 1)
        } else {
          setSurveyComplete(true)
          setTimeout(() => setIsFirstUse(false), 2000)
        }
      }, 500)
    }
  }

  const handleSurveyMultiConfirm = () => {
    if (surveyStep < SURVEY_STEPS.length - 1) {
      setSurveyStep(surveyStep + 1)
    } else {
      setSurveyComplete(true)
      setTimeout(() => setIsFirstUse(false), 2000)
    }
  }

  return (
    <div className="flex flex-col min-h-screen bg-bg">
      <NavBar
        title="饮食健康助手"
        onBack={() => router.push('/home')}
        rightContent={
          <button onClick={() => router.push('/diet/goal')} className="text-[13px] text-teal font-medium">
            目标设置
          </button>
        }
      />

      <div className="flex-1 overflow-y-auto hide-scrollbar">
        {/* Welcome + Daily Progress */}
        <div className="bg-gradient-to-br from-[#f0faf5] to-[#e8f9f2] px-5 py-4 border-b border-[#d0f0e8]">
          <div className="flex items-center gap-2.5 mb-2.5">
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-teal to-green flex items-center justify-center text-lg">
              &#129367;
            </div>
            <div>
              <div className="text-sm font-semibold text-[#1a6a50]">饮食健康助手</div>
              <div className="text-[11px] text-[#4aaa80]">热量控制 · GI值 · 个性化方案</div>
            </div>
          </div>

          {/* Daily Calorie Card */}
          <div className="bg-white rounded-card p-3.5 shadow-card">
            <div className="flex justify-between items-center mb-2">
              <span className="text-[13px] font-semibold text-text-primary">今日热量摄入</span>
              <span className="text-[13px] text-teal font-semibold">856 / 1800 kcal</span>
            </div>
            <div className="h-2 bg-border rounded overflow-hidden mb-1">
              <div className="h-full w-[47.6%] bg-gradient-to-r from-teal to-[#7dd4c0] rounded" />
            </div>
            <div className="flex justify-between text-[10px] text-text-muted">
              <span>早餐 340kcal</span>
              <span>午餐 516kcal</span>
              <span>晚餐 0kcal</span>
            </div>
            <div className="flex gap-1.5 mt-2.5">
              {[
                { emoji: '&#127749;', label: '早餐', done: true },
                { emoji: '&#9728;&#65039;', label: '午餐', done: true },
                { emoji: '&#127769;', label: '晚餐', done: false },
                { emoji: '&#127822;', label: '加餐', done: false },
              ].map((meal) => (
                <span
                  key={meal.label}
                  className={`px-2.5 py-1 rounded-[12px] text-[11px] ${
                    meal.done ? 'bg-teal text-white' : 'bg-bg text-text-muted'
                  }`}
                  dangerouslySetInnerHTML={{ __html: `${meal.emoji} ${meal.label}` }}
                />
              ))}
            </div>
          </div>
        </div>

        {/* ========== 首次使用问卷流程 ========== */}
        {isFirstUse ? (
          <div className="px-4 py-3 flex flex-col gap-2.5">
            <div className="text-center">
              <span className="inline-block px-3 py-0.5 bg-black/5 rounded-[10px] text-[10px] text-text-muted">
                今天 9:41
              </span>
            </div>

            {/* 已完成的问卷步骤 */}
            {Array.from({ length: surveyStep + 1 }).map((_, stepIdx) => {
              const step = SURVEY_STEPS[stepIdx]
              const selected = surveySelections[stepIdx] || []
              const isCurrentStep = stepIdx === surveyStep && !surveyComplete

              return (
                <div key={stepIdx}>
                  {/* AI 提问 */}
                  <div className="flex gap-2 items-end mb-2.5">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-teal to-green flex items-center justify-center text-base flex-shrink-0">
                      &#129367;
                    </div>
                    <div className="max-w-[280px]">
                      <div className="px-3.5 py-2.5 rounded-[16px_16px_16px_4px] bg-white text-sm text-text-primary leading-relaxed shadow-card whitespace-pre-line">
                        {step.question}
                      </div>
                      {/* 选项卡片 */}
                      {(isCurrentStep || selected.length > 0) && (
                        <div className="bg-white rounded-card p-4 shadow-card mt-1.5 max-w-[260px]">
                          <div className="flex flex-col gap-2">
                            {step.options.map((opt) => {
                              const isSelected = selected.includes(opt.key)
                              return (
                                <button
                                  key={opt.key}
                                  onClick={() => isCurrentStep && handleSurveySelect(stepIdx, opt.key)}
                                  disabled={!isCurrentStep}
                                  className={`flex items-center gap-2 px-3.5 py-2.5 rounded-input border-[1.5px] text-[13px] text-left transition-all ${
                                    isSelected
                                      ? 'border-teal bg-[#f0faf5] text-[#1a8a6a]'
                                      : 'border-border-dark text-text-secondary'
                                  } ${!isCurrentStep ? 'opacity-70' : ''}`}
                                >
                                  <span
                                    className={`w-5 h-5 rounded-full text-[11px] font-semibold flex items-center justify-center flex-shrink-0 ${
                                      isSelected ? 'bg-teal text-white' : 'bg-bg text-text-muted'
                                    }`}
                                  >
                                    {opt.key}
                                  </span>
                                  {opt.text}
                                </button>
                              )
                            })}
                          </div>
                          {/* 多选确认按钮 */}
                          {step.multiSelect && isCurrentStep && selected.length > 0 && (
                            <button
                              onClick={handleSurveyMultiConfirm}
                              className="w-full mt-3 py-2 bg-teal text-white text-[13px] font-semibold rounded-input"
                            >
                              确认
                            </button>
                          )}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* 用户选择回显 */}
                  {selected.length > 0 && !isCurrentStep && (
                    <div className="flex gap-2 items-end flex-row-reverse mb-2.5">
                      <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-base flex-shrink-0">
                        &#128100;
                      </div>
                      <div className="max-w-[260px] px-3.5 py-2.5 rounded-[16px_16px_4px_16px] bg-primary text-white text-sm leading-relaxed">
                        {selected.map((k) => {
                          const opt = step.options.find((o) => o.key === k)
                          return opt ? `${k} · ${opt.text}` : k
                        }).join('、')}
                      </div>
                    </div>
                  )}
                </div>
              )
            })}

            {/* 问卷完成 - AI 确认消息 */}
            {surveyComplete && (
              <div className="flex gap-2 items-end">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-teal to-green flex items-center justify-center text-base flex-shrink-0">
                  &#129367;
                </div>
                <div className="max-w-[280px]">
                  <div className="px-3.5 py-2.5 rounded-[16px_16px_16px_4px] bg-white text-sm text-text-primary leading-relaxed shadow-card">
                    收到！我已为你开启 <strong>{getModeLabel(surveySelections)}</strong> &#127811;<br /><br />
                    接下来我会：<br />
                    · 重点标注每种食物的GI值<br />
                    · 高GI食物红色提醒<br />
                    · 每餐控制碳水 &#8804;45g<br />
                    · 推荐低GI替代食物<br /><br />
                    现在可以拍照上传你的餐食，或者直接问我任何饮食问题~
                  </div>
                </div>
              </div>
            )}
          </div>
        ) : (
          /* ========== 日常对话（原有内容） ========== */
          <div className="px-4 py-3 flex flex-col gap-2.5">
            <div className="text-center">
              <span className="inline-block px-3 py-0.5 bg-black/5 rounded-[10px] text-[10px] text-text-muted">
                今天 12:30
              </span>
            </div>

            {/* User message */}
            <div className="flex gap-2 items-end flex-row-reverse">
              <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-base flex-shrink-0">
                &#128100;
              </div>
              <div className="max-w-[260px] px-3.5 py-2.5 rounded-[16px_16px_4px_16px] bg-primary text-white text-sm leading-relaxed">
                午餐吃了米饭、西兰花炒肉、番茄蛋汤
              </div>
            </div>

            {/* AI Response with Food Card */}
            <div className="flex gap-2 items-end">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-teal to-green flex items-center justify-center text-base flex-shrink-0">
                &#129367;
              </div>
              <div className="max-w-[280px]">
                <div className="px-3.5 py-2.5 rounded-[16px_16px_16px_4px] bg-white text-sm text-text-primary leading-relaxed shadow-card mb-1.5">
                  帮你分析了午餐的营养成分：
                </div>

                {/* Food Result Card */}
                <div className="bg-white rounded-card overflow-hidden shadow-card-md">
                  <div className="w-full h-[90px] bg-gradient-to-br from-[#f0f9f0] to-[#e8f5e8] flex items-center justify-center text-[40px] relative">
                    &#127858;
                    <span className="absolute top-2 left-2 bg-black/50 text-white text-[10px] px-2 py-0.5 rounded-[10px]">
                      AI识别
                    </span>
                  </div>
                  <div className="px-3 py-2 text-[13px] font-semibold text-text-primary border-b border-border">
                    午餐 · 食物分析
                  </div>
                  <div className="px-3 py-1">
                    {MOCK_FOOD.map((food) => (
                      <div key={food.name} className="flex items-center justify-between py-1.5 border-b border-[#fafaf8] last:border-b-0 text-[13px]">
                        <span className="flex items-center gap-1.5 text-text-primary">
                          {food.name}
                          <span className={`text-[9px] px-1.5 py-0.5 rounded-md font-semibold ${GI_CONFIG[food.gi].className}`}>
                            {GI_CONFIG[food.gi].label}
                          </span>
                        </span>
                        <span className="text-xs text-text-muted">{food.kcal} kcal</span>
                      </div>
                    ))}
                  </div>
                  <div className="bg-[#f9f5f0] px-3 py-2.5 flex justify-between items-center">
                    <span className="text-[13px] text-text-secondary font-medium">总热量</span>
                    <span className="text-base font-bold text-text-primary">480 kcal</span>
                  </div>
                  {/* Macro bar */}
                  <div className="px-3 py-2">
                    <div className="flex justify-between text-[10px] text-text-muted mb-1">
                      <span>碳水 58%</span>
                      <span>脂肪 22%</span>
                      <span>蛋白质 20%</span>
                    </div>
                    <div className="h-1.5 rounded bg-border overflow-hidden flex">
                      <div className="bg-blue" style={{ width: '58%' }} />
                      <div className="bg-purple" style={{ width: '22%' }} />
                      <div className="bg-green" style={{ width: '20%' }} />
                    </div>
                  </div>
                  <div className="flex gap-2 px-3 py-2.5">
                    <button className="flex-1 h-9 rounded-button bg-bg text-xs font-medium text-text-secondary">
                      修改食物
                    </button>
                    <button className="flex-1 h-9 rounded-button bg-teal text-xs font-medium text-white">
                      记录这餐
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* AI Evaluation */}
            <div className="ml-10">
              <div className="bg-[#f0faf5] border-l-[3px] border-teal rounded-r-[12px] px-3.5 py-2.5 text-xs text-[#2a6a50] leading-relaxed">
                <strong>&#128202; AI评估：</strong>这餐整体热量适中，但白米饭属于高GI食物。建议下次可以换成糙米或杂粮饭，有助于控制餐后血糖。蛋白质摄入偏少，可以加一个水煮蛋或豆腐。
              </div>
            </div>

            {/* Food Replacement Suggestion */}
            <div className="ml-10 mt-2">
              <FoodReplacementCard
                originalFood="白米饭"
                originalGI={83}
                originalKcal={210}
                replacements={MOCK_REPLACEMENTS}
              />
            </div>
          </div>
        )}
      </div>

      {/* Input Bar */}
      <div className="flex items-center gap-2 px-3 py-2.5 bg-white border-t border-border">
        <button className="w-10 h-10 rounded-full bg-bg flex items-center justify-center text-lg flex-shrink-0">
          &#128247;
        </button>
        <input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder="输入食物名称或拍照识别..."
          className="flex-1 h-10 rounded-chip border-[1.5px] border-border-dark px-3.5 text-sm text-text-primary bg-[#fafaf8] outline-none focus:border-teal"
        />
        <button className="w-10 h-10 rounded-full bg-teal flex items-center justify-center text-lg text-white flex-shrink-0 shadow-[0_2px_8px_rgba(29,200,160,0.35)]">
          &#8593;
        </button>
      </div>
    </div>
  )
}
