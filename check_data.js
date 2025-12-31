const { Neighborhood, Course, Teacher } = require('./backend/models');

async function checkData() {
  try {
    // 检查neighborhood数据
    const neighborhoods = await Neighborhood.findAll();
    console.log('=== 当前社区数据 ===');
    if (neighborhoods.length === 0) {
      console.log('❌ 没有社区数据');
    } else {
      neighborhoods.forEach(n => {
        console.log(`✅ ${n.neighborhood_id}: ${n.name} - ${n.address}`);
      });
    }

    // 检查课程数据
    const courses = await Course.findAll();
    console.log('\n=== 当前课程数据 ===');
    if (courses.length === 0) {
      console.log('❌ 没有课程数据');
    } else {
      courses.forEach(c => {
        console.log(`✅ ${c.course_id}: ${c.name} (社区ID: ${c.neighborhood_id || '未设置'})`);
      });
    }

  } catch (error) {
    console.error('错误:', error);
  }
}

checkData();