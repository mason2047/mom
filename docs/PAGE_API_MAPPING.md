# MOM孕期助手 - 页面与API映射文档

本文档说明每个前端页面需要调用的后端 API、数据流向和交互时序。

---

## 1. 引导首屏 (`/`)

| 交互 | API | 说明 |
|------|-----|------|
| 页面加载 | 无 | 纯静态页面 |
| 点击"微信一键登录" | `POST /auth/wechat-login` | 调用微信SDK获取code后请求 |

**数据流:**
```
用户点击登录 → 调起微信授权 → 获取 code → POST /auth/wechat-login
  → 返回 token + user
  → if user.has_profile → 跳转 /home
  → else → 跳转 /onboarding
```

---

## 2. 建档引导页 (`/onboarding`)

| 交互 | API | 说明 |
|------|-----|------|
| 输入LMP → 自动计算EDD | 前端计算 | `calculateEDD(lmpDate)` |
| 输入体重+身高 → BMI | 前端计算 | `calculateBMI()` |
| 点击"完成建档" | `POST /profile` | 提交所有表单数据 |

**提交数据:**
```json
{
  "lmp_date", "edd_date", "pre_pregnancy_weight",
  "height", "parity_type", "fetus_type",
  "risk_factors", "hospital"
}
```

**后端副作用:**
- 自动创建11次产检计划
- 自动创建产检提醒
- 奖励幸孕币 +100 (建档奖励)
- 解锁成就 "初来乍到"
- 创建默认饮食目标

---

## 3. 首页 Tab (`/home`)

| 交互 | API | 说明 |
|------|-----|------|
| 页面加载 | `GET /profile` | 获取孕期档案（计算孕周等信息） |
| 页面加载 | `GET /knowledge/baby-development?week=14` | 获取宝宝发育信息 |
| 页面加载 | `GET /knowledge/mom-health?week=14` | 获取妈妈健康信息 |
| 页面加载 | `GET /checkup/plans?status=pending` | 获取下次产检信息 |
| 页面加载 | `GET /health/weight?page=1&page_size=1` | 最近体重 |
| 页面加载 | `GET /health/blood-pressure?page=1&page_size=1` | 最近血压 |
| 页面加载 | `GET /health/blood-sugar?page=1&page_size=1` | 最近血糖 |
| 点击"记录产检" | 跳转 `/checkup/record` | |
| 点击"查看全部产检" | 跳转 `/checkup` | |
| 点击"查看趋势" | 跳转 `/health` | |
| 点击健康快捷卡片 | 跳转 `/health/weight` 等 | |
| 点击妈妈健康卡片 | 跳转 `/home/knowledge` | |
| 点击Banner"查看孕期知识" | 跳转 `/home/knowledge` | Banner按钮Link |

**优化建议:** 首页聚合接口
```
GET /home/dashboard
```
返回所有首页需要的数据，减少请求次数。

---

## 4. 孕期知识页 (`/home/knowledge`)

包含"妈妈健康"（P02）和"宝宝发育"（P03）双 Tab，默认显示妈妈健康。

| 交互 | API | 说明 |
|------|-----|------|
| 页面加载 | `GET /knowledge/baby-development?week=14` | 宝宝发育详情 |
| 页面加载 | `GET /knowledge/mom-health?week=14` | 妈妈健康详情 |
| 切换孕周 Chip | `GET /knowledge/*?week=N` | 重新加载对应周数据 |
| 切换 Tab | 前端切换 | 妈妈健康 ↔ 宝宝发育 |
| 点击待办清单跳转 | 跳转对应路由 | 产检日历/记录体重/记录血压 |
| 点击 AI 浮动按钮 | 跳转 `/assistant` | 右下角固定按钮 |
| 阅读完成(停留>30s) | `POST /user/daily-tasks/knowledge/complete` | 完成每日阅读任务 |

**入口路径:**
- 首页 Banner "查看孕期知识 ›" → `/home/knowledge`
- 首页妈妈健康卡片 → `/home/knowledge`
- 妈妈变化弹窗 "了解更多" → `/home/knowledge`

