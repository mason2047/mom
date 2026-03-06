# MOM孕期助手 - 后端 API 规范

## 基础约定

### Base URL
```
https://api.mom-app.com/v1
```

### 认证方式
- Bearer Token (JWT)
- Header: `Authorization: Bearer <access_token>`
- Access Token 有效期: 2小时
- Refresh Token 有效期: 30天

### 通用响应格式
```json
{
  "code": 0,
  "message": "success",
  "data": {}
}
```

### 错误码规范
| 错误码 | 含义 |
|--------|------|
| 0 | 成功 |
| 1001 | 参数校验失败 |
| 1002 | 未授权（Token无效/过期） |
| 1003 | 权限不足 |
| 1004 | 资源不存在 |
| 1005 | 重复操作 |
| 2001 | 服务器内部错误 |
| 2002 | 第三方服务异常 |
| 3001 | 微信登录失败 |
| 3002 | OCR识别失败 |
| 3003 | AI服务异常 |

### 分页参数
```
GET /resource?page=1&page_size=20
```
分页响应:
```json
{
  "code": 0,
  "data": {
    "list": [],
    "total": 100,
    "page": 1,
    "page_size": 20,
    "has_more": true
  }
}
```

---

## 1. 认证模块 (Auth)

### 1.1 微信登录
```
POST /auth/wechat-login
```
**Request Body:**
```json
{
  "code": "wx_auth_code_from_client",
  "encrypted_data": "...",
  "iv": "..."
}
```
**Response:**
```json
{
  "code": 0,
  "data": {
    "access_token": "eyJhbGci...",
    "refresh_token": "dGhpcyBpcyB...",
    "expires_in": 7200,
    "user": {
      "id": "usr_001",
      "nickname": "小明妈妈",
      "avatar_url": "https://...",
      "has_profile": true
    }
  }
}
```
**逻辑:**
1. 使用 code 换取微信 session_key + openid
2. 解密 encrypted_data 获取用户信息
3. 查找或创建用户记录
4. 生成 JWT access_token + refresh_token
5. 返回用户信息和 has_profile 标识（决定跳转建档页还是首页）

### 1.2 刷新 Token
```
POST /auth/refresh-token
```
**Request Body:**
```json
{
  "refresh_token": "dGhpcyBpcyB..."
}
```
**Response:** 同 1.1（返回新的 token pair）

### 1.3 获取当前用户
```
GET /auth/me
```
**Response:**
```json
{
  "code": 0,
  "data": {
    "id": "usr_001",
    "nickname": "小明妈妈",
    "avatar_url": "https://...",
    "mom_id": "MOM20260301",
    "created_at": "2026-03-01T10:00:00Z"
  }
}
```

### 1.4 退出登录
```
POST /auth/logout
```

---

## 2. 孕期档案模块 (Profile)

### 2.1 创建档案（建档）
```
POST /profile
```
**Request Body:**
```json
{
  "lmp_date": "2025-11-25",
  "edd_date": "2026-09-01",
  "pre_pregnancy_weight": 55.0,
  "height": 165,
  "parity_type": "primipara",
  "fetus_type": "singleton",
  "risk_factors": ["gestational_diabetes"],
  "hospital": "北京妇产医院"
}
```
**字段说明:**
- `lmp_date`: 末次月经日期, ISO 8601 格式, 必填
- `edd_date`: 预产期, 由前端计算后传入, 可选（后端也会校验计算）
- `pre_pregnancy_weight`: 孕前体重(kg), 必填, 范围 30-200
- `height`: 身高(cm), 必填, 范围 100-250
- `parity_type`: enum `primipara` | `multipara`
- `fetus_type`: enum `singleton` | `twins`
- `risk_factors`: string[] 可选值: `hypertension_history`, `gestational_diabetes`, `advanced_age`, `none`
- `hospital`: 就诊医院, 可选

**Response:**
```json
{
  "code": 0,
  "data": {
    "id": "prf_001",
    "lmp_date": "2025-11-25",
    "edd_date": "2026-09-01",
    "current_week": 14,
    "current_day": 3,
    "trimester": "second",
    "bmi": 20.2,
    "bmi_category": "normal",
    "recommended_weight_gain": {
      "min": 11.5,
      "max": 16.0,
      "standard": "IOM 2009"
    }
  }
}
```

**后端逻辑:**
1. 校验 lmp_date 合理性（不超过当前日期 + 不早于42周前）
2. 计算 EDD（Naegele 公式: LMP + 280天）
3. 计算 BMI 并分类
4. 根据 BMI 类别计算推荐增重范围
5. 创建初始产检计划（参考 BUSINESS_RULES.md 的标准产检时间表）
6. 奖励幸孕币（首次建档 +100）

### 2.2 获取档案
```
GET /profile
```

### 2.3 更新档案
```
PUT /profile
```
**Request Body:** 同 2.1，所有字段可选（部分更新）

---

## 3. 孕期知识模块 (Knowledge)

### 3.1 获取宝宝发育信息
```
GET /knowledge/baby-development?week=14
```
**Response:**
```json
{
  "code": 0,
  "data": {
    "week": 14,
    "fruit_comparison": {
      "name": "山竹",
      "emoji": "...",
      "length_cm": 8.7,
      "weight_g": 43
    },
    "sections": [
      {
        "title": "外观发育",
        "icon": "baby",
        "content": "胎儿身长约8-10cm..."
      }
    ]
  }
}
```

