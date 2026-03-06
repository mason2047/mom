'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import NavBar from '@/components/layout/NavBar'
import Accordion from '@/components/ui/Accordion'
import WeekChipSelector from '@/components/business/WeekChipSelector'
import { calculateGestationalInfo, getFruitComparison } from '@/lib/utils'

/**
 * 孕期知识详情页
 * 宝宝发育 + 妈妈健康 双Tab，折叠面板展示详情
 */

type TabType = 'baby' | 'mom'

const MOCK_LMP = '2025-11-25'

const BABY_SECTIONS = [
  {
    title: '&#128118; 外观发育',
    content:
      '胎儿身长约8-10cm，体重约43g。面部五官越来越清晰，眼睛继续向面部中央靠拢。手指和脚趾已经完全分开，指甲开始生长。全身开始长出细细的胎毛（胎毳毛），主要用于保温和保护皮肤。',
  },
  {
    title: '&#129504; 器官发育',
    content:
      '甲状腺开始分泌激素，对大脑发育至关重要。肝脏开始产生胆汁，脾脏开始参与红细胞的产生。肾脏已经可以产生尿液，胎儿会将尿液排入羊水中。骨骼开始逐渐硬化（骨化），从软骨变为骨骼。',
  },
  {
    title: '&#127939; 运动能力',
    content:
      '胎儿已经可以做出各种表情：皱眉、微笑、撅嘴。会伸懒腰、打哈欠、甚至做出吸吮的动作。活动越来越频繁，但妈妈一般要到16-20周才能感受到胎动（经产妇可能更早）。',
  },
]

const MOM_SECTIONS = [
  {
    title: '&#129328; 身体变化',
    content:
      '进入孕中期第一周！恶心呕吐等早孕反应正在逐渐减轻。子宫已经上升到耻骨联合上方，腹部开始微微隆起。乳房可能开始分泌初乳（淡黄色液体），这是正常现象。部分孕妈会出现鼻塞、流鼻血的情况，这与孕期血流量增加有关。',
  },
  {
    title: '&#129367; 营养建议',
    content:
      '本周开始每日额外增加300大卡热量摄入。重点补充：铁（动物肝脏、菠菜、红肉）防贫血、钙（牛奶、酸奶、豆制品）每日1000mg、DHA（深海鱼、核桃）促进胎儿大脑发育。蛋白质摄入建议增加15g/天（约等于2个鸡蛋或150g瘦肉）。',
  },
  {
    title: '&#9888;&#65039; 注意事项',
    content:
      '本周最重要：预约中期唐筛（窗口期14-20周）。如有条件建议做无创DNA替代或补充唐筛。开始进行适度运动：散步、孕妇瑜伽、游泳。避免提重物和剧烈运动。穿着宽松舒适的衣物，可以开始使用托腹带。注意防晒，孕期色素沉着容易加重。',
  },
  {
    title: '&#128218; 产检提醒',
    content:
      '孕14-20周：中期唐氏筛查（必做）。建议尽快预约，不要错过窗口期。如果唐筛高风险，可进一步做无创DNA或羊水穿刺。血常规、尿常规等常规检查。',
  },
]

const AVAILABLE_WEEKS = [12, 13, 14, 15, 16]

export default function KnowledgePage() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState<TabType>('baby')
  const [selectedWeek, setSelectedWeek] = useState(14)
  const gestationalInfo = calculateGestationalInfo(MOCK_LMP)
  const fruit = getFruitComparison(selectedWeek)

  return (
    <div className="flex flex-col min-h-screen bg-bg">
      <NavBar title="孕期知识" onBack={() => router.back()} />

      <div className="flex-1 overflow-y-auto hide-scrollbar">
        {/* Week Chip Selector */}
        <WeekChipSelector
          weeks={AVAILABLE_WEEKS}
          currentWeek={selectedWeek}
          onSelect={setSelectedWeek}
        />

        {/* Week Header */}
        <div className="bg-gradient-to-br from-[#fdf0e0] to-[#fce8cc] px-5 py-5 text-center">
          <div className="text-4xl mb-2">{fruit.emoji}</div>
          <h2 className="text-xl font-bold text-[#3d1f00] mb-1">
            孕{selectedWeek}周 · 宝宝像{fruit.name}
          </h2>
          <p className="text-xs text-[#8a5a30]">
            身长约{fruit.lengthCm}cm · 体重约{fruit.weightG}g
          </p>
        </div>

        {/* Tab Switch */}
        <div className="flex bg-white border-b border-border">
          <button
            onClick={() => setActiveTab('baby')}
            className={`flex-1 py-3 text-sm font-medium text-center border-b-2 transition-colors ${
              activeTab === 'baby'
                ? 'text-primary border-primary'
                : 'text-text-muted border-transparent'
            }`}
          >
            &#128118; 宝宝发育
          </button>
          <button
            onClick={() => setActiveTab('mom')}
            className={`flex-1 py-3 text-sm font-medium text-center border-b-2 transition-colors ${
              activeTab === 'mom'
                ? 'text-rose border-rose'
                : 'text-text-muted border-transparent'
            }`}
          >
            &#129328; 妈妈健康
          </button>
        </div>

        {/* Content */}
        <div className="p-4">
          {(activeTab === 'baby' ? BABY_SECTIONS : MOM_SECTIONS).map((section, i) => (
            <Accordion
              key={section.title}
              title={section.title}
              defaultOpen={i === 0}
            >
              <p className="text-xs text-text-secondary leading-relaxed whitespace-pre-line">
                {section.content}
              </p>
            </Accordion>
          ))}
        </div>

        {/* Tip Card */}
        <div className="mx-4 mb-5 bg-[#fff8f3] border-l-[3px] border-primary rounded-r-[12px] px-3.5 py-3">
          <div className="text-xs text-[#a06030] leading-relaxed">
            <strong>&#128161; 温馨提示：</strong>以上内容仅供参考，具体情况请结合产检结果和医生建议。每个宝宝发育进度略有不同，轻微差异属于正常现象。
          </div>
        </div>
      </div>
    </div>
  )
}