---

## 5. MOM助手 Tab (`/assistant`)

| 交互 | API | 说明 |
|------|-----|------|
| 页面加载 | `GET /profile` | 获取孕周信息显示在信息卡片 |
| 页面加载 | `GET /assistant/messages?page=1&page_size=50` | 获取历史消息 |
| 发送消息 | `POST /assistant/messages` (SSE) | 流式返回AI回复 |
| 点击快捷功能 | 跳转对应路由 | 产检记录/AI诊报/饮食助手 |
| 点击消息中的链接 | 跳转对应路由 | |

**SSE消息类型:**
- `message_start`: 消息开始
- `content_delta`: 内容增量
- `message_end`: 消息结束 + metadata

---

## 6. AI报告上传 (`/assistant/report-upload`)

| 交互 | API | 说明 |
|------|-----|------|
| 选择/拍照报告图片 | `POST /upload` (type=report) | 上传图片获取 image_id |
| 点击"开始AI解读" | `POST /report/analyze` | 提交 image_ids + report_type |
| 解读完成 | 跳转 `/assistant/report-result/:id` | |

---

## 7. AI报告结果 (`/assistant/report-result/[id]`)

| 交互 | API | 说明 |
|------|-----|------|
| 页面加载 | `GET /report/:id` | 获取解读结果 |
| 点击"继续提问" | 跳转 `/assistant` | |
| 点击"查看产检计划" | 跳转 `/checkup` | |
| 点击"分享" | 前端分享功能 | 需要匿名化处理 |

---

## 8. 产检日历 (`/checkup`)

| 交互 | API | 说明 |
|------|-----|------|
| 页面加载 | `GET /checkup/plans?status=all` | 获取全部产检计划 |
| 切换月份 | 前端计算 | 日历组件本地渲染 |
| 选择某天 | 前端过滤 | 筛选当天相关的产检 |
| 点击"查看详情" | 跳转 `/checkup/:id` | |
| 点击"记录产检" | 跳转 `/checkup/record` | |
| 产检提醒开关 | `PUT /checkup/plans/:id` | 更新提醒设置 |

---

## 9. 产检详情 (`/checkup/[id]`)

| 交互 | API | 说明 |
|------|-----|------|
| 页面加载 | `GET /checkup/plans/:id` | 获取产检计划详情 |
| 修改提醒开关 | `PUT /checkup/plans/:id` | 更新 reminders |
| 修改时间 | `PUT /checkup/plans/:id` | 更新 scheduled_date |
| 点击"记录产检结果" | 跳转 `/checkup/record?plan_id=:id` | |

---

## 10. 产检记录 (`/checkup/record`)

| 交互 | API | 说明 |
|------|-----|------|
| 上传报告图片 | `POST /upload` (type=report) | 获取 image_id |
| 点击"保存" | `POST /checkup/records` | 提交记录数据 |

**提交数据:**
```json
{
  "plan_id", "actual_date", "hospital",
  "result", "completed_items",
  "report_image_ids", "doctor_notes"
}
```

---

## 11. 健康综合看板 (`/health`)

| 交互 | API | 说明 |
|------|-----|------|
| 页面加载 | `GET /health/weight?page=1&page_size=1` | 最新体重 |
| 页面加载 | `GET /health/blood-pressure?page=1&page_size=1` | 最新血压 |
| 页面加载 | `GET /health/blood-sugar?page=1&page_size=1` | 最新血糖 |
| 页面加载 | `GET /health/weight/trend?range=2weeks` | 体重趋势图数据 |
| 点击快速记录 | 跳转对应子页面 | |
| 切换图表时间范围 | `GET /health/weight/trend?range=xxx` | |

**优化建议:** 聚合接口
```
GET /health/dashboard
```

---

## 12. 体重管理 (`/health/weight`)

| 交互 | API | 说明 |
|------|-----|------|
| 页面加载 | `GET /profile` | 获取孕前体重、BMI |
| 页面加载 | `GET /health/weight?page=1&page_size=20` | 记录列表 |
| 页面加载 | `GET /health/weight/trend?range=1month` | 趋势图 |
| 切换趋势图范围 | `GET /health/weight/trend?range=xxx` | |
| 保存体重记录 | `POST /health/weight` | |

