# MOM孕期助手 - 数据模型设计

## 数据库选型建议
- **主数据库**: PostgreSQL 16+（关系型数据，JSONB 支持结构化扩展）
- **缓存**: Redis 7+（Session、排行榜、计数器、限流）
- **对象存储**: S3兼容存储（报告图片、头像、食物图片）
- **向量数据库**: 可选（知识库语义检索）

---

## 1. 用户表 (users)

```sql
CREATE TABLE users (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    wechat_openid   VARCHAR(64) UNIQUE NOT NULL,
    wechat_unionid  VARCHAR(64) UNIQUE,
    nickname        VARCHAR(50) NOT NULL DEFAULT '',
    avatar_url      VARCHAR(500) DEFAULT '',
    mom_id          VARCHAR(20) UNIQUE NOT NULL,  -- 格式: MOM + 年月日 + 序号
    phone           VARCHAR(20),
    status          SMALLINT NOT NULL DEFAULT 1,   -- 1:active, 0:disabled
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_users_wechat_openid ON users(wechat_openid);
CREATE INDEX idx_users_mom_id ON users(mom_id);
```

---

## 2. 孕期档案表 (pregnancy_profiles)

```sql
CREATE TABLE pregnancy_profiles (
    id                      UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id                 UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    lmp_date                DATE NOT NULL,                    -- 末次月经日期
    edd_date                DATE NOT NULL,                    -- 预产期
    pre_pregnancy_weight    DECIMAL(5,1) NOT NULL,            -- 孕前体重(kg)
    height                  DECIMAL(5,1) NOT NULL,            -- 身高(cm)
    bmi                     DECIMAL(4,1) NOT NULL,            -- 孕前BMI
    bmi_category            VARCHAR(20) NOT NULL,             -- underweight/normal/overweight/obese
    parity_type             VARCHAR(20) NOT NULL DEFAULT 'primipara', -- primipara/multipara
    fetus_type              VARCHAR(20) NOT NULL DEFAULT 'singleton', -- singleton/twins
    risk_factors            JSONB NOT NULL DEFAULT '[]',      -- ["gestational_diabetes", "advanced_age"]
    hospital                VARCHAR(100) DEFAULT '',
    recommended_gain_min    DECIMAL(4,1) NOT NULL,            -- 推荐增重下限(kg)
    recommended_gain_max    DECIMAL(4,1) NOT NULL,            -- 推荐增重上限(kg)
    status                  SMALLINT NOT NULL DEFAULT 1,       -- 1:active, 0:archived
    created_at              TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at              TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    UNIQUE(user_id, status)  -- 每用户只有一个活跃档案
);

CREATE INDEX idx_profiles_user_id ON pregnancy_profiles(user_id);
```

---

## 3. 产检计划表 (checkup_plans)

```sql
CREATE TABLE checkup_plans (
    id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id             UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    profile_id          UUID NOT NULL REFERENCES pregnancy_profiles(id),
    plan_order          SMALLINT NOT NULL,            -- 第几次产检 (1-11)
    name                VARCHAR(50) NOT NULL,          -- "第1次产检"
    title               VARCHAR(100) NOT NULL,         -- "NT检查 + 建档"
    week_start          SMALLINT NOT NULL,             -- 开始孕周
    week_end            SMALLINT NOT NULL,             -- 结束孕周
    week_end_day        SMALLINT NOT NULL DEFAULT 6,   -- 结束周的第几天 (0-6)
    scheduled_date      DATE,                          -- 预计产检日期
    actual_date         DATE,                          -- 实际产检日期
    status              VARCHAR(20) NOT NULL DEFAULT 'pending', -- pending/done/overdue/skipped
    items               JSONB NOT NULL DEFAULT '[]',   -- 检查项目详情
    notes               TEXT DEFAULT '',               -- 注意事项
    bring_list          JSONB NOT NULL DEFAULT '[]',   -- 需要携带物品
    created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at          TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_checkup_plans_user_id ON checkup_plans(user_id);
CREATE INDEX idx_checkup_plans_status ON checkup_plans(status);
CREATE INDEX idx_checkup_plans_scheduled ON checkup_plans(scheduled_date);
```

**items JSONB 结构:**
```json
[
  {
    "name": "NT超声",
    "description": "测量胎儿颈后透明层厚度，筛查唐氏综合征风险",
    "required": true,
    "icon": "ultrasound"
  }
]
```

---

## 4. 产检记录表 (checkup_records)

