# MOM孕期助手 - 第三方服务集成文档

## 1. 微信登录 (WeChat OAuth)

### 1.1 接入方式
- **小程序场景:** `wx.login()` → 获取 code → 后端换取 session_key
- **H5场景:** 微信 OAuth 2.0 网页授权

### 1.2 所需配置
```env
WECHAT_APP_ID=wx1234567890abcdef
WECHAT_APP_SECRET=xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

### 1.3 API 调用流程
```
前端:
1. wx.login() → code
2. wx.getUserInfo() → encrypted_data, iv

后端:
1. GET https://api.weixin.qq.com/sns/jscode2session
   ?appid={APP_ID}&secret={APP_SECRET}&js_code={code}&grant_type=authorization_code
   → 返回 session_key, openid, unionid

2. 使用 session_key 解密 encrypted_data → 获取 nickName, avatarUrl, gender 等

3. 查找或创建用户 → 生成 JWT
```

### 1.4 注意事项
- session_key 有效期短，不要缓存太久
- unionid 需要绑定开放平台才有
- 用户信息获取策略变更：2023 年起 wx.getUserProfile 废弃，需使用新方式
- 头像和昵称现在需要用户手动填写

### 1.5 微信模板消息（产检提醒）
```
POST https://api.weixin.qq.com/cgi-bin/message/subscribe/send
```
**模板示例:**
```json
{
  "touser": "OPENID",
  "template_id": "TEMPLATE_ID",
  "page": "/pages/checkup/detail?id=xxx",
  "data": {
    "thing1": {"value": "第3次产检 · 大排畸超声"},
    "time2": {"value": "2026年3月26日 周四"},
    "thing3": {"value": "请提前预约，记得携带母婴手册"}
  }
}
```

---

## 2. LLM / AI 服务

### 2.1 主要用途
1. **AI对话助手** - 孕期知识问答、产检建议
2. **报告解读** - 结合 OCR 结果生成医学指标解读
3. **饮食分析** - 根据食物清单生成营养评估和建议
4. **食物识别** - 图片识别 + 文字理解

### 2.2 推荐服务商

**方案A: Claude API (Anthropic)**
```env
ANTHROPIC_API_KEY=sk-ant-xxxxx
ANTHROPIC_MODEL=claude-sonnet-4-20250514
```
- 适合: 长文本理解、医学知识问答
- 优势: 指令遵循能力强、中文优秀
- 流式输出: 支持 SSE

**方案B: OpenAI GPT-4**
```env
OPENAI_API_KEY=sk-xxxxx
OPENAI_MODEL=gpt-4o
```

**方案C: 国内替代（降低延迟和成本）**
- 通义千问 (阿里)
- 文心一言 (百度)
- GLM-4 (智谱)

### 2.3 System Prompt 设计
```
你是 MOM孕期助手的 AI 医疗顾问。请注意:

1. 你面向的用户是孕妈妈，回答要温暖、专业、通俗易懂
2. 当前用户信息:
   - 孕周: {week}周{day}天 ({trimester})
   - 预产期: {edd_date}
   - BMI分类: {bmi_category}
   - 高危因素: {risk_factors}
   - 最近产检: {last_checkup}
3. 医学建议仅供参考，重要决定请遵医嘱
4. 不要给出明确的用药建议
5. 遇到紧急情况（大量出血、剧烈腹痛等）时，首先建议立即就医
6. 回答中可以附带相关链接建议，格式: [链接文字](路由路径)
```

### 2.4 流式输出实现
```
// Server (Node.js / Go)
响应 Header:
Content-Type: text/event-stream
Cache-Control: no-cache
Connection: keep-alive

// 数据格式:
event: content_delta
data: {"text": "这是一段回复..."}

