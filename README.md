# 青少年课后托管系统后端API

一个基于Node.js + Express + Sequelize构建的青少年课后托管系统后端API，提供完整的用户管理、课程管理和系统功能。

## 📋 目录

- [项目简介](#项目简介)
- [技术栈](#技术栈)
- [项目结构](#项目结构)
- [环境要求](#环境要求)
- [安装步骤](#安装步骤)
- [配置说明](#配置说明)
- [运行项目](#运行项目)
- [API接口](#api接口)
- [数据库设计](#数据库设计)
- [开发注意事项](#开发注意事项)
- [许可证](#许可证)

## 📖 项目简介

本项目是青少年课后托管系统的后端服务，提供以下核心功能：

- 家长/教师/管理员用户认证
- 青少年信息管理与老师匹配
- 课程管理
- 教师评价系统
- 系统健康检查

## 🛠️ 技术栈

- **Node.js** - JavaScript运行环境
- **Express** - 轻量级Web框架
- **Sequelize** - ORM数据库框架
- **MySQL** - 关系型数据库
- **dotenv** - 环境变量管理
- **cors** - 跨域资源共享
- **body-parser** - 请求体解析

## 📁 项目结构

```
.
├── backend/
│   ├── app.js                    # 应用入口文件
│   ├── package.json              # 项目配置与依赖
│   ├── package-lock.json         # 依赖版本锁定
│   ├── .env                      # 环境变量配置（实际位置）
│   ├── config/
│   │   └── db.js                 # 数据库配置
│   ├── models/
│   │   ├── index.js              # 模型关系管理
│   │   ├── Parent.js             # 家长模型
│   │   ├── Youth.js              # 青少年模型
│   │   ├── Teacher.js            # 教师模型
│   │   ├── Course.js             # 课程模型
│   │   └── Evaluation.js         # 评价模型
│   └── routes/
│       ├── auth.js               # 认证路由
│       ├── youth.js              # 青少年管理路由
│       ├── teacher.js            # 教师管理路由
│       ├── admin.js              # 管理员路由
│       └── evaluation.js         # 评价管理路由
├── .gitignore                    # Git忽略文件
└── README.md                     # 项目说明文档
```

## 📋 环境要求

- Node.js >= 16.x
- MySQL >= 5.7
- npm >= 8.x 或 yarn >= 1.22.x

## 🚀 安装步骤

1. **克隆项目**

   ```bash
   git clone <仓库地址>
   cd project_processing
   ```

2. **安装依赖**

   ```bash
   cd backend
   npm install
   ```

## ⚙️ 配置说明

1. **创建环境变量文件**

   在`backend`目录下创建`.env`文件，并添加以下配置：

   ```env
   # 服务器配置
   PORT=3000

   # 数据库配置
   DB_HOST=localhost
   DB_PORT=3306
   DB_NAME=after_school_care
   DB_USER=root
   DB_PASSWORD=
   DB_DIALECT=mysql
   ```

   **配置说明：**
   - `PORT` - 服务器端口，默认为3000
   - `DB_HOST` - 数据库主机地址
   - `DB_PORT` - 数据库端口，默认为3306
   - `DB_NAME` - 数据库名称
   - `DB_USER` - 数据库用户名
   - `DB_PASSWORD` - 数据库密码
   - `DB_DIALECT` - 数据库方言，默认为mysql

2. **创建数据库**

   在MySQL中创建与`.env`文件中`DB_NAME`同名的数据库：

   ```sql
   CREATE DATABASE after_school_care;
   ```

## 📦 运行项目

1. **开发环境运行**

   ```bash
   cd backend
   node app.js
   ```

   或使用npm脚本：

   ```bash
   npm start
   ```

2. **验证服务**

   访问以下地址验证服务是否正常运行：
   - 健康检查：http://localhost:3000/
   - API地址：http://localhost:3000/api

## 📡 API接口

### 健康检查

- **GET /** - 系统健康检查
  - 返回：`{"message":"青少年课后托管系统后端API","status":"running"}`

### 认证接口

- **POST /api/auth/login** - 统一登录接口
  - 请求体：`{"role":"parent|teacher|admin","account":"账号","password":"密码"}`
  - 返回：用户信息和角色

### 青少年管理

- **GET /api/youth** - 家长查看自己的孩子列表
  - 参数：`familyId`（家庭ID）
  - 返回：青少年信息列表

- **GET /api/youth/:youthId/matching** - 查看青少年的匹配老师
  - 参数：`youthId`（青少年ID）
  - 返回：匹配的老师列表

### 教师管理

- **GET /api/teacher/:teacherId** - 查看教师个人信息
  - 参数：`teacherId`（教师ID）
  - 返回：教师详细信息

- **GET /api/teacher/:teacherId/evaluations** - 查看教师的评价列表
  - 参数：`teacherId`（教师ID）
  - 返回：评价信息列表

### 管理员接口

- **GET /api/admin/evaluations** - 查看所有评价
  - 返回：所有评价信息列表（包含家长和教师名称）

- **GET /api/admin/teachers** - 查看所有教师
  - 返回：所有教师信息列表

### 评价接口

- **POST /api/evaluation** - 提交评价（家长端）
  - 请求体：`{"evaluation_id":"评价ID","parent_id":"家长ID","teacher_id":"教师ID","course_id":"课程ID","eval_type":"评价类型","score":"评分"}`
  - 返回：评价信息

## 🗄️ 数据库设计

### 家长表 (Parent)

| 字段名 | 类型 | 说明 |
|--------|------|------|
| parent_id | VARCHAR | 家长ID（主键） |
| family_id | VARCHAR | 家庭ID |
| name | VARCHAR | 家长姓名 |
| phone | VARCHAR | 手机号码 |
| payment_account | VARCHAR | 支付账号 |
| register_time | DATETIME | 注册时间 |
| account_status | VARCHAR | 账号状态 |

### 青少年表 (Youth)

| 字段名 | 类型 | 说明 |
|--------|------|------|
| youth_id | VARCHAR | 青少年ID（主键） |
| family_id | VARCHAR | 家庭ID（外键） |
| name | VARCHAR | 姓名 |
| age | INT | 年龄 |
| health_note | VARCHAR | 健康备注 |
| interest | VARCHAR | 兴趣爱好 |
| learning_style | VARCHAR | 学习风格 |

### 教师表 (Teacher)

| 字段名 | 类型 | 说明 |
|--------|------|------|
| teacher_id | VARCHAR | 教师ID（主键） |
| neighborhood_id | VARCHAR | 社区ID |
| name | VARCHAR | 教师姓名 |
| certificate | VARCHAR | 资质证书 |
| specialty | VARCHAR | 专业特长 |
| teaching_style | VARCHAR | 教学风格 |
| available_time | VARCHAR | 可用时间 |
| avg_score | DECIMAL | 平均评分 |

### 课程表 (Course)

| 字段名 | 类型 | 说明 |
|--------|------|------|
| course_id | VARCHAR | 课程ID（主键） |
| teacher_id | VARCHAR | 教师ID（外键） |
| neighborhood_id | VARCHAR | 社区ID |
| name | VARCHAR | 课程名称 |
| type | VARCHAR | 课程类型 |
| age_range | VARCHAR | 适合年龄范围 |
| schedule | VARCHAR | 课程安排 |

### 评价表 (Evaluation)

| 字段名 | 类型 | 说明 |
|--------|------|------|
| evaluation_id | VARCHAR | 评价ID（主键） |
| parent_id | VARCHAR | 家长ID（外键） |
| teacher_id | VARCHAR | 教师ID（外键） |
| course_id | VARCHAR | 课程ID（外键） |
| eval_time | DATETIME | 评价时间 |
| eval_type | VARCHAR | 评价类型 |
| score | INT | 评分 |

## 💡 开发注意事项

1. **数据库连接**
   - 确保MySQL服务正常运行
   - 确保`.env`文件中的数据库配置正确

2. **环境变量**
   - 不要将`.env`文件提交到版本控制
   - 根据不同环境创建对应的`.env`文件

3. **代码规范**
   - 遵循JavaScript代码规范
   - 保持代码简洁和可读性

4. **错误处理**
   - 对所有API请求进行适当的错误处理
   - 返回清晰的错误信息

5. **安全性**
   - 对敏感数据进行加密处理
   - 实现适当的认证和授权机制

## 📄 许可证

本项目采用MIT许可证 - 查看[LICENSE](LICENSE)文件了解详情。

## 🤝 贡献

欢迎提交Issue和Pull Request来改进这个项目！

## 📞 联系方式

如有问题或建议，请通过以下方式联系：

- 邮箱：[your-email@example.com]
- GitHub：[your-github-username]

---

**版本：** 1.0.0
**最后更新：** 2025-12-12