```sql
CREATE TABLE checkup_records (
    id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id             UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    plan_id             UUID REFERENCES checkup_plans(id),
    actual_date         DATE NOT NULL,
    hospital            VARCHAR(100) DEFAULT '',
    result              VARCHAR(20) NOT NULL,          -- normal/abnormal/need_recheck
    completed_items     JSONB NOT NULL DEFAULT '[]',   -- ["大排畸超声", "血常规"]
    report_image_ids    JSONB NOT NULL DEFAULT '[]',   -- ["img_001", "img_002"]
    doctor_notes        TEXT DEFAULT '',
    created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at          TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_checkup_records_user_id ON checkup_records(user_id);
CREATE INDEX idx_checkup_records_plan_id ON checkup_records(plan_id);
```

---

## 5. 产检提醒表 (checkup_reminders)

```sql
CREATE TABLE checkup_reminders (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id         UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    plan_id         UUID NOT NULL REFERENCES checkup_plans(id) ON DELETE CASCADE,
    reminder_type   VARCHAR(20) NOT NULL,      -- 3_days_before / 1_day_before / morning_of
    remind_at       TIMESTAMPTZ NOT NULL,       -- 实际提醒时间
    enabled         BOOLEAN NOT NULL DEFAULT true,
    sent            BOOLEAN NOT NULL DEFAULT false,
    sent_at         TIMESTAMPTZ,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_reminders_remind_at ON checkup_reminders(remind_at) WHERE enabled = true AND sent = false;
```

---

## 6. 体重记录表 (weight_records)

```sql
CREATE TABLE weight_records (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id         UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    weight          DECIMAL(5,1) NOT NULL,        -- 体重(kg)
    delta           DECIMAL(4,1),                  -- 与上次记录的差值
    total_gain      DECIMAL(4,1),                  -- 孕期总增重
    gestational_week SMALLINT,                     -- 记录时的孕周
    evaluation      VARCHAR(20) DEFAULT 'normal',  -- normal/high/low
    note            VARCHAR(200) DEFAULT '',
    measured_at     TIMESTAMPTZ NOT NULL,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_weight_user_date ON weight_records(user_id, measured_at DESC);
```

---

## 7. 血压记录表 (blood_pressure_records)

```sql
CREATE TABLE blood_pressure_records (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id         UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    systolic        SMALLINT NOT NULL,             -- 收缩压(mmHg)
    diastolic       SMALLINT NOT NULL,             -- 舒张压(mmHg)
    heart_rate      SMALLINT,                      -- 心率(次/分) 可选
    position        VARCHAR(20) DEFAULT 'sitting', -- sitting/lying/standing
    evaluation      VARCHAR(20) DEFAULT 'normal',  -- normal/elevated/high/critical
    note            VARCHAR(200) DEFAULT '',
    measured_at     TIMESTAMPTZ NOT NULL,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_bp_user_date ON blood_pressure_records(user_id, measured_at DESC);
```

---

## 8. 血糖记录表 (blood_sugar_records)

```sql
CREATE TABLE blood_sugar_records (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id         UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    value           DECIMAL(4,1) NOT NULL,         -- 血糖值(mmol/L)
    meal_type       VARCHAR(20) NOT NULL,          -- fasting/post_1h/post_2h
    threshold       DECIMAL(4,1) NOT NULL,         -- 对应阈值
    evaluation      VARCHAR(20) DEFAULT 'normal',  -- normal/high
    note            VARCHAR(200) DEFAULT '',
    measured_at     TIMESTAMPTZ NOT NULL,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_bs_user_date ON blood_sugar_records(user_id, meal_type, measured_at DESC);
```

---

## 9. 胎动记录表 (fetal_movement_sessions)

```sql
CREATE TABLE fetal_movement_sessions (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id         UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    start_time      TIMESTAMPTZ NOT NULL,
    end_time        TIMESTAMPTZ,
    duration_minutes SMALLINT,                    -- 计算字段
    total_kicks     SMALLINT NOT NULL DEFAULT 0,
    evaluation      VARCHAR(20),                   -- normal/low/critical
    gestational_week SMALLINT,
    status          VARCHAR(20) NOT NULL DEFAULT 'active', -- active/completed
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_fm_user_date ON fetal_movement_sessions(user_id, start_time DESC);
```

```sql
CREATE TABLE fetal_movement_kicks (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    session_id      UUID NOT NULL REFERENCES fetal_movement_sessions(id) ON DELETE CASCADE,
    kicked_at       TIMESTAMPTZ NOT NULL
);

CREATE INDEX idx_kicks_session ON fetal_movement_kicks(session_id);
```

---

## 10. 聊天消息表 (chat_messages)