event: message_end
data: {"metadata": {...}}
```

### 2.5 Token 用量和成本预估
| 场景 | 平均 Input | 平均 Output | 频次/用户/天 |
|------|-----------|-------------|-------------|
| 对话问答 | ~500 tokens | ~1000 tokens | 3-5次 |
| 报告解读 | ~2000 tokens | ~1500 tokens | 0-1次 |
| 饮食分析 | ~300 tokens | ~800 tokens | 1-3次 |

---

## 3. OCR 识别服务

### 3.1 主要用途
- 检验报告图片 → 结构化数据提取
- 识别指标名称、数值、单位、参考范围

### 3.2 推荐服务商

**方案A: 百度 OCR - 医疗票据识别**
```env
BAIDU_OCR_APP_ID=xxxxx
BAIDU_OCR_API_KEY=xxxxx
BAIDU_OCR_SECRET_KEY=xxxxx
```
```
POST https://aip.baidubce.com/rest/2.0/ocr/v1/medical_report
Content-Type: application/x-www-form-urlencoded
image={base64_encoded_image}
```

**方案B: 阿里云 OCR**
```env
ALIYUN_ACCESS_KEY_ID=xxxxx
ALIYUN_ACCESS_KEY_SECRET=xxxxx
```

**方案C: Tesseract (开源自部署)**
- 适合: 成本敏感、数据安全要求高
- 需要: 自行训练中文医疗报告模型

### 3.3 OCR 后处理流程
```
1. OCR 原始文字
2. 正则匹配提取表格行: 指标名 | 数值 | 单位 | 参考范围
3. 标准化指标名称（同义词映射）
4. 数值类型转换和校验
5. 根据报告类型匹配解读规则
6. 传入 AI 生成解读
```

### 3.4 错误处理
- 图片模糊/无法识别: 返回错误提示用户重新拍照
- 部分指标无法解析: 仅返回已解析的指标，标注"部分指标未识别"
- 超时: 10秒超时，返回"识别中"状态，后台继续处理

### 3.5 B超报告 OCR 识别（胎儿估重数据提取）

**用途:** 从B超报告图片中自动提取 BPD（双顶径）、HC（头围）、AC（腹围）、FL（股骨长）等关键数值，用于胎儿估重计算。

**提取流程:**
```
1. OCR 识别 B超报告图片 → 原始文字
2. 结构化提取:
   - BPD: 正则匹配 /BPD[:\s]*(\d+\.?\d*)\s*mm/i
   - HC:  正则匹配 /HC[:\s]*(\d+\.?\d*)\s*mm/i  或 /头围[:\s]*(\d+\.?\d*)/
   - AC:  正则匹配 /AC[:\s]*(\d+\.?\d*)\s*mm/i  或 /腹围[:\s]*(\d+\.?\d*)/
   - FL:  正则匹配 /FL[:\s]*(\d+\.?\d*)\s*mm/i  或 /股骨[长\s]*(\d+\.?\d*)/
3. 补充提取（可选）:
   - EFW: /EFW[:\s]*(\d+\.?\d*)\s*g/i (估重，部分报告已有)
   - GA:  /GA[:\s]*(\d+)[周w]\s*(\d+)?[天d]?/i (超声孕周)
4. 数值校验:
   - BPD: 15-120mm
   - HC: 50-400mm
   - AC: 50-400mm
   - FL: 10-90mm
   - 如果数值不在合理范围，标记为"提取存疑，请确认"