### 3.2 获取妈妈健康信息
```
GET /knowledge/mom-health?week=14
```
**Response:** 类似结构，包含身体变化、营养建议、注意事项、产检提醒

---

## 4. 产检模块 (Checkup)

### 4.1 获取产检计划列表
```
GET /checkup/plans?status=all
```
**Query Params:**
- `status`: `all` | `done` | `pending` | `overdue`

**Response:**
```json
{
  "code": 0,
  "data": {
    "total_plans": 11,
    "completed": 3,
    "plans": [
      {
        "id": "chk_001",
        "order": 1,
        "name": "第1次产检",
        "title": "NT检查 + 建档",
        "week_start": 11,
        "week_end": 13,
        "week_end_day": 6,
        "scheduled_date": "2026-02-15",
        "actual_date": "2026-02-15",
        "status": "done",
        "items": [
          {
            "name": "NT超声",
            "description": "测量胎儿颈后透明层厚度",
            "required": true
          }
        ],
        "checkup_record_id": "rec_001"
      },
      {
        "id": "chk_003",
        "order": 3,
        "name": "第3次产检",
        "title": "大排畸超声检查",
        "week_start": 20,
        "week_end": 24,
        "scheduled_date": "2026-03-26",
        "actual_date": null,
        "status": "pending",
        "items": [...],
        "reminders": [
          {
            "type": "3_days_before",
            "enabled": true,
            "datetime": "2026-03-23T09:00:00Z"
          }
        ]
      }
    ]
  }
}
```

### 4.2 获取单个产检计划详情
```
GET /checkup/plans/:id
```
**Response:** 包含检查项目详情、注意事项、携带清单、提醒设置

### 4.3 更新产检计划
```
PUT /checkup/plans/:id
```
**Request Body:**
```json
{
  "scheduled_date": "2026-03-28",
  "reminders": [
    { "type": "3_days_before", "enabled": true },
    { "type": "1_day_before", "enabled": true },
    { "type": "morning_of", "enabled": false }
  ]
}
```

### 4.4 创建产检记录
```
POST /checkup/records
```
**Request Body:**
```json
{
  "plan_id": "chk_003",
  "actual_date": "2026-03-26",
  "hospital": "北京妇产医院",
  "result": "normal",
  "completed_items": ["大排畸超声", "血常规", "尿常规"],
  "report_image_ids": ["img_001", "img_002"],
  "doctor_notes": "宝宝发育正常..."
}
```
**字段说明:**
- `result`: enum `normal` | `abnormal` | `need_recheck`
- `completed_items`: 已完成的检查项目名称数组
- `report_image_ids`: 已上传的报告图片 ID

**后端逻辑:**
1. 更新对应 plan 的 status 为 done
2. 保存产检记录
3. 如果有报告图片，关联到记录
4. 奖励幸孕币（完成产检记录 +20）
5. 检查成就条件（如"产检全通"）

### 4.5 获取产检记录列表
```
GET /checkup/records?page=1&page_size=20
```

---

## 5. 健康记录模块 (Health)

### 5.1 体重记录

#### 添加体重记录
```
POST /health/weight
```
**Request Body:**
```json
{
  "weight": 58.4,
  "measured_at": "2026-03-15T07:30:00Z",
  "note": "早晨空腹"
}
```
**后端逻辑:**
1. 保存记录
2. 计算与上次记录的增量
3. 计算孕期总增重（当前 - 孕前体重）
4. 根据当前孕周和BMI类别评估是否在推荐范围（参考 BUSINESS_RULES.md）
5. 返回评估结果
6. 奖励幸孕币（每日首次记录 +10）

**Response:**
```json
{
  "code": 0,
  "data": {
    "id": "wt_001",
    "weight": 58.4,
    "delta": 0.6,
    "total_gain": 3.4,
    "evaluation": "normal",
    "recommended_range": { "min": 2.0, "max": 5.0 },
    "message": "当前增重在正常范围内"
  }
}
```

#### 获取体重趋势
```
GET /health/weight/trend?range=2weeks
```
**Query Params:**
- `range`: `2weeks` | `1month` | `trimester_1` | `trimester_2` | `trimester_3` | `all`

**Response:**
```json
{
  "code": 0,
  "data": {
    "pre_pregnancy_weight": 55.0,
    "current_weight": 58.4,
    "total_gain": 3.4,
    "bmi_category": "normal",
    "recommended_total_gain": { "min": 11.5, "max": 16.0 },
    "evaluation": "normal",
    "records": [
      { "date": "2026-03-01", "weight": 56.8, "week": 12 },
      { "date": "2026-03-05", "weight": 57.1, "week": 13 }
    ],
    "recommended_curve": [
      { "week": 12, "min": 56.0, "max": 58.0 },
      { "week": 13, "min": 56.5, "max": 58.5 }
    ]
  }
}
```

#### 获取体重记录列表
```
GET /health/weight?page=1&page_size=20
```

### 5.2 血压记录