```sql
CREATE TABLE chat_messages (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id         UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    role            VARCHAR(20) NOT NULL,          -- user/assistant/system
    type            VARCHAR(20) NOT NULL DEFAULT 'text', -- text/image/report_card/survey/typing
    content         TEXT NOT NULL,
    metadata        JSONB DEFAULT '{}',            -- links, report_card, survey_options
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_messages_user_date ON chat_messages(user_id, created_at DESC);
```

**metadata JSONB 结构示例:**
```json
{
  "links": [
    {"text": "查看产检日历", "route": "/checkup"}
  ],
  "report_card": {
    "title": "产检报告解读",
    "description": "...",
    "emoji": "chart",
    "action_text": "马上解读",
    "action_route": "/assistant/report-upload"
  }
}
```

---

## 11. 报告上传与解读表 (reports)

```sql
CREATE TABLE reports (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id         UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    report_type     VARCHAR(30) NOT NULL,          -- blood_routine/urine_routine/...
    image_ids       JSONB NOT NULL DEFAULT '[]',
    status          VARCHAR(20) NOT NULL DEFAULT 'pending', -- pending/processing/done/failed
    ocr_raw_text    TEXT,                          -- OCR 原始识别结果
    summary         JSONB,                         -- 摘要
    indicators      JSONB,                         -- 指标解读结果
    ai_summary      TEXT,                          -- AI 综合摘要
    analyzed_at     TIMESTAMPTZ,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_reports_user ON reports(user_id, created_at DESC);
```

**indicators JSONB 结构:**
```json
[
  {
    "name": "血红蛋白（Hb）",
    "value": 105,
    "unit": "g/L",
    "reference_range": "110-150",
    "status": "low",
    "explanation": "..."
  }
]
```

---

## 12. 文件上传表 (uploaded_files)

```sql
CREATE TABLE uploaded_files (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id         UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    file_type       VARCHAR(20) NOT NULL,          -- avatar/report/food
    original_name   VARCHAR(255) NOT NULL,
    storage_key     VARCHAR(500) NOT NULL,          -- S3 key
    url             VARCHAR(500) NOT NULL,
    mime_type       VARCHAR(50) NOT NULL,
    size_bytes      INTEGER NOT NULL,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_files_user ON uploaded_files(user_id);
```

---

## 13. 饮食目标表 (diet_goals)

```sql
CREATE TABLE diet_goals (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id         UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    daily_calories  SMALLINT NOT NULL DEFAULT 1800,
    carb_percent    SMALLINT NOT NULL DEFAULT 50,
    fat_percent     SMALLINT NOT NULL DEFAULT 30,
    protein_percent SMALLINT NOT NULL DEFAULT 20,
    diet_mode       VARCHAR(20) NOT NULL DEFAULT 'balanced', -- balanced/gdm_moderate/gdm_strict
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    UNIQUE(user_id)
);
```

---

## 14. 饮食记录表 (diet_records)

```sql
CREATE TABLE diet_records (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id         UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    meal_type       VARCHAR(20) NOT NULL,          -- breakfast/lunch/dinner/snack
    foods           JSONB NOT NULL,                -- 食物列表
    total_calories  SMALLINT NOT NULL,
    total_carbs     DECIMAL(6,1),
    total_fat       DECIMAL(6,1),
    total_protein   DECIMAL(6,1),
    ai_evaluation   TEXT,
    image_id        UUID REFERENCES uploaded_files(id),
    recorded_at     TIMESTAMPTZ NOT NULL,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_diet_user_date ON diet_records(user_id, recorded_at DESC);
```

**foods JSONB 结构:**
```json
[
  {
    "name": "白米饭（1碗）",
    "calories": 210,
    "carbs": 46,
    "fat": 0.4,
    "protein": 4.3,
    "gi_level": "high",
    "gi_value": 83,
    "portion": "1碗"
  }
]
```

---

## 15. 月子中心表 (maternity_centers)

```sql
CREATE TABLE maternity_centers (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name            VARCHAR(100) NOT NULL,
    city            VARCHAR(50) NOT NULL,
    district        VARCHAR(50) DEFAULT '',
    address         VARCHAR(200) NOT NULL,
    latitude        DECIMAL(10,7),
    longitude       DECIMAL(10,7),
    phone           VARCHAR(20),
    rating          DECIMAL(2,1) NOT NULL DEFAULT 0,
    review_count    INTEGER NOT NULL DEFAULT 0,
    served_families INTEGER NOT NULL DEFAULT 0,
    min_price       INTEGER NOT NULL,              -- 最低套餐价(元)
    cover_image     VARCHAR(500) DEFAULT '',
    images          JSONB DEFAULT '[]',
    tags            JSONB DEFAULT '[]',
    features        JSONB DEFAULT '[]',
    certified       BOOLEAN NOT NULL DEFAULT false,
    recommended     BOOLEAN NOT NULL DEFAULT false,
    status          SMALLINT NOT NULL DEFAULT 1,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_centers_city ON maternity_centers(city);
CREATE INDEX idx_centers_rating ON maternity_centers(rating DESC);
CREATE INDEX idx_centers_price ON maternity_centers(min_price);
```