5. 返回提取结果供用户确认/修正
```

**B超报告类型兼容:**
- 标准打印报告（表格形式）
- 超声工作站屏幕截图
- 手写报告（识别率较低，建议手动输入）

**推荐服务商:** 与检验报告 OCR 使用同一服务（百度 OCR / 阿里云 OCR），但后处理逻辑不同。B超报告需要专门的正则规则集来提取超声测量值。

**错误处理:**
- 仅部分数值提取成功: 返回已提取的值，缺失项标记为 null，由用户手动补充
- 全部提取失败: 提示"无法识别B超数据，请手动输入"
- 数值异常: 提示"数值可能有误，请核对报告后确认"

---

## 4. 食物识别 / 图像分类

### 4.1 主要用途
- 拍照识别食物种类
- 估算份量和热量

### 4.2 推荐服务商

**方案A: 百度 AI - 菜品识别**
```
POST https://aip.baidubce.com/rest/2.0/image-classify/v2/dish
```
- 返回: 菜品名称 + 置信度
- 支持 9000+ 菜品

**方案B: LLM 多模态（GPT-4V / Claude Vision）**
- 直接传入图片让 AI 识别和估算
- 优势: 更灵活，可以理解复杂场景
- 劣势: 成本高、延迟大

**方案C: 自建模型 + 食物数据库**
- 使用 YOLO/ResNet 训练食物分类模型
- 结合食物数据库查询营养成分

### 4.3 食物营养数据来源
1. **中国食物成分表** (第6版) - 中国CDC
2. **USDA FoodData Central** - 美国农业部
3. **薄荷健康 / FatSecret 数据** - 商用需授权
4. 自建维护的常见中国菜品数据库

---

## 5. 对象存储（图片/文件）

### 5.1 推荐方案

**方案A: 阿里云 OSS**
```env
ALIYUN_OSS_ENDPOINT=oss-cn-beijing.aliyuncs.com
ALIYUN_OSS_BUCKET=mom-app-files
ALIYUN_OSS_ACCESS_KEY_ID=xxxxx
ALIYUN_OSS_ACCESS_KEY_SECRET=xxxxx
```

**方案B: AWS S3**
```env
AWS_S3_BUCKET=mom-app-files
AWS_S3_REGION=ap-northeast-1
AWS_ACCESS_KEY_ID=xxxxx
AWS_SECRET_ACCESS_KEY=xxxxx
```

**方案C: MinIO (自建)**
- 适合: 私有化部署

### 5.2 文件组织结构
```
mom-app-files/
├── avatars/{user_id}/{timestamp}.jpg
├── reports/{user_id}/{report_id}/{timestamp}.jpg
├── foods/{user_id}/{timestamp}.jpg
└── maternity/{center_id}/{image_name}.jpg
```

### 5.3 上传流程（预签名 URL）
```
1. 前端请求: POST /upload/presign
   → 后端生成 presigned PUT URL (有效期5分钟)

2. 前端直接上传到 OSS/S3:
   PUT {presigned_url}
   Body: file binary

3. 前端通知后端上传完成:
   POST /upload/confirm
   Body: { key, type, size }
```

### 5.4 图片处理
- CDN 加速
- 缩略图: `?x-oss-process=image/resize,w_200`
- 图片压缩: 前端上传前压缩到 1080p 以内

---

## 6. 消息推送

### 6.1 微信小程序订阅消息
```env
WECHAT_TEMPLATE_CHECKUP_REMINDER=xxx  # 产检提醒模板ID
WECHAT_TEMPLATE_HEALTH_ALERT=xxx      # 健康异常提醒模板ID
WECHAT_TEMPLATE_ACHIEVEMENT=xxx       # 成就解锁模板ID
```

**注意:** 用户需要手动订阅，每次订阅消耗一次发送额度。建议在关键场景引导用户订阅。

### 6.2 APP 推送 (如果有原生APP)
- **iOS**: APNs (Apple Push Notification Service)
- **Android**: FCM (Firebase Cloud Messaging) / 厂商通道

### 6.3 推送调度
```
定时任务 (每分钟):
1. 查询 checkup_reminders 表: remind_at <= NOW() AND enabled AND NOT sent
2. 发送微信订阅消息
3. 标记已发送
4. 记录发送结果

