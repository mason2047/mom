import NavBar from '@/components/layout/NavBar'

/**
 * P18-B - 食物识别结果页（全屏独立页面）
 * 展示 AI 食物识别结果、GI 标注、替代建议、营养素分析
 */

interface FoodResultItem {
  emoji: string
  name: string
  weight: number
  giValue: number
  giLevel: 'low' | 'high'
  calories: number
  isHighGI?: boolean
  suggestReplace?: boolean
}

const MOCK_FOODS: FoodResultItem[] = [
  { emoji: '🍳', name: '煎蛋', weight: 60, giValue: 15, giLevel: 'low', calories: 98 },
  { emoji: '🦐', name: '白灼虾', weight: 150, giValue: 18, giLevel: 'low', calories: 161 },
  { emoji: '🥦', name: '西兰花', weight: 100, giValue: 10, giLevel: 'low', calories: 26 },
  {
    emoji: '🍚',
    name: '白米饭',
    weight: 200,
    giValue: 83,
    giLevel: 'high',
    calories: 232,
    isHighGI: true,
    suggestReplace: true,
  },
]

const REPLACEMENTS = [
  { name: '黑米饭', gi: 56, highlight: true },
  { name: '糙米饭', gi: 59, highlight: true },
  { name: '藜麦', gi: 53, highlight: false },
]

const TOTAL_CALORIES = 517
const MACROS = {
  carb: { percent: 55, grams: 71, color: '#5B8BF5' },
  fat: { percent: 20, grams: 0, color: '#9B6FD4' },
  protein: { percent: 25, grams: 0, color: '#4CAF7D' },
}

export default function DietResultPage() {
  return (
    <div className="flex flex-col min-h-screen bg-bg">
      <NavBar
        title="识别结果"
        backHref="/diet"
        rightContent={<span className="text-[13px] text-text-muted">修改</span>}
      />

      <div className="flex-1 overflow-y-auto hide-scrollbar">
        {/* Image Preview */}
        <div className="w-full h-[180px] bg-gradient-to-br from-[#f0f9f0] to-[#d8f4e8] flex items-center justify-center text-7xl relative">
          🍱
          <div className="absolute bottom-3 left-3 bg-black/60 text-white text-[11px] px-2.5 py-1 rounded-[10px]">
            午餐 · 12:30
          </div>
          <div className="absolute bottom-3 right-3 bg-teal text-white text-[11px] px-2.5 py-1 rounded-[10px]">
            识别完成 ✓
          </div>
        </div>

        {/* Result Section */}
        <div className="px-4 py-3.5">
          <h2 className="text-[15px] font-semibold text-text-primary mb-3">已识别食物</h2>

          <div className="bg-white rounded-card overflow-hidden shadow-card">
            {/* GDM Mode Banner */}
            <div className="px-3.5 py-2.5 bg-[#f0faf5] border-b border-[#d0f0e0] text-xs text-[#1a8a6a]">
              🌿 GDM控糖模式已开启 · 高GI食物已高亮提醒
            </div>

            {/* Food List */}
            <div className="px-3.5">
              {MOCK_FOODS.map((food) => (
                <div
                  key={food.name}
                  className={`flex items-center justify-between py-2.5 border-b border-[#fafaf8] last:border-b-0 ${
                    food.isHighGI ? 'bg-[#fff8f0] -mx-3.5 px-3.5' : ''
                  }`}
                >
                  <div className="flex items-center gap-1.5 flex-1">
                    <span>
                      {food.emoji} {food.name}
                    </span>
                    {food.suggestReplace && (
                      <span className="text-[10px] px-1.5 py-0.5 bg-[#fef0f0] text-danger rounded">
                        建议替换
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className={`text-xs ${food.isHighGI ? 'text-danger' : 'text-text-muted'}`}>
                      {food.weight}g
                    </span>
                    <span
                      className={`text-[10px] px-1.5 py-0.5 rounded font-semibold ${
                        food.giLevel === 'low'
                          ? 'bg-[#e8f5ee] text-green'
                          : 'bg-[#fef0f0] text-danger'
                      }`}
                    >
                      {food.giLevel === 'low' ? '低' : '高'}GI {food.giValue}
                    </span>
                    <span className={`text-xs font-semibold ${food.isHighGI ? 'text-danger' : 'text-text-primary'}`}>
                      {food.calories} kcal
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* Replacement Suggestions */}
            <div className="px-3.5 py-2.5 bg-[#fff8f0] border-t border-[#ffe8d0]">
              <div className="text-xs text-primary font-medium mb-2">
                ⚠️ 白米饭 高GI，建议低GI替换：
              </div>
              <div className="flex gap-2">
                {REPLACEMENTS.map((r) => (
                  <button
                    key={r.name}
                    className={`px-3 py-1 rounded-2xl border-[1.5px] text-xs cursor-pointer ${
                      r.highlight
                        ? 'border-teal text-teal bg-[#f0faf5]'
                        : 'border-border-dark text-text-muted bg-white'
                    }`}
                  >
                    {r.name} (GI{r.gi})
                  </button>
                ))}
              </div>
            </div>

            {/* Total Section */}
            <div className="px-3.5 py-3 border-t border-border">
              <div className="flex justify-between items-center mb-2.5">
                <span className="text-[13px] text-text-secondary font-medium">本餐合计</span>
                <span className="text-lg font-bold text-text-primary">{TOTAL_CALORIES} kcal</span>
              </div>

              {/* Macro Labels */}
              <div className="flex justify-between text-[11px] mb-1.5">
                <span style={{ color: MACROS.carb.color }}>
                  碳水 {MACROS.carb.percent}% ({MACROS.carb.grams}g)
                </span>
                <span style={{ color: MACROS.fat.color }}>
                  脂肪 {MACROS.fat.percent}%
                </span>
                <span style={{ color: MACROS.protein.color }}>
                  蛋白质 {MACROS.protein.percent}%
                </span>
              </div>

              {/* Macro Bar */}
              <div className="h-2 rounded-full overflow-hidden flex bg-border">
                <div style={{ width: `${MACROS.carb.percent}%`, backgroundColor: MACROS.carb.color }} />
                <div style={{ width: `${MACROS.fat.percent}%`, backgroundColor: MACROS.fat.color }} />
                <div style={{ width: `${MACROS.protein.percent}%`, backgroundColor: MACROS.protein.color }} />
              </div>

              {/* Carb Warning */}
              <div className="mt-2.5 bg-[#fff3eb] rounded-md px-2.5 py-1.5 text-[11px] text-primary">
                ⚠️ 本餐碳水 71g，超出餐次上限 45g，建议减少白米饭用量
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="px-4 pb-5 flex gap-2.5">
          <button className="flex-1 h-[46px] rounded-[12px] bg-[#f0faf5] border-[1.5px] border-teal text-teal text-sm font-medium">
            查看饮食建议
          </button>
          <button className="flex-1 h-[46px] rounded-[12px] bg-teal text-white text-sm font-semibold">
            保存到饮食日志
          </button>
        </div>
      </div>
    </div>
  )
}