---

## 16. 月子中心套餐表 (center_packages)

```sql
CREATE TABLE center_packages (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    center_id       UUID NOT NULL REFERENCES maternity_centers(id) ON DELETE CASCADE,
    name            VARCHAR(100) NOT NULL,
    duration_days   SMALLINT NOT NULL,             -- 套餐天数
    price           INTEGER NOT NULL,               -- 价格(元)
    description     TEXT DEFAULT '',
    features        JSONB DEFAULT '[]',
    sort_order      SMALLINT NOT NULL DEFAULT 0,
    status          SMALLINT NOT NULL DEFAULT 1,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_packages_center ON center_packages(center_id);
```

---

## 17. 月嫂表 (nannies)

```sql
CREATE TABLE nannies (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name            VARCHAR(50) NOT NULL,
    avatar_url      VARCHAR(500) DEFAULT '',
    city            VARCHAR(50) NOT NULL,
    experience_years SMALLINT NOT NULL,
    rating          DECIMAL(2,1) NOT NULL DEFAULT 0,
    review_count    INTEGER NOT NULL DEFAULT 0,
    served_count    INTEGER NOT NULL DEFAULT 0,
    monthly_price   INTEGER NOT NULL,              -- 月价(元)
    tags            JSONB DEFAULT '[]',
    certifications  JSONB DEFAULT '[]',
    skills          JSONB DEFAULT '[]',
    bio             TEXT DEFAULT '',
    availability    JSONB DEFAULT '[]',            -- 7天排期 [true,true,false,...]
    status          SMALLINT NOT NULL DEFAULT 1,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_nannies_city ON nannies(city);
CREATE INDEX idx_nannies_rating ON nannies(rating DESC);
```

---

## 18. 评价表 (reviews)

```sql
CREATE TABLE reviews (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id         UUID NOT NULL REFERENCES users(id),
    target_type     VARCHAR(20) NOT NULL,          -- center/nanny
    target_id       UUID NOT NULL,
    rating          SMALLINT NOT NULL,              -- 1-5
    content         TEXT NOT NULL,
    gestational_info VARCHAR(50) DEFAULT '',        -- "产后2个月" / "孕36周"
    images          JSONB DEFAULT '[]',
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_reviews_target ON reviews(target_type, target_id, created_at DESC);
```

---

## 19. 预约表 (maternity_bookings)

```sql
CREATE TABLE maternity_bookings (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id         UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    service_type    VARCHAR(20) NOT NULL,           -- center/nanny
    service_id      UUID NOT NULL,
    package_id      UUID,                           -- 套餐ID (月子中心)
    contact_name    VARCHAR(50) NOT NULL,
    contact_phone   VARCHAR(20) NOT NULL,
    start_date      DATE NOT NULL,
    end_date        DATE,
    total_amount    INTEGER NOT NULL,               -- 总金额(元)
    deposit         INTEGER NOT NULL DEFAULT 0,     -- 定金(元)
    delivery_type   VARCHAR(20) DEFAULT 'undecided', -- natural/cesarean/undecided 分娩方式
    is_twin         BOOLEAN NOT NULL DEFAULT false,  -- 是否双胎
    special_needs   JSONB NOT NULL DEFAULT '[]',     -- ["素食", "无乳糖饮食"] 特殊需求
    status          VARCHAR(20) NOT NULL DEFAULT 'pending_payment',
    -- pending_payment / confirmed / in_service / completed / cancelled / refunded
    cancelled_at    TIMESTAMPTZ,
    cancel_reason   VARCHAR(200),
    notes           TEXT DEFAULT '',
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_bookings_user ON maternity_bookings(user_id, created_at DESC);
CREATE INDEX idx_bookings_status ON maternity_bookings(status);
```

---

## 20. 幸孕币记录表 (coin_records)

```sql
CREATE TABLE coin_records (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id         UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    amount          INTEGER NOT NULL,               -- 正数=收入, 负数=支出
    balance_after   INTEGER NOT NULL,               -- 操作后余额
    source          VARCHAR(50) NOT NULL,            -- 来源标识
    -- signup / first_profile / daily_weight / daily_diet / daily_question
    -- daily_knowledge / checkup_record / report_upload / booking / streak_7
    description     VARCHAR(200) NOT NULL,
    related_id      UUID,                           -- 关联业务ID
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_coins_user ON coin_records(user_id, created_at DESC);
```

