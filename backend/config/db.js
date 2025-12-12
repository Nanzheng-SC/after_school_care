const { Sequelize } = require('sequelize');
// 明确指定.env文件路径并启用覆盖模式
require('dotenv').config({
  path: './.env',
  override: true
});

// 调试：打印环境变量
console.log('Environment variables loaded from .env:');
console.log('DB_NAME:', process.env.DB_NAME);
console.log('DB_USER:', process.env.DB_USER);
console.log('DB_PASSWORD:', process.env.DB_PASSWORD);
console.log('DB_HOST:', process.env.DB_HOST);
console.log('DB_PORT:', process.env.DB_PORT);
console.log('DB_DIALECT:', process.env.DB_DIALECT);

const sequelize = new Sequelize(
  process.env.DB_NAME || 'after_school_care',
  process.env.DB_USER || 'root',
  process.env.DB_PASSWORD || null, // 空密码时安全处理
  {
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 3306,
    dialect: process.env.DB_DIALECT || 'mysql',
    define: {
      timestamps: true,
      underscored: true,
    },
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000
    },
    logging: false 
  }
);

// 测试数据库连接
async function testConnection() {
  try {
    await sequelize.authenticate();
    console.log('✅ 数据库连接成功');
  } catch (error) {
    console.error('❌ 数据库连接失败:', error.message);
    process.exit(1);
  }
}

testConnection();

module.exports = sequelize;
