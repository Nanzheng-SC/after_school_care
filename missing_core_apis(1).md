# 核心缺失API列表

## 1. 用户认证API

| 方法 | API路径 | 功能描述 | 优先级 |
|------|---------|---------|--------|
| POST | `/api/auth/login` | 用户登录（支持家长ID/教师ID/管理员） | 高 |
| POST | `/api/auth/logout` | 用户登出 | 中 |
| GET | `/api/auth/userInfo` | 获取当前登录用户信息 | 高 |

## 2. 学生匹配API

| 方法 | API路径 | 功能描述 | 优先级 |
|------|---------|---------|--------|
| GET | `/api/match/recommendations?studentId={studentId}` | 根据学生ID获取课程匹配推荐 | 高 |
| POST | `/api/match/evaluate?studentId={studentId}&courseId={courseId}` | 评估学生与课程的匹配度 | 高 |
| GET | `/api/teacher/student-matches` | 获取教师待匹配学生列表 | 高 |

## 3. 社区管理API

| 方法 | API路径 | 功能描述 | 优先级 |
|------|---------|---------|--------|
| GET | `/api/admin/community` | 获取社区列表 | 中 |
| POST | `/api/admin/community` | 创建社区 | 中 |
| PUT | `/api/admin/community/{communityId}` | 更新社区信息 | 中 |
| DELETE | `/api/admin/community/{communityId}` | 删除社区 | 中 |

## 4. 课程评价API

| 方法 | API路径 | 功能描述 | 优先级 |
|------|---------|---------|--------|
| GET | `/api/evaluation/{evaluationId}` | 获取评价详情 | 高 |
| GET | `/api/course/{courseId}/evaluations` | 获取课程的所有评价 | 高 |
| POST | `/api/evaluation` | 提交评价 | 高 |

## 5. 教师详情API

| 方法 | API路径 | 功能描述 | 优先级 |
|------|---------|---------|--------|
| GET | `/api/teacher/{teacherId}` | 获取教师详细信息 | 高 |
| GET | `/api/teacher/{teacherId}/courses` | 获取教师的课程列表 | 高 |
| GET | `/api/teacher/{teacherId}/evaluations` | 获取教师的评价统计 | 高 |

## 6. 支付和退款流程API

| 方法 | API路径 | 功能描述 | 优先级 |
|------|---------|---------|--------|
| POST | `/api/payment/confirm` | 确认支付 | 高 |
| GET | `/api/payment/{paymentId}` | 获取支付详情 | 高 |
| POST | `/api/refund` | 提交退款申请 | 高 |
| GET | `/api/refund/{refundId}` | 获取退款状态 | 高 |
| PUT | `/api/admin/refund/{refundId}/approve` | 管理员批准退款 | 高 |

## 7. 管理员功能API

| 方法 | API路径 | 功能描述 | 优先级 |
|------|---------|---------|--------|
| GET | `/api/admin/dashboard/stats` | 获取管理员仪表盘统计数据 | 高 |
| GET | `/api/admin/users` | 获取用户列表 | 高 |
| GET | `/api/admin/courses` | 获取课程管理列表 | 高 |
| GET | `/api/admin/enrollments` | 获取报名管理列表 | 高 |

## 8. 学生/子女API

| 方法 | API路径 | 功能描述 | 优先级 |
|------|---------|---------|--------|
| GET | `/api/youth/{studentId}` | 获取学生详细信息 | 高 |
| POST | `/api/youth` | 添加子女信息 | 中 |
| PUT | `/api/youth/{studentId}` | 更新子女信息 | 中 |

## 优先级说明

- **高优先级**：直接影响核心功能（如登录、学生匹配、支付流程），必须优先实现
- **中优先级**：影响辅助功能（如社区管理、用户登出），可后续实现

## 备注

1. 所有API应遵循项目现有API设计规范
2. 响应格式应保持一致，包含必要的错误处理
3. 优先级排序基于功能重要性和用户需求