---

## 21. 成就表 (achievements)

```sql
CREATE TABLE user_achievements (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id         UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    achievement_key VARCHAR(50) NOT NULL,           -- first_signup / health_7days / knowledge_10 / ...
    unlocked_at     TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    UNIQUE(user_id, achievement_key)
);

CREATE INDEX idx_achievements_user ON user_achievements(user_id);
```

**成就定义 (achievement_definitions 种子数据/配置):**
```json
[
  {"key": "first_signup", "title": "初来乍到", "desc": "完成建档", "icon": "star"},
  {"key": "health_7days", "title": "健康达人", "desc": "连续7天记录体重", "icon": "muscle"},
  {"key": "knowledge_10", "title": "知识先锋", "desc": "阅读10篇知识", "icon": "trophy"},
  {"key": "streak_30", "title": "全勤妈妈", "desc": "连续30天打卡", "icon": "diamond"},
  {"key": "checkup_all", "title": "产检全通", "desc": "完成所有产检", "icon": "flag"},
  {"key": "diet_14days", "title": "饮食管家", "desc": "连续14天记录饮食", "icon": "crown"}
]
```

---

## 22. 每日任务表 (daily_tasks)

```sql
CREATE TABLE daily_task_completions (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id         UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    task_key        VARCHAR(50) NOT NULL,           -- weight / diet / knowledge / question
    task_date       DATE NOT NULL,
    coins_rewarded  SMALLINT NOT NULL DEFAULT 0,
    completed_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    UNIQUE(user_id, task_key, task_date)
);

CREATE INDEX idx_daily_tasks_user_date ON daily_task_completions(user_id, task_date);
```

---

## 23. 用户设置表 (user_settings)

```sql
CREATE TABLE user_settings (
    id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id             UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    checkup_reminder    BOOLEAN NOT NULL DEFAULT true,
    daily_reminder      BOOLEAN NOT NULL DEFAULT true,
    diet_reminder       BOOLEAN NOT NULL DEFAULT false,
    kick_reminder       BOOLEAN NOT NULL DEFAULT false,
    reminder_time       TIME NOT NULL DEFAULT '08:00',
    data_encryption     BOOLEAN NOT NULL DEFAULT true,
    anonymous_share     BOOLEAN NOT NULL DEFAULT true,
    created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    UNIQUE(user_id)
);
```

---

## 24. 通知表 (notifications)

```sql
CREATE TABLE notifications (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id         UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    type            VARCHAR(30) NOT NULL,           -- checkup_reminder / health_alert / achievement / system
    title           VARCHAR(100) NOT NULL,
    body            VARCHAR(500) NOT NULL,
    data            JSONB DEFAULT '{}',             -- {route: "/checkup/3"}
    read            BOOLEAN NOT NULL DEFAULT false,
    read_at         TIMESTAMPTZ,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_notifications_user ON notifications(user_id, created_at DESC);
CREATE INDEX idx_notifications_unread ON notifications(user_id) WHERE read = false;
```

---

## 25. 孕期知识表 (pregnancy_knowledge)

```sql
CREATE TABLE pregnancy_knowledge (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    week            SMALLINT NOT NULL,              -- 4-40
    category        VARCHAR(20) NOT NULL,           -- baby_development / mom_health
    section_title   VARCHAR(100) NOT NULL,
    section_icon    VARCHAR(50) DEFAULT '',
    content         TEXT NOT NULL,
    sort_order      SMALLINT NOT NULL DEFAULT 0,

    UNIQUE(week, category, section_title)
);

CREATE INDEX idx_knowledge_week ON pregnancy_knowledge(week, category);
```

---

## 26. 食物数据库表 (food_database)

```sql
CREATE TABLE food_database (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name            VARCHAR(100) NOT NULL,
    category        VARCHAR(50) NOT NULL,           -- 主食/蔬菜/水果/肉类/...
    calories_per_100g DECIMAL(6,1) NOT NULL,
    carbs_per_100g  DECIMAL(5,1),
    fat_per_100g    DECIMAL(5,1),
    protein_per_100g DECIMAL(5,1),
    gi_value        SMALLINT,                       -- 升糖指数 0-100
    gi_level        VARCHAR(10),                    -- low/mid/high
    common_portions JSONB DEFAULT '[]',             -- [{"name":"1碗","grams":200}]
    tags            JSONB DEFAULT '[]',
    pregnancy_safe  BOOLEAN NOT NULL DEFAULT true,  -- 孕期是否安全
    pregnancy_note  VARCHAR(200) DEFAULT '',        -- 孕期特别说明
    status          SMALLINT NOT NULL DEFAULT 1,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_food_name ON food_database USING gin(name gin_trgm_ops);
CREATE INDEX idx_food_category ON food_database(category);
```

