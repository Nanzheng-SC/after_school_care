require('dotenv').config();

const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const sequelize = require('./config/db');

// 路由
const authRoutes = require('./routes/auth');
const youthRoutes = require('./routes/youth');
const teacherRoutes = require('./routes/teacher');
const adminRoutes = require('./routes/admin');
const evaluationRoutes = require('./routes/evaluation');
const courseRoutes = require('./routes/course');
const parentRoutes = require('./routes/parent');


const app = express();
const PORT = process.env.PORT || 3000;

// 中间件
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// 健康检查
app.get('/', (req, res) => {
  res.status(200).json({
    message: '青少年课后托管系统后端 API',
    status: 'running'
  });
});

// 注册路由
app.use('/api/auth', authRoutes);
app.use('/api/youth', youthRoutes);
app.use('/api/teacher', teacherRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/evaluation', evaluationRoutes);
app.use('/api/course', courseRoutes);
app.use('/api/parent', parentRoutes);

// 404 处理
app.use((req, res, next) => {
  const error = new Error('Not Found');
  error.status = 404;
  next(error);
});

// 全局错误处理
app.use((error, req, res, next) => {
  res.status(error.status || 500).json({
    error: { message: error.message }
  });
});

// 同步数据库并启动服务
async function startServer() {
  try {
    await sequelize.sync({ force: false });
    console.log('数据库模型同步成功');

    app.listen(PORT, () => {
      console.log(`服务器运行在 http://localhost:${PORT}`);
    });
  } catch (err) {
    console.error('服务器启动失败:', err);
    process.exit(1);
  }
}

startServer();

module.exports = app;