#### 添加血压记录
```
POST /health/blood-pressure
```
**Request Body:**
```json
{
  "systolic": 128,
  "diastolic": 82,
  "measured_at": "2026-03-15T10:30:00Z",
  "position": "sitting",
  "note": "坐姿休息后测量"
}
```
**后端逻辑:**
1. 保存记录
2. 根据孕期血压标准评估（参考 BUSINESS_RULES.md）
3. 如果连续2次偏高，触发异常提醒
4. 奖励幸孕币

**Response:**
```json
{
  "code": 0,
  "data": {
    "id": "bp_001",
    "systolic": 128,
    "diastolic": 82,
    "evaluation": "elevated",
    "level": "attention",
    "message": "收缩压偏高，建议休息后复测。持续偏高请就医。",
    "alert": true
  }
}
```

#### 获取血压趋势
```
GET /health/blood-pressure/trend?range=1week
```

#### 获取血压记录列表
```
GET /health/blood-pressure?page=1&page_size=20
```

### 5.3 血糖记录

#### 添加血糖记录
```
POST /health/blood-sugar
```
**Request Body:**
```json
{
  "value": 4.8,
  "meal_type": "fasting",
  "measured_at": "2026-03-15T07:30:00Z"
}
```
**字段说明:**
- `meal_type`: enum `fasting` | `post_1h` | `post_2h`

**后端逻辑:**
1. 根据 meal_type 使用对应的 GDM 阈值评估
2. 空腹 < 5.1, 餐后1h < 10.0, 餐后2h < 8.5

**Response:**
```json
{
  "code": 0,
  "data": {
    "id": "bs_001",
    "value": 4.8,
    "meal_type": "fasting",
    "evaluation": "normal",
    "threshold": 5.1,
    "message": "空腹血糖在正常范围内"
  }
}
```

#### 获取血糖趋势
```
GET /health/blood-sugar/trend?meal_type=fasting&range=1week
```

#### 获取血糖记录列表
```
GET /health/blood-sugar?meal_type=fasting&page=1&page_size=20
```

### 5.4 胎动记录

#### 创建胎动计数会话
```
POST /health/fetal-movement/sessions
```
**Request Body:**
```json
{
  "start_time": "2026-03-15T20:00:00Z"
}
```

#### 记录一次胎动
```
POST /health/fetal-movement/sessions/:session_id/kicks
```
**Request Body:**
```json
{
  "kicked_at": "2026-03-15T20:05:30Z"
}
```

#### 结束胎动计数
```
PUT /health/fetal-movement/sessions/:session_id/end
```
**Request Body:**
```json
{
  "end_time": "2026-03-15T21:00:00Z"
}
```
**后端逻辑:**
1. 计算时间段内的胎动次数
2. 1小时内 >= 3次为正常
3. 2小时 < 10次需预警
4. 保存记录并评估

**Response:**
```json
{
  "code": 0,
  "data": {
    "session_id": "fm_001",
    "duration_minutes": 60,
    "total_kicks": 12,
    "evaluation": "normal",
    "message": "胎动正常"
  }
}
```

#### 获取胎动历史
```
GET /health/fetal-movement/sessions?page=1&page_size=20
```

---

## 6. AI 助手模块 (Assistant)

### 6.1 发送消息
```
POST /assistant/messages
```
**Request Body:**
```json
{
  "content": "中期唐筛和无创DNA有什么区别？",
  "type": "text",
  "context": {
    "current_week": 14,
    "current_day": 3,
    "trimester": "second"
  }
}
```
**Response (SSE - Server-Sent Events):**
```
event: message_start
data: {"id": "msg_003", "role": "assistant"}

event: content_delta
data: {"text": "这三个都是排查"}

event: content_delta
data: {"text": "胎儿染色体异常的检查..."}

event: message_end
data: {"metadata": {"links": [{"text": "查看产检日历", "route": "/checkup"}]}}
```

**后端逻辑:**
1. 获取用户孕期档案作为上下文
2. 构建 system prompt（包含当前孕周、风险因素、最近产检/健康数据）
3. 调用 LLM API 进行流式生成
4. 解析 AI 回复中的结构化数据（链接建议、报告卡片等）
5. 保存消息记录
6. 奖励幸孕币（每日首次提问 +5）

### 6.2 获取聊天历史
```
GET /assistant/messages?page=1&page_size=50
```

### 6.3 清空聊天记录
```
DELETE /assistant/messages
```

---

## 7. 报告解读模块 (Report)

### 7.1 上传报告图片
```
POST /report/images
Content-Type: multipart/form-data
```
**Form Fields:**
- `file`: 图片文件（JPG/PNG, 最大10MB）

**Response:**
```json
{
  "code": 0,
  "data": {
    "image_id": "img_001",
    "url": "https://cdn.mom-app.com/reports/img_001.jpg",
    "size": 1234567
  }
}
```

### 7.2 提交报告解读
```
POST /report/analyze
```
**Request Body:**
```json
{
  "image_ids": ["img_001"],
  "report_type": "blood_routine"
}
```
**字段说明:**
- `report_type`: enum `blood_routine` | `urine_routine` | `liver_function` | `glucose` | `thyroid` | `ultrasound` | `tang_screen` | `other`

**后端逻辑:**
1. 对图片进行 OCR 识别，提取指标名称、数值、单位、参考范围
2. 根据 report_type 匹配对应的指标解读规则
3. 结合孕周信息调整参考范围（孕期部分指标参考范围与非孕期不同）
4. 调用 AI 生成综合解读摘要
5. 保存解读结果
6. 奖励幸孕币（首次使用 +20）