---

## 27. 胎儿估重记录表 (fetal_weight_records)

```sql
CREATE TABLE fetal_weight_records (
    id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id             UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    bpd                 DECIMAL(5,1) NOT NULL,            -- 双顶径(mm)
    hc                  DECIMAL(5,1) NOT NULL,            -- 头围(mm)
    ac                  DECIMAL(5,1) NOT NULL,            -- 腹围(mm)
    fl                  DECIMAL(5,1) NOT NULL,            -- 股骨长(mm)
    efw_grams           INTEGER NOT NULL,                  -- 估算胎儿体重(g), Hadlock公式计算
    percentile          SMALLINT,                          -- 百分位(0-100)
    evaluation          VARCHAR(20) DEFAULT 'normal',      -- small(偏小P<10) / normal(正常) / large(偏大P>90)
    gestational_week    SMALLINT NOT NULL,                 -- 记录时的孕周
    source              VARCHAR(20) NOT NULL DEFAULT 'manual', -- manual / ocr
    measured_at         TIMESTAMPTZ NOT NULL,
    created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_fetal_weight_user_date ON fetal_weight_records(user_id, measured_at DESC);
CREATE INDEX idx_fetal_weight_user_week ON fetal_weight_records(user_id, gestational_week);
```

---

## 28. 饮食问卷结果表 (diet_questionnaire_results)

```sql
CREATE TABLE diet_questionnaire_results (
    id                      UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id                 UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    has_gdm                 BOOLEAN NOT NULL DEFAULT false,
    dietary_restrictions     JSONB NOT NULL DEFAULT '[]',  -- ["vegetarian", "lactose_intolerant"]
    food_allergies          JSONB NOT NULL DEFAULT '[]',   -- ["shellfish", "peanut"]
    cuisine_preference      JSONB NOT NULL DEFAULT '[]',   -- ["chinese", "japanese"]
    cooking_skill           VARCHAR(20) NOT NULL DEFAULT 'intermediate', -- beginner/intermediate/advanced
    meals_per_day           SMALLINT NOT NULL DEFAULT 3,
    snack_habit             BOOLEAN NOT NULL DEFAULT false,
    exercise_level          VARCHAR(20) NOT NULL DEFAULT 'light', -- sedentary/light/moderate/active
    recommended_mode        VARCHAR(20),                   -- 推导出的饮食模式
    recommended_calories    SMALLINT,                      -- 推荐每日热量
    created_at              TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at              TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    UNIQUE(user_id)  -- 每用户只保留最新一份问卷结果
);
```

---

## 29. 餐次分配配置表 (meal_distribution_config)

```sql
CREATE TABLE meal_distribution_config (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id         UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    meal_type       VARCHAR(20) NOT NULL,              -- breakfast/morning_snack/lunch/afternoon_snack/dinner/evening_snack
    percent         SMALLINT NOT NULL,                  -- 该餐次占比(%)
    target_calories SMALLINT NOT NULL,                  -- 该餐次目标热量(kcal)
    sort_order      SMALLINT NOT NULL DEFAULT 0,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    UNIQUE(user_id, meal_type)
);

CREATE INDEX idx_meal_dist_user ON meal_distribution_config(user_id);
```

---

## 30. 食物替代关系表 (food_alternatives)

```sql
CREATE TABLE food_alternatives (
    id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    original_food_id    UUID NOT NULL REFERENCES food_database(id) ON DELETE CASCADE,
    alternative_food_id UUID NOT NULL REFERENCES food_database(id) ON DELETE CASCADE,
    reason              VARCHAR(200) DEFAULT '',          -- 推荐理由
    gi_reduction_percent DECIMAL(4,1),                    -- GI降低百分比
    priority            SMALLINT NOT NULL DEFAULT 0,       -- 排序优先级, 越小越优先
    created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    UNIQUE(original_food_id, alternative_food_id)
);

CREATE INDEX idx_food_alt_original ON food_alternatives(original_food_id, priority);
```

---

## 31. 邀请记录表 (invite_records)