---

## 13. 血压记录 (`/health/blood-pressure`)

| 交互 | API | 说明 |
|------|-----|------|
| 页面加载 | `GET /health/blood-pressure?page=1&page_size=20` | 记录列表 |
| 页面加载 | `GET /health/blood-pressure/trend?range=1week` | 趋势图 |
| 保存血压记录 | `POST /health/blood-pressure` | |

---

## 14. 血糖记录 (`/health/blood-sugar`)

| 交互 | API | 说明 |
|------|-----|------|
| 页面加载 | `GET /health/blood-sugar?meal_type=fasting&page=1&page_size=20` | |
| 切换空腹/餐后Tab | `GET /health/blood-sugar?meal_type=xxx` | |
| 保存血糖记录 | `POST /health/blood-sugar` | |

---

## 15. 胎动计数 (`/health/fetal-movement`)

| 交互 | API | 说明 |
|------|-----|------|
| 页面加载 | `GET /health/fetal-movement/sessions?page=1&page_size=10` | 历史 |
| 开始计数 | `POST /health/fetal-movement/sessions` | 创建会话 |
| 每次胎动点击 | `POST /health/fetal-movement/sessions/:id/kicks` | 记录一次 |
| 结束计数 | `PUT /health/fetal-movement/sessions/:id/end` | |

---

## 16. 饮食助手 (`/diet`)

| 交互 | API | 说明 |
|------|-----|------|
| 页面加载 | `GET /diet/goal` | 获取饮食目标 |
| 页面加载 | `GET /diet/summary?date=today` | 今日摘要 |
| 发送食物描述 | `POST /diet/recognize` | AI识别食物 |
| 拍照识别 | `POST /diet/recognize` (FormData with file) | |
| 确认记录 | `POST /diet/records` | 保存到记录 |
| AI对话提问 | `POST /diet/chat` | |

---

## 17. 饮食目标设置 (`/diet/goal`)

| 交互 | API | 说明 |
|------|-----|------|
| 页面加载 | `GET /diet/goal` | 获取当前目标 |
| 保存设置 | `PUT /diet/goal` | |

---

## 18. 月子规划列表 (`/maternity`)

| 交互 | API | 说明 |
|------|-----|------|
| 页面加载 (月子中心) | `GET /maternity/centers?city=xx&sort=rating` | |
| 页面加载 (月嫂) | `GET /maternity/nannies?city=xx&sort=rating` | |
| 切换Tab | 重新请求对应列表 | |
| 切换筛选条件 | 带新参数重新请求 | |
| 点击卡片 | 跳转详情页 | |

---

## 19. 月子中心详情 (`/maternity/center/[id]`)

| 交互 | API | 说明 |
|------|-----|------|
| 页面加载 | `GET /maternity/centers/:id` | 含套餐、设施 |
| 页面加载 | `GET /maternity/reviews?target_type=center&target_id=:id` | 评价 |
| 点击"立即预约" | 跳转 `/maternity/booking?type=center&id=:id` | |

---

## 20. 月嫂详情 (`/maternity/nanny/[id]`)

| 交互 | API | 说明 |
|------|-----|------|
| 页面加载 | `GET /maternity/nannies/:id` | 含资质、排期 |
| 页面加载 | `GET /maternity/reviews?target_type=nanny&target_id=:id` | 评价 |
| 点击"立即预约" | 跳转 `/maternity/booking?type=nanny&id=:id` | |

---

## 21. 预约表单 (`/maternity/booking`)

| 交互 | API | 说明 |
|------|-----|------|
| 点击"确认预约" | `POST /maternity/bookings` | |

---

## 22. 我的 Tab (`/profile`)