**Response:**
```json
{
  "code": 0,
  "data": {
    "id": "rpt_001",
    "report_type": "blood_routine",
    "analyzed_at": "2026-03-07T10:00:00Z",
    "summary": {
      "total_items": 18,
      "normal_count": 16,
      "abnormal_count": 2,
      "ai_summary": "本次血常规整体正常..."
    },
    "indicators": [
      {
        "name": "血红蛋白（Hb）",
        "value": 105,
        "unit": "g/L",
        "reference_range": "110-150",
        "status": "low",
        "explanation": "略低于正常值..."
      }
    ]
  }
}
```

### 7.3 获取报告解读结果
```
GET /report/:id
```

### 7.4 获取报告历史
```
GET /report?page=1&page_size=20
```

---

## 8. 饮食模块 (Diet)

### 8.1 获取饮食目标
```
GET /diet/goal
```
**Response:**
```json
{
  "code": 0,
  "data": {
    "daily_calories": 1800,
    "carb_percent": 50,
    "fat_percent": 30,
    "protein_percent": 20,
    "diet_mode": "gdm_moderate",
    "carb_grams_per_day": 225
  }
}
```

### 8.2 更新饮食目标
```
PUT /diet/goal
```
**Request Body:**
```json
{
  "daily_calories": 1800,
  "carb_percent": 50,
  "diet_mode": "gdm_moderate"
}
```
**字段说明:**
- `diet_mode`: enum `balanced` | `gdm_moderate` | `gdm_strict`

### 8.3 食物识别
```
POST /diet/recognize
Content-Type: multipart/form-data
```
**Form Fields:**
- `file`: 食物图片
- `description`: 文字描述（可选，如 "米饭、西兰花炒肉"）

**后端逻辑:**
1. 图片识别 + 文字解析
2. 匹配食物数据库
3. 计算每种食物的热量、三大营养素、GI值
4. 生成 AI 饮食评估建议

**Response:**
```json
{
  "code": 0,
  "data": {
    "meal_type": "lunch",
    "foods": [
      {
        "name": "白米饭（1碗）",
        "calories": 210,
        "carbs": 46,
        "fat": 0.4,
        "protein": 4.3,
        "gi_level": "high",
        "gi_value": 83
      }
    ],
    "total_calories": 480,
    "macro_ratio": { "carbs": 58, "fat": 22, "protein": 20 },
    "ai_evaluation": "这餐整体热量适中..."
  }
}
```

### 8.4 保存饮食记录
```
POST /diet/records
```
**Request Body:**
```json
{
  "meal_type": "lunch",
  "foods": [...],
  "total_calories": 480,
  "recorded_at": "2026-03-15T12:30:00Z"
}
```

### 8.5 获取每日饮食摘要
```
GET /diet/summary?date=2026-03-15
```
**Response:**
```json
{
  "code": 0,
  "data": {
    "date": "2026-03-15",
    "total_calories": 856,
    "target_calories": 1800,
    "meals": {
      "breakfast": { "calories": 340, "recorded": true },
      "lunch": { "calories": 516, "recorded": true },
      "dinner": { "calories": 0, "recorded": false },
      "snack": { "calories": 0, "recorded": false }
    },
    "macro_total": { "carbs": 110, "fat": 28, "protein": 42 }
  }
}
```

### 8.6 饮食 AI 对话
```
POST /diet/chat
```
**Request Body:**
```json
{
  "message": "晚餐吃什么比较好？",
  "context": {
    "diet_mode": "gdm_moderate",
    "today_calories": 856,
    "target_calories": 1800
  }
}
```

---

## 9. 月子规划模块 (Maternity)

### 9.1 获取月子中心列表
```
GET /maternity/centers?city=北京&sort=rating&page=1&page_size=10
```
**Query Params:**
- `city`: 城市名
- `sort`: `rating` | `price_asc` | `price_desc` | `distance`
- `lat`, `lng`: 用户位置（计算距离用）
- `min_price`, `max_price`: 价格区间

**Response:**
```json
{
  "code": 0,
  "data": {
    "list": [
      {
        "id": "ctr_001",
        "name": "爱帝宫月子中心",
        "address": "北京市朝阳区望京SOHO T3",
        "rating": 4.8,
        "review_count": 326,
        "min_price": 39800,
        "distance_km": 3.2,
        "tags": ["明星推荐", "五星级"],
        "certified": true,
        "cover_image": "https://...",
        "served_families": 1200
      }
    ],
    "total": 15
  }
}
```

### 9.2 获取月子中心详情
```
GET /maternity/centers/:id
```
**Response:** 包含套餐列表、设施服务、用户评价等

### 9.3 获取月嫂列表
```
GET /maternity/nannies?city=北京&sort=rating&page=1&page_size=10
```

### 9.4 获取月嫂详情
```
GET /maternity/nannies/:id
```
**Response:** 包含资质证书、技能、排期、评价、价格

### 9.5 获取评价列表
```
GET /maternity/reviews?target_type=center&target_id=ctr_001&page=1&page_size=10
```

