const { Sequelize } = require('sequelize');
const dotenv = require('dotenv');

// 加载环境变量
dotenv.config();

// 创建数据库连接
const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    dialect: process.env.DB_DIALECT,
    logging: false
  }
);

// 定义Enrollment模型
const Enrollment = sequelize.define('Enrollment', {
  enrollment_id: {
    type: Sequelize.STRING(20),
    primaryKey: true
  },
  youth_id: {
    type: Sequelize.STRING(20),
    allowNull: false
  },
  course_id: {
    type: Sequelize.STRING(20),
    allowNull: false
  },
  enroll_time: {
    type: Sequelize.DATE,
    allowNull: false
  },
  status: {
    type: Sequelize.STRING(20),
    allowNull: false,
    defaultValue: '已报名'
  },
  remark: {
    type: Sequelize.STRING(255)
  },
  create_time: {
    type: Sequelize.DATE,
    allowNull: false,
    defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
  },
  update_time: {
    type: Sequelize.DATE,
    allowNull: false,
    defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
    onUpdate: Sequelize.literal('CURRENT_TIMESTAMP')
  }
}, {
  tableName: 'enrollment',
  timestamps: false
});

// 定义Youth模型（用于关联查询）
const Youth = sequelize.define('Youth', {
  youth_id: {
    type: Sequelize.STRING(20),
    primaryKey: true
  },
  name: {
    type: Sequelize.STRING(50),
    allowNull: false
  },
  // 其他字段可以根据需要添加
}, {
  tableName: 'youth',
  timestamps: false
});

// 定义Course模型（用于关联查询）
const Course = sequelize.define('Course', {
  course_id: {
    type: Sequelize.STRING(20),
    primaryKey: true
  },
  name: {
    type: Sequelize.STRING(50),
    allowNull: false
  },
  // 其他字段可以根据需要添加
}, {
  tableName: 'course',
  timestamps: false
});

// 建立关联
Enrollment.belongsTo(Youth, { foreignKey: 'youth_id', as: 'Youth' });
Enrollment.belongsTo(Course, { foreignKey: 'course_id', as: 'Course' });

// 查询所有报名记录及其关联的学生和课程信息
async function queryEnrollmentData() {
  try {
    // 测试数据库连接
    await sequelize.authenticate();
    console.log('✅ 数据库连接成功');
    
    // 查询所有报名记录
    const enrollments = await Enrollment.findAll({
      include: [
        { model: Youth, attributes: ['youth_id', 'name'], as: 'Youth' },
        { model: Course, attributes: ['course_id', 'name'], as: 'Course' }
      ],
      order: [['enroll_time', 'DESC']]
    });
    
    console.log('\n📋 报名记录查询结果：');
    console.log(`共查询到 ${enrollments.length} 条记录`);
    
    if (enrollments.length > 0) {
      console.log('\n详细记录：');
      enrollments.forEach((enrollment, index) => {
        const data = enrollment.toJSON();
        console.log(`\n${index + 1}. 报名ID：${data.enrollment_id}`);
        console.log(`   学生：${data.Youth?.name} (ID: ${data.youth_id})`);
        console.log(`   课程：${data.Course?.name} (ID: ${data.course_id})`);
        console.log(`   报名时间：${data.enroll_time}`);
        console.log(`   状态：${data.status}`);
        if (data.remark) {
          console.log(`   备注：${data.remark}`);
        }
      });
    }
    
    // 查询一些统计信息
    console.log('\n📊 统计信息：');
    
    // 按状态分组统计
    const statusStats = await Enrollment.findAll({
      attributes: [
        'status',
        [Sequelize.fn('COUNT', Sequelize.col('enrollment_id')), 'count']
      ],
      group: ['status']
    });
    
    console.log('\n按状态统计：');
    statusStats.forEach(stat => {
      const data = stat.toJSON();
      console.log(`   ${data.status}：${data.count} 人`);
    });
    
    // 按课程分组统计
    const courseStats = await Enrollment.findAll({
      attributes: [
        'course_id',
        [Sequelize.fn('COUNT', Sequelize.col('enrollment_id')), 'count']
      ],
      include: [
        { model: Course, attributes: ['name'], as: 'Course' }
      ],
      group: ['course_id']
    });
    
    console.log('\n按课程统计：');
    courseStats.forEach(stat => {
      const data = stat.toJSON();
      console.log(`   ${data.Course?.name || data.course_id}：${data.count} 人`);
    });
    
  } catch (error) {
    console.error('❌ 查询失败：', error.message);
    console.error(error.stack);
  } finally {
    // 关闭数据库连接
    await sequelize.close();
    console.log('\n🔌 数据库连接已关闭');
  }
}

// 执行查询
queryEnrollmentData();