```sql
CREATE TABLE invite_records (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    inviter_id      UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,  -- 邀请人
    invitee_id      UUID REFERENCES users(id),                              -- 被邀请人(注册后关联)
    invite_code     VARCHAR(20) NOT NULL,
    invitee_phone   VARCHAR(20),                           -- 被邀请人手机号(可选)
    status          VARCHAR(20) NOT NULL DEFAULT 'invited', -- invited/registered/active
    coins_earned    INTEGER NOT NULL DEFAULT 0,             -- 该邀请已获得的幸孕币
    invited_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    registered_at   TIMESTAMPTZ,                           -- 被邀请人注册时间
    active_at       TIMESTAMPTZ,                           -- 被邀请人活跃确认时间
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_invite_inviter ON invite_records(inviter_id, created_at DESC);
CREATE INDEX idx_invite_code ON invite_records(invite_code);
CREATE INDEX idx_invite_invitee ON invite_records(invitee_id);
```

```sql
CREATE TABLE invite_codes (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id         UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    code            VARCHAR(20) UNIQUE NOT NULL,
    invite_url      VARCHAR(500) DEFAULT '',
    qr_code_url     VARCHAR(500) DEFAULT '',
    expires_at      TIMESTAMPTZ NOT NULL,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    UNIQUE(user_id)
);

CREATE INDEX idx_invite_codes_code ON invite_codes(code);
```

---

## 32. 成就定义表 (achievements)

```sql
CREATE TABLE achievements (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    key             VARCHAR(50) UNIQUE NOT NULL,
    title           VARCHAR(50) NOT NULL,
    description     VARCHAR(200) NOT NULL,
    icon            VARCHAR(50) NOT NULL,
    category        VARCHAR(30) NOT NULL DEFAULT 'milestone', -- milestone/health/knowledge/social
    coins_reward    INTEGER NOT NULL DEFAULT 0,
    target_value    INTEGER NOT NULL DEFAULT 1,               -- 解锁需要达到的目标值
    sort_order      SMALLINT NOT NULL DEFAULT 0,
    status          SMALLINT NOT NULL DEFAULT 1,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
```

**种子数据（完整8个成就）:**
```json
[
  {"key": "first_signup", "title": "初来乍到", "desc": "完成建档", "icon": "star", "category": "milestone", "coins_reward": 50, "target": 1},
  {"key": "health_7days", "title": "健康达人", "desc": "连续7天记录体重", "icon": "muscle", "category": "health", "coins_reward": 80, "target": 7},
  {"key": "knowledge_10", "title": "知识先锋", "desc": "累计阅读10篇知识", "icon": "trophy", "category": "knowledge", "coins_reward": 60, "target": 10},
  {"key": "streak_30", "title": "全勤妈妈", "desc": "连续30天打卡", "icon": "diamond", "category": "milestone", "coins_reward": 200, "target": 30},
  {"key": "checkup_all", "title": "产检全通", "desc": "完成所有产检", "icon": "flag", "category": "health", "coins_reward": 300, "target": 11},
  {"key": "diet_14days", "title": "饮食管家", "desc": "连续14天记录饮食", "icon": "crown", "category": "health", "coins_reward": 100, "target": 14},
  {"key": "report_5", "title": "报告解读师", "desc": "累计解读5份报告", "icon": "magnifier", "category": "health", "coins_reward": 80, "target": 5},
  {"key": "kick_7days", "title": "胎动记录达人", "desc": "连续7天记录胎动", "icon": "heart", "category": "health", "coins_reward": 80, "target": 7}
]
```

> 注：原有的 user_achievements 表保持不变，新增 achievements 定义表用于存储成就元数据，替代原来的种子数据/配置方案。

---

## 33. 积分流水明细表 (coin_transactions)

```sql
CREATE TABLE coin_transactions (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id         UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    amount          INTEGER NOT NULL,                       -- 正数=收入, 负数=支出
    type            VARCHAR(10) NOT NULL,                   -- income / expense
    source          VARCHAR(50) NOT NULL,                   -- 来源标识
    -- income sources: daily_weight / daily_diet / daily_question / daily_knowledge / daily_share
    --                 checkup_record / report_upload / booking / streak_7 / streak_30
    --                 signup / first_profile / invite_share / invite_register / invite_active
    --                 achievement_unlock / questionnaire_complete
    -- expense sources: shop_redeem
    description     VARCHAR(200) NOT NULL,
    balance_after   INTEGER NOT NULL,                       -- 操作后余额
    related_id      UUID,                                   -- 关联业务ID
    daily_date      DATE,                                   -- 用于每日限额校验
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_coin_txn_user ON coin_transactions(user_id, created_at DESC);
CREATE INDEX idx_coin_txn_user_date ON coin_transactions(user_id, daily_date);
CREATE INDEX idx_coin_txn_type ON coin_transactions(user_id, type);
```

> 注：此表是对原有 coin_records 表的增强版本，新增了 `type` 字段区分收支方向，新增 `daily_date` 字段用于每日限额统计。如果项目已使用 coin_records，可通过迁移脚本升级或直接在 coin_records 上增加新字段。