### 9.6 创建预约
```
POST /maternity/bookings
```
**Request Body:**
```json
{
  "service_type": "center",
  "service_id": "ctr_001",
  "package_id": "pkg_002",
  "contact_name": "张三",
  "contact_phone": "13800138000",
  "start_date": "2026-09-01",
  "deposit": 5000,
  "delivery_type": "natural",
  "is_twin": false,
  "special_needs": ["素食", "无乳糖饮食"],
  "notes": ""
}
```
**字段说明（新增）:**
- `delivery_type`: enum `natural` | `cesarean` | `undecided` 分娩方式, 可选
- `is_twin`: 是否双胎, 可选, 默认 false
- `special_needs`: string[] 特殊需求列表, 可选

**后端逻辑:**
1. 校验服务可用性
2. 创建预约记录（状态: pending_payment）
3. 生成支付订单
4. 奖励幸孕币（预约成功 +50）

### 9.7 获取我的预约
```
GET /maternity/bookings?page=1&page_size=10
```

### 9.8 取消预约
```
PUT /maternity/bookings/:id/cancel
```

---

## 10. 用户模块 (User)

### 10.1 更新用户信息
```
PUT /user
```
**Request Body:**
```json
{
  "nickname": "小明妈妈",
  "avatar_url": "https://..."
}
```

### 10.2 获取幸孕币余额
```
GET /user/coins
```
**Response:**
```json
{
  "code": 0,
  "data": {
    "balance": 1280,
    "total_earned": 2450,
    "total_spent": 1170
  }
}
```

### 10.3 获取幸孕币记录
```
GET /user/coins/records?page=1&page_size=20
```

### 10.4 获取成就列表
```
GET /user/achievements
```
**Response:**
```json
{
  "code": 0,
  "data": [
    {
      "id": "ach_001",
      "title": "初来乍到",
      "description": "完成建档",
      "icon": "star",
      "unlocked": true,
      "unlocked_at": "2026-03-01T10:00:00Z"
    }
  ]
}
```

### 10.5 获取每日任务
```
GET /user/daily-tasks?date=2026-03-15
```
**Response:**
```json
{
  "code": 0,
  "data": [
    {
      "id": "task_001",
      "title": "记录今日体重",
      "icon": "scale",
      "coins_reward": 10,
      "completed": true,
      "completed_at": "2026-03-15T08:00:00Z"
    }
  ]
}
```

### 10.6 完成每日任务
```
POST /user/daily-tasks/:id/complete
```

### 10.7 获取打卡连续天数
```
GET /user/streak
```
**Response:**
```json
{
  "code": 0,
  "data": {
    "current_streak": 5,
    "longest_streak": 12,
    "this_week": [true, true, true, true, true, false, false],
    "streak_reward_at_7": 50
  }
}
```

### 10.8 获取设置
```
GET /user/settings
```

### 10.9 更新设置
```
PUT /user/settings
```
**Request Body:**
```json
{
  "checkup_reminder": true,
  "daily_reminder": true,
  "diet_reminder": false,
  "kick_reminder": false,
  "reminder_time": "08:00",
  "data_encryption": true,
  "anonymous_share": true
}
```

---

## 11. 通知模块 (Notification)

### 11.1 获取通知列表
```
GET /notifications?page=1&page_size=20
```

### 11.2 标记通知已读
```
PUT /notifications/:id/read
```

### 11.3 标记全部已读
```
PUT /notifications/read-all
```

---

## 12. 文件上传 (Upload)

### 12.1 通用文件上传
```
POST /upload
Content-Type: multipart/form-data
```
**Form Fields:**
- `file`: 文件
- `type`: `avatar` | `report` | `food`

**Response:**
```json
{
  "code": 0,
  "data": {
    "id": "file_001",
    "url": "https://cdn.mom-app.com/uploads/file_001.jpg",
    "type": "report",
    "size": 1234567,
    "mime_type": "image/jpeg"
  }
}
```

**限制:**
- 头像: 最大 2MB, JPG/PNG
- 报告: 最大 10MB, JPG/PNG/PDF
- 食物: 最大 5MB, JPG/PNG

---

## 13. 胎儿估重模块 (Fetal Weight)

### 13.1 录入B超数据计算估重
```
POST /health/fetal-weight
```
**Request Body:**
```json
{
  "bpd": 35.2,
  "hc": 128.5,
  "ac": 110.3,
  "fl": 25.8,
  "measured_at": "2026-03-20T10:00:00Z",
  "gestational_week": 18,
  "source": "manual"
}
```
**字段说明:**
- `bpd`: 双顶径(mm), 必填, 范围 15-120
- `hc`: 头围(mm), 必填, 范围 50-400
- `ac`: 腹围(mm), 必填, 范围 50-400
- `fl`: 股骨长(mm), 必填, 范围 10-90
- `source`: enum `manual` | `ocr` (手动输入或OCR自动提取)

**后端逻辑:**
1. 校验各项B超数据范围合理性
2. 使用 Hadlock 公式计算估重(EFW): `log10(EFW) = 1.304 + 0.05281*AC + 0.1938*FL - 0.004*AC*FL`（AC/FL 单位为 cm）
3. 根据孕周和EFW查询WHO胎儿生长标准，计算百分位
4. 评估: P10以下偏小, P10-P90正常, P90以上偏大
5. 保存记录
6. 奖励幸孕币（每日首次记录 +10）