血压/血糖异常实时推送:
1. 记录保存时评估
2. 如果触发告警条件，立即推送
```

---

## 7. 支付服务

### 7.1 微信支付
```env
WECHAT_MCH_ID=xxxxx           # 商户号
WECHAT_MCH_API_KEY=xxxxx      # API密钥
WECHAT_MCH_CERT_PATH=/path/to/cert.pem
WECHAT_MCH_KEY_PATH=/path/to/key.pem
```

### 7.2 支付流程（月子服务预约定金）
```
1. POST /maternity/bookings → 创建订单
2. 后端调用微信统一下单 API → 获取 prepay_id
3. 返回支付参数给前端
4. 前端调起 wx.requestPayment()
5. 支付结果回调: POST /payment/wechat/notify
6. 更新订单状态: pending_payment → confirmed
```

### 7.3 退款流程
```
1. 用户取消预约（入住前7天）
2. 后端调用微信退款 API
3. 退款成功 → 更新订单状态: refunded
```

---

## 8. 地图 / 定位服务

### 8.1 用途
- 月子中心距离计算
- 附近医院搜索

### 8.2 推荐方案

**腾讯地图 (微信生态推荐)**
```env
TENCENT_MAP_KEY=xxxxx
```
- 逆地理编码: 坐标 → 城市名
- 距离计算: 两点间直线/导航距离
- 地点搜索: 搜索附近月子中心/医院

**高德地图 (替代方案)**
```env
AMAP_KEY=xxxxx
```

---

## 9. 日志 / 监控

### 9.1 应用日志
- **ELK Stack**: Elasticsearch + Logstash + Kibana
- **阿里云 SLS**: 日志服务

### 9.2 应用性能监控
- **Prometheus + Grafana**: 指标监控
- **Sentry**: 错误追踪

### 9.3 关键监控指标
| 指标 | 阈值 | 告警方式 |
|------|------|----------|
| API 响应时间 P99 | > 2s | 飞书/钉钉 |
| AI 接口超时率 | > 5% | 飞书/钉钉 |
| OCR 识别失败率 | > 10% | 飞书/钉钉 |
| 数据库连接池使用率 | > 80% | 飞书/钉钉 |
| 每日活跃用户 | 下降 > 20% | 邮件 |

---

## 10. 环境变量汇总

```env
# 应用
APP_PORT=8080
APP_ENV=production
JWT_SECRET=your-jwt-secret-min-32-chars
JWT_ACCESS_EXPIRY=2h
JWT_REFRESH_EXPIRY=30d

# 数据库
DATABASE_URL=postgresql://user:pass@host:5432/mom_db?sslmode=require

# Redis
REDIS_URL=redis://host:6379/0

# 微信
WECHAT_APP_ID=
WECHAT_APP_SECRET=
WECHAT_MCH_ID=
WECHAT_MCH_API_KEY=

# AI 服务
ANTHROPIC_API_KEY=
ANTHROPIC_MODEL=claude-sonnet-4-20250514

# OCR
BAIDU_OCR_APP_ID=
BAIDU_OCR_API_KEY=
BAIDU_OCR_SECRET_KEY=

# 对象存储
ALIYUN_OSS_ENDPOINT=
ALIYUN_OSS_BUCKET=
ALIYUN_OSS_ACCESS_KEY_ID=
ALIYUN_OSS_ACCESS_KEY_SECRET=

# 地图
TENCENT_MAP_KEY=

# 推送模板
WECHAT_TEMPLATE_CHECKUP_REMINDER=
WECHAT_TEMPLATE_HEALTH_ALERT=
WECHAT_TEMPLATE_ACHIEVEMENT=
```

---

## 安全注意事项

1. **所有密钥通过环境变量注入**，禁止硬编码
2. **API Key 加密存储**，使用 Vault 或 KMS
3. **OCR/AI 接口限流**: 每用户每分钟最多 10 次
4. **图片上传校验**: 文件类型、大小、内容安全检测
5. **微信支付回调验签**: 必须验证签名防止伪造
6. **健康数据加密**: 血压、血糖等敏感数据在数据库层面加密（AES-256）
7. **日志脱敏**: 日志中不记录用户手机号、身份证等 PII 信息