| 交互 | API | 说明 |
|------|-----|------|
| 页面加载 | `GET /auth/me` | 用户信息 |
| 页面加载 | `GET /profile` | 孕期信息 |
| 页面加载 | `GET /user/coins` | 幸孕币余额（会员权益区显示） |
| 点击"我的积分" | 跳转 `/profile/coins` | P20 幸孕币页 |
| 点击"邀请有礼" | 跳转 `/profile/invite` | P-Share 邀请有礼页 |
| 点击菜单项 | 跳转对应路由 | 孕期工具/生活服务/账户设置 |

---

## 23. 个人信息编辑 (`/profile/edit`)

| 交互 | API | 说明 |
|------|-----|------|
| 页面加载 | `GET /auth/me` + `GET /profile` | |
| 修改头像 | `POST /upload` (type=avatar) + `PUT /user` | |
| 保存 | `PUT /user` + `PUT /profile` | |

---

## 24. 设置 (`/profile/settings`)

| 交互 | API | 说明 |
|------|-----|------|
| 页面加载 | `GET /user/settings` | |
| 修改任意开关 | `PUT /user/settings` | |
| 退出登录 | `POST /auth/logout` | 清除本地 token |

---

## 25. 幸孕币 (`/profile/coins`) — P20

| 交互 | API | 说明 |
|------|-----|------|
| 页面加载 | `GET /user/coins` | 余额（总获得/总消耗/到期提醒） |
| 页面加载 | `GET /coins/daily-progress` | 今日可赚进度 |
| 页面加载 | `GET /user/streak` | 连续打卡（天数+里程碑） |
| 页面加载 | `GET /user/daily-tasks?date=today` | 每日任务列表 |
| 页面加载 | `GET /user/achievements?limit=5` | 成就横向预览（前5条） |
| 页面加载 | `GET /coins/transactions?page=1&page_size=5` | 积分明细（最近5条） |
| 点击"去记录" | 跳转到对应功能页 | 体重/血压/胎动/饮食/知识 |
| 点击成就"全部 ›" | 跳转 `/profile/achievements` | P22-C 成就中心 |
| 点击邀请有礼横幅 | 跳转 `/profile/invite` | P-Share 邀请有礼 |
| 点击"去兑换" | 跳转兑换商城 | |

---

## 26. 胎儿估重 (`/health/fetal-weight`)

| 交互 | API | 说明 |
|------|-----|------|
| 页面加载 | `GET /profile` | 获取当前孕周 |
| 页面加载 | `GET /health/fetal-weight/history?range=all` | 获取历史估重和生长曲线 |
| 手动输入B超数据 | `POST /health/fetal-weight` | 录入 BPD/HC/AC/FL |
| OCR自动提取 | `POST /upload` (type=report) + `POST /health/fetal-weight` (source=ocr) | 上传B超图片后OCR提取 |

**数据流:**
```
用户进入页面 → 加载生长曲线图
  → 选择输入方式: 手动输入 / 拍照识别
  → 手动: 输入 BPD/HC/AC/FL → POST /health/fetal-weight
  → 拍照: POST /upload → OCR提取 → 用户确认 → POST /health/fetal-weight
  → 返回估重结果 + 百分位 + 生长曲线更新
```

---

## 27. 饮食助手-含问卷流程 (`/diet`)

| 交互 | API | 说明 |
|------|-----|------|
| 页面加载 | `GET /diet/profile` | 检查是否完成问卷 |
| 首次使用-显示问卷 | 无(前端渲染) | 多步骤问卷表单 |
| 提交问卷 | `POST /diet/questionnaire` | 保存问卷并获取推荐模式 |
| 问卷完成后 | `GET /diet/goal` | 获取饮食目标 |
| 问卷完成后 | `GET /diet/summary?date=today` | 今日摘要 |
| 获取食物替代 | `GET /diet/food/{id}/alternatives` | 替代食物推荐 |
| 餐次分配设置 | `PUT /diet/goal/meal-distribution` | 更新餐次配比 |

**数据流（首次使用）:**
```
用户进入 /diet → GET /diet/profile
  → if questionnaire_completed == false:
      展示问卷弹窗/页面（多步骤）
      → 用户填写完成 → POST /diet/questionnaire
      → 返回推荐模式和热量
      → 自动设置饮食目标
  → 加载饮食主页
```