**Response:**
```json
{
  "code": 0,
  "data": {
    "id": "fw_001",
    "bpd": 35.2,
    "hc": 128.5,
    "ac": 110.3,
    "fl": 25.8,
    "efw_grams": 230,
    "percentile": 45,
    "evaluation": "normal",
    "gestational_week": 18,
    "message": "胎儿估重在正常范围内（P45）",
    "reference": {
      "p10": 170,
      "p50": 225,
      "p90": 290
    }
  }
}
```

### 13.2 获取胎儿生长曲线数据
```
GET /health/fetal-weight/history?range=all
```
**Query Params:**
- `range`: `1month` | `trimester` | `all`

**Response:**
```json
{
  "code": 0,
  "data": {
    "records": [
      {
        "id": "fw_001",
        "gestational_week": 18,
        "efw_grams": 230,
        "percentile": 45,
        "evaluation": "normal",
        "measured_at": "2026-03-20T10:00:00Z"
      }
    ],
    "growth_curve": {
      "p10": [{"week": 14, "weight": 80}, {"week": 18, "weight": 170}],
      "p50": [{"week": 14, "weight": 110}, {"week": 18, "weight": 225}],
      "p90": [{"week": 14, "weight": 145}, {"week": 18, "weight": 290}]
    }
  }
}
```

---

## 14. 饮食问卷与偏好模块 (Diet Profile)

### 14.1 保存饮食问卷结果
```
POST /diet/questionnaire
```
**Request Body:**
```json
{
  "has_gdm": true,
  "dietary_restrictions": ["lactose_intolerant"],
  "food_allergies": ["shellfish", "peanut"],
  "cuisine_preference": ["chinese", "japanese"],
  "cooking_skill": "intermediate",
  "meals_per_day": 5,
  "snack_habit": true,
  "exercise_level": "light"
}
```
**字段说明:**
- `has_gdm`: 是否有妊娠期糖尿病
- `dietary_restrictions`: string[] 饮食限制, 可选值: `vegetarian`, `vegan`, `lactose_intolerant`, `gluten_free`, `halal`, `none`
- `food_allergies`: string[] 食物过敏, 自由输入
- `cuisine_preference`: string[] 菜系偏好
- `cooking_skill`: enum `beginner` | `intermediate` | `advanced`
- `meals_per_day`: 每日用餐次数 (3-6)
- `snack_habit`: 是否有加餐习惯
- `exercise_level`: enum `sedentary` | `light` | `moderate` | `active`

**后端逻辑:**
1. 保存问卷答案
2. 根据 has_gdm + exercise_level + BMI 自动推导饮食模式 (balanced / gdm_moderate / gdm_strict)
3. 根据问卷结果计算推荐每日热量和营养素配比
4. 自动创建/更新 diet_goals 记录
5. 标记首次问卷完成，奖励幸孕币 +20

**Response:**
```json
{
  "code": 0,
  "data": {
    "id": "dq_001",
    "recommended_mode": "gdm_moderate",
    "recommended_calories": 1800,
    "macro_ratio": {
      "carb_percent": 45,
      "fat_percent": 30,
      "protein_percent": 25
    },
    "personalized_tips": [
      "建议优先选择低GI主食，如糙米、荞麦面",
      "避免含乳糖食物，可选择豆浆替代牛奶"
    ]
  }
}
```

### 14.2 获取饮食偏好配置
```
GET /diet/profile
```
**Response:**
```json
{
  "code": 0,
  "data": {
    "questionnaire_completed": true,
    "has_gdm": true,
    "dietary_restrictions": ["lactose_intolerant"],
    "food_allergies": ["shellfish", "peanut"],
    "cuisine_preference": ["chinese", "japanese"],
    "cooking_skill": "intermediate",
    "meals_per_day": 5,
    "snack_habit": true,
    "exercise_level": "light",
    "recommended_mode": "gdm_moderate",
    "recommended_calories": 1800
  }
}
```

### 14.3 更新餐次分配比例
```
PUT /diet/goal/meal-distribution
```
**Request Body:**
```json
{
  "distribution": [
    { "meal_type": "breakfast", "percent": 25, "calories": 450 },
    { "meal_type": "morning_snack", "percent": 10, "calories": 180 },
    { "meal_type": "lunch", "percent": 30, "calories": 540 },
    { "meal_type": "afternoon_snack", "percent": 10, "calories": 180 },
    { "meal_type": "dinner", "percent": 25, "calories": 450 }
  ]
}
```
**字段说明:**
- `meal_type`: enum `breakfast` | `morning_snack` | `lunch` | `afternoon_snack` | `dinner` | `evening_snack`
- `percent`: 该餐次占每日总热量的百分比，所有餐次总和必须为 100
- `calories`: 该餐次的目标热量（由前端根据 percent 和总热量计算）

**后端逻辑:**
1. 校验所有 percent 总和 = 100
2. 保存/更新餐次分配配置
3. 更新饮食目标中的各餐次热量限制

