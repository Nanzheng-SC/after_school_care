const sequelize = require('./backend/config/db');
const Neighborhood = require('./backend/models/Neighborhood');

async function checkNeighborhoods() {
  try {
    await sequelize.authenticate();
    console.log('Database connection established');
    
    const neighborhoods = await Neighborhood.findAll();
    console.log('当前社区数据:');
    neighborhoods.forEach(n => {
      console.log(`- ID: ${n.neighborhood_id}, 名称: ${n.name}, 地址: ${n.address}`);
    });
    
    if (neighborhoods.length === 0) {
      console.log('没有社区数据，需要添加真实位置');
    }
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await sequelize.close();
  }
}

checkNeighborhoods();