---

## 28. 食物识别结果 (`/diet/result`)

| 交互 | API | 说明 |
|------|-----|------|
| 页面加载 | 接收上一页传入的识别结果 | 来自 POST /diet/recognize 的返回 |
| 修改食物份量 | 前端计算 | 实时重算热量和营养素 |
| 查看替代食物 | `GET /diet/food/{id}/alternatives` | 点击某食物的"换一换" |
| 选择替代食物 | 前端替换 | 更新食物列表和总热量 |
| 确认记录 | `POST /diet/records` | 保存饮食记录 |

---

## 29. 预约成功页 (`/maternity/booking/success`)

| 交互 | API | 说明 |
|------|-----|------|
| 页面加载 | `GET /maternity/booking/{id}` | 获取预约详情（含服务信息） |
| 点击"查看预约详情" | 跳转 `/maternity/booking/{id}` | |
| 点击"返回首页" | 跳转 `/home` | |

**数据流:**
```
预约支付成功 → 跳转 /maternity/booking/success?id={booking_id}
  → GET /maternity/booking/{id}
  → 展示: 预约成功状态 + 服务信息 + 入住日期 + 费用明细 + 幸孕币奖励
```

---

## 30. 邀请有礼 (`/profile/invite`)

| 交互 | API | 说明 |
|------|-----|------|
| 页面加载 | `GET /invite/stats` | 邀请统计数据 |
| 页面加载 | `GET /invite/records?page=1&page_size=20` | 邀请记录列表 |
| 生成/获取邀请码 | `POST /invite/generate-code` | 首次生成或获取已有邀请码 |
| 点击"分享给好友" | 前端分享 | 调用微信分享SDK |
| 点击"复制邀请码" | 前端复制 | 复制到剪贴板 |
| 滚动加载更多 | `GET /invite/records?page=N` | 分页加载 |

---

## 31. 成就中心 (`/profile/achievements`)

| 交互 | API | 说明 |
|------|-----|------|
| 页面加载 | `GET /achievements` | 获取全部成就列表(含进度) |
| 点击成就卡片 | `GET /achievements/{id}` | 查看成就详情和进度 |
| 点击"去完成" | 跳转对应功能页 | 根据成就类型跳转 |

**跳转映射:**
```
first_signup  → /onboarding
health_7days  → /health/weight
knowledge_10  → /home/knowledge
streak_30     → /home (打卡)
checkup_all   → /checkup
diet_14days   → /diet
report_5      → /assistant/report-upload
kick_7days    → /health/fetal-movement
```

---

## 32. 积分明细（完整版） — 已合并至第25条

> 注: 幸孕币页面的 API 映射已统一在第 25 条（`/profile/coins` P20）中描述，此处不再重复。

---

## API 调用频率预估

| 页面 | 页面级API调用数 | 用户操作API | 预估QPS |
|------|----------------|-------------|---------|
| 首页 | 7 (建议聚合为1) | 0 | 高 |
| 助手 | 2 | 1/消息 | 中 |
| 产检日历 | 1 | 0~2 | 低 |
| 健康看板 | 4 (建议聚合为1) | 0 | 中 |
| 胎儿估重 | 2 | 1/录入 | 低 |
| 饮食助手 | 2~3 | 1~3/餐 | 中 |
| 食物识别结果 | 0 (继承上页数据) | 1~2 | 中 |
| 月子规划 | 1~2 | 0 | 低 |
| 预约成功 | 1 | 0 | 低 |
| 我的 | 3 | 0 | 中 |
| 积分明细 | 5 | 0~1 | 中 |
| 邀请有礼 | 2~3 | 0~1 | 低 |
| 成就中心 | 1 | 0~1 | 低 |

**性能建议:**
1. 首页和健康看板应提供聚合 API (`/home/dashboard`, `/health/dashboard`)
2. 产检计划等低频变更数据应缓存（Redis, 60s TTL）
3. AI对话使用 SSE 流式传输
4. 图片上传使用预签名 URL 直传 S3