**Response:**
```json
{
  "code": 0,
  "data": {
    "daily_calories": 1800,
    "distribution": [
      { "meal_type": "breakfast", "percent": 25, "calories": 450 },
      { "meal_type": "morning_snack", "percent": 10, "calories": 180 },
      { "meal_type": "lunch", "percent": 30, "calories": 540 },
      { "meal_type": "afternoon_snack", "percent": 10, "calories": 180 },
      { "meal_type": "dinner", "percent": 25, "calories": 450 }
    ]
  }
}
```

### 14.4 获取食物替代推荐
```
GET /diet/food/{id}/alternatives?limit=5
```
**Query Params:**
- `limit`: 返回替代食物数量，默认 5

**Response:**
```json
{
  "code": 0,
  "data": {
    "original_food": {
      "id": "food_001",
      "name": "白米饭",
      "calories_per_100g": 116,
      "gi_value": 83,
      "gi_level": "high"
    },
    "alternatives": [
      {
        "id": "food_045",
        "name": "糙米饭",
        "calories_per_100g": 111,
        "gi_value": 56,
        "gi_level": "mid",
        "gi_reduction_percent": 32,
        "reason": "同为主食类，GI值降低32%，膳食纤维更丰富"
      },
      {
        "id": "food_052",
        "name": "荞麦面",
        "calories_per_100g": 108,
        "gi_value": 46,
        "gi_level": "low",
        "gi_reduction_percent": 44,
        "reason": "低GI主食，适合控糖饮食"
      }
    ]
  }
}
```

**后端逻辑:**
1. 查询原食物的类别和GI值
2. 在 food_alternatives 表或 food_database 中查找同类别、GI 值低于原食物 30% 以上的食物
3. 按 GI 值升序排序，取 limit 条
4. 计算 GI 降低百分比，生成推荐理由

---

## 15. 邀请有礼模块 (Invite)

### 15.1 生成邀请码
```
POST /invite/generate-code
```
**Response:**
```json
{
  "code": 0,
  "data": {
    "invite_code": "MOM2026A1B2",
    "invite_url": "https://mom-app.com/invite/MOM2026A1B2",
    "qr_code_url": "https://cdn.mom-app.com/qr/MOM2026A1B2.png",
    "expires_at": "2026-04-20T00:00:00Z"
  }
}
```

**后端逻辑:**
1. 检查用户是否已有有效邀请码，有则直接返回
2. 生成唯一邀请码（格式: MOM + 年份 + 6位随机字符）
3. 生成小程序码/短链接
4. 有效期 30 天

### 15.2 获取邀请记录
```
GET /invite/records?page=1&page_size=20
```
**Response:**
```json
{
  "code": 0,
  "data": {
    "list": [
      {
        "id": "inv_001",
        "invitee_nickname": "小红妈妈",
        "invitee_avatar": "https://...",
        "status": "registered",
        "coins_earned": 15,
        "invited_at": "2026-03-18T14:30:00Z",
        "registered_at": "2026-03-18T15:00:00Z"
      }
    ],
    "total": 5,
    "page": 1,
    "page_size": 20,
    "has_more": false
  }
}
```

### 15.3 获取邀请统计
```
GET /invite/stats
```
**Response:**
```json
{
  "code": 0,
  "data": {
    "total_invited": 12,
    "total_registered": 8,
    "total_active": 5,
    "total_coins_earned": 235,
    "invite_code": "MOM2026A1B2",
    "rank": 15,
    "milestones": [
      { "target": 3, "reward": 50, "reached": true },
      { "target": 10, "reward": 150, "reached": false },
      { "target": 30, "reward": 500, "reached": false }
    ]
  }
}
```

---

## 16. 成就系统模块 (Achievements)

### 16.1 获取成就列表
```
GET /achievements
```
**Response:**
```json
{
  "code": 0,
  "data": {
    "total": 8,
    "unlocked_count": 3,
    "achievements": [
      {
        "id": "ach_001",
        "key": "first_signup",
        "title": "初来乍到",
        "description": "完成建档",
        "icon": "star",
        "category": "milestone",
        "unlocked": true,
        "unlocked_at": "2026-03-01T10:00:00Z",
        "coins_reward": 50,
        "progress": {
          "current": 1,
          "target": 1
        }
      },
      {
        "id": "ach_002",
        "key": "health_7days",
        "title": "健康达人",
        "description": "连续7天记录体重",
        "icon": "muscle",
        "category": "health",
        "unlocked": false,
        "unlocked_at": null,
        "coins_reward": 80,
        "progress": {
          "current": 3,
          "target": 7
        }
      }
    ]
  }
}
```

### 16.2 获取成就详情
```
GET /achievements/{id}
```
**Response:**
```json
{
  "code": 0,
  "data": {
    "id": "ach_002",
    "key": "health_7days",
    "title": "健康达人",
    "description": "连续7天记录体重",
    "icon": "muscle",
    "category": "health",
    "unlocked": false,
    "coins_reward": 80,
    "progress": {
      "current": 3,
      "target": 7,
      "details": [
        { "date": "2026-03-18", "completed": true },
        { "date": "2026-03-19", "completed": true },
        { "date": "2026-03-20", "completed": true }
      ]
    },
    "tips": "继续坚持，还差4天就能解锁！"
  }
}
```

---

## 17. 积分明细模块 (Coins)

### 17.1 获取积分流水
```
GET /coins/transactions?page=1&page_size=20&type=all
```
**Query Params:**
- `type`: `all` | `income` | `expense`
- `start_date`: 开始日期，可选
- `end_date`: 结束日期，可选