---

## 34. 商城商品表 (shop_items)

```sql
CREATE TABLE shop_items (
    id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name                VARCHAR(100) NOT NULL,
    description         TEXT DEFAULT '',
    category            VARCHAR(30) NOT NULL,              -- coupon/sample/service/virtual
    cover_image         VARCHAR(500) DEFAULT '',
    images              JSONB DEFAULT '[]',
    price_coins         INTEGER NOT NULL,                   -- 所需幸孕币
    original_price_yuan DECIMAL(10,2),                     -- 原价(元), 用于展示
    stock               INTEGER NOT NULL DEFAULT 0,
    sold_count          INTEGER NOT NULL DEFAULT 0,
    limit_per_user      SMALLINT NOT NULL DEFAULT 1,        -- 每人限购
    sort_order          SMALLINT NOT NULL DEFAULT 0,
    status              SMALLINT NOT NULL DEFAULT 1,        -- 1:available, 0:unavailable, 2:sold_out
    start_at            TIMESTAMPTZ,                        -- 上架时间
    end_at              TIMESTAMPTZ,                        -- 下架时间
    created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at          TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_shop_items_category ON shop_items(category, status);
CREATE INDEX idx_shop_items_status ON shop_items(status, sort_order);
```

---

## 35. 兑换订单表 (redemption_orders)

```sql
CREATE TABLE redemption_orders (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id         UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    item_id         UUID NOT NULL REFERENCES shop_items(id),
    order_no        VARCHAR(30) UNIQUE NOT NULL,            -- 订单号: RDM + 年月日 + 序号
    coins_spent     INTEGER NOT NULL,
    status          VARCHAR(20) NOT NULL DEFAULT 'pending_ship',
    -- pending_ship / shipped / delivered / cancelled
    address         JSONB,                                  -- 收货地址(实物商品)
    tracking_no     VARCHAR(50),                            -- 物流单号
    shipped_at      TIMESTAMPTZ,
    delivered_at    TIMESTAMPTZ,
    cancelled_at    TIMESTAMPTZ,
    cancel_reason   VARCHAR(200),
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_redemption_user ON redemption_orders(user_id, created_at DESC);
CREATE INDEX idx_redemption_status ON redemption_orders(status);
```

**address JSONB 结构:**
```json
{
  "name": "张三",
  "phone": "13800138000",
  "province": "北京市",
  "city": "北京市",
  "district": "朝阳区",
  "detail": "望京SOHO T3 1201"
}
```

---

## ER 关系图（简化）

```
users 1---1 pregnancy_profiles
users 1---N checkup_plans
users 1---N checkup_records
users 1---N weight_records
users 1---N blood_pressure_records
users 1---N blood_sugar_records
users 1---N fetal_movement_sessions
users 1---N chat_messages
users 1---N reports
users 1---1 diet_goals
users 1---N diet_records
users 1---N maternity_bookings
users 1---N coin_records
users 1---N user_achievements
users 1---N daily_task_completions
users 1---1 user_settings
users 1---N notifications
users 1---N uploaded_files
users 1---N fetal_weight_records
users 1---1 diet_questionnaire_results
users 1---N meal_distribution_config
users 1---N invite_records (as inviter)
users 1---1 invite_codes
users 1---N coin_transactions
users 1---N redemption_orders

checkup_plans 1---N checkup_reminders
checkup_plans 1---1 checkup_records
fetal_movement_sessions 1---N fetal_movement_kicks
maternity_centers 1---N center_packages
maternity_centers/nannies 1---N reviews
food_database 1---N food_alternatives (as original)
food_database 1---N food_alternatives (as alternative)
shop_items 1---N redemption_orders
achievements 1---N user_achievements
```

---

## Redis 数据结构

```
# 用户 Session
session:{user_id}          -> {access_token, refresh_token, ...}  TTL: 30d

# 每日任务完成状态（快速查询）
daily_tasks:{user_id}:{date}  -> SET of task_keys              TTL: 48h

# 连续打卡天数
streak:{user_id}            -> {current: 5, last_date: "2026-03-15"}  TTL: 48h

# 幸孕币余额缓存
coins:{user_id}             -> balance                          TTL: 1h

# API 限流
ratelimit:{user_id}:{endpoint}  -> count                       TTL: 1min

# 每日积分已赚取额度
daily_coins:{user_id}:{date}    -> earned_amount                TTL: 48h

# 邀请码缓存
invite_code:{code}              -> {user_id, expires_at}        TTL: 30d

# 商品库存扣减锁
shop_stock_lock:{item_id}       -> lock                         TTL: 10s
```