**Response:**
```json
{
  "code": 0,
  "data": {
    "balance": 1280,
    "list": [
      {
        "id": "txn_001",
        "amount": 10,
        "type": "income",
        "source": "daily_weight",
        "description": "记录今日体重",
        "balance_after": 1280,
        "created_at": "2026-03-20T08:30:00Z"
      },
      {
        "id": "txn_002",
        "amount": -200,
        "type": "expense",
        "source": "shop_redeem",
        "description": "兑换 孕期维生素试用装",
        "balance_after": 1270,
        "created_at": "2026-03-19T16:00:00Z"
      }
    ],
    "total": 56,
    "page": 1,
    "page_size": 20,
    "has_more": true
  }
}
```

### 17.2 获取今日可赚进度
```
GET /coins/daily-progress
```
**Response:**
```json
{
  "code": 0,
  "data": {
    "date": "2026-03-20",
    "daily_limit": 200,
    "earned_today": 35,
    "remaining": 165,
    "tasks": [
      {
        "key": "daily_weight",
        "title": "记录体重",
        "coins": 10,
        "completed": true,
        "completed_at": "2026-03-20T08:30:00Z"
      },
      {
        "key": "daily_diet",
        "title": "记录饮食",
        "coins": 10,
        "max_times": 3,
        "completed_times": 1,
        "completed": false
      },
      {
        "key": "daily_knowledge",
        "title": "阅读知识",
        "coins": 5,
        "completed": false,
        "completed_at": null
      },
      {
        "key": "daily_question",
        "title": "向AI提问",
        "coins": 5,
        "completed": true,
        "completed_at": "2026-03-20T09:15:00Z"
      },
      {
        "key": "daily_share",
        "title": "分享给好友",
        "coins": 5,
        "completed": false,
        "completed_at": null
      }
    ]
  }
}
```

---

## 18. 兑换商城模块 (Shop)

### 18.1 获取商城商品列表
```
GET /coins/shop/items?category=all&page=1&page_size=20
```
**Query Params:**
- `category`: `all` | `coupon` | `sample` | `service` | `virtual`

**Response:**
```json
{
  "code": 0,
  "data": {
    "list": [
      {
        "id": "item_001",
        "name": "孕期维生素试用装",
        "description": "知名品牌孕期复合维生素，3日体验装",
        "category": "sample",
        "cover_image": "https://cdn.mom-app.com/shop/item_001.jpg",
        "price_coins": 200,
        "original_price_yuan": 29.9,
        "stock": 50,
        "sold_count": 128,
        "limit_per_user": 1,
        "status": "available"
      }
    ],
    "total": 12,
    "page": 1,
    "page_size": 20,
    "has_more": false
  }
}
```

### 18.2 兑换商品
```
POST /coins/shop/redeem
```
**Request Body:**
```json
{
  "item_id": "item_001",
  "address": {
    "name": "张三",
    "phone": "13800138000",
    "province": "北京市",
    "city": "北京市",
    "district": "朝阳区",
    "detail": "望京SOHO T3 1201"
  }
}
```
**字段说明:**
- `item_id`: 商品ID, 必填
- `address`: 收货地址（实物商品必填，虚拟商品可不填）

**后端逻辑:**
1. 校验商品状态、库存、用户限购
2. 检查用户积分余额是否充足
3. 扣减积分，创建积分支出记录
4. 减少库存
5. 创建兑换订单
6. 实物商品需创建发货任务

**Response:**
```json
{
  "code": 0,
  "data": {
    "order_id": "ord_001",
    "item_name": "孕期维生素试用装",
    "coins_spent": 200,
    "balance_after": 1080,
    "status": "pending_ship",
    "estimated_delivery": "2026-03-25"
  }
}
```

---

## 19. 预约详情模块 (Booking Detail)

### 19.1 获取预约详情
```
GET /maternity/booking/{id}
```
**Response:**
```json
{
  "code": 0,
  "data": {
    "id": "bkg_001",
    "service_type": "center",
    "status": "confirmed",
    "service": {
      "id": "ctr_001",
      "name": "爱帝宫月子中心",
      "address": "北京市朝阳区望京SOHO T3",
      "cover_image": "https://...",
      "rating": 4.8,
      "phone": "010-12345678"
    },
    "package": {
      "id": "pkg_002",
      "name": "尊享28天套餐",
      "duration_days": 28,
      "price": 59800
    },
    "delivery_type": "natural",
    "is_twin": false,
    "special_needs": ["素食", "无乳糖饮食"],
    "contact_name": "张三",
    "contact_phone": "13800138000",
    "start_date": "2026-09-01",
    "end_date": "2026-09-29",
    "total_amount": 59800,
    "deposit": 5000,
    "deposit_paid": true,
    "remaining_amount": 54800,
    "order_no": "MOM20260320001",
    "coins_earned": 50,
    "created_at": "2026-03-20T10:00:00Z",
    "confirmed_at": "2026-03-20T10:05:00Z",
    "notes": ""
  }
}
```

**字段说明:**
- `delivery_type`: enum `natural` | `cesarean` | `undecided` 分娩方式
- `is_twin`: 是否双胎
- `special_needs`: string[] 特殊需求列表
