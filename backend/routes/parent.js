const express = require('express');
const router = express.Router();
const sequelize = require('../config/db');
const { Parent, Youth, Neighborhood, Course, Teacher, CourseSelection } = require('../models');

// 家长查看个人信息
// GET /api/parent/:parentId
router.get('/:parentId', async (req, res) => {
  try {
    const { parentId } = req.params;
    const parent = await Parent.findByPk(parentId);
    if (!parent) {
      return res.status(404).json({ message: '家长不存在' });
    }
    res.json(parent);
  } catch (error) {
    res.status(500).json({ message: '获取家长信息失败', error: error.message });
  }
});

// 家长查看名下子女
// GET /api/parent/:parentId/youths
router.get('/:parentId/youths', async (req, res) => {
    try {
      const { parentId } = req.params;
      const parent = await Parent.findByPk(parentId, {
        include: [{
          model: Youth,
          as: 'Youths'
        }]
      });

    if (!parent) {
      return res.status(404).json({ message: '家长不存在' });
    }

    res.json(parent.Youths);
  } catch (error) {
    res.status(500).json({ message: '获取子女列表失败', error: error.message });
  }
});

// 家长新增子女
// POST /api/parent/:parentId/youths
router.post('/:parentId/youths', async (req, res) => {
  try {
    const { parentId } = req.params;
    const youthData = req.body;
    
    // 验证家长是否存在
    const parent = await Parent.findByPk(parentId);
    if (!parent) {
      return res.status(404).json({ message: '家长不存在' });
    }
    
    // 设置子女的家庭ID为家长的家庭ID
    youthData.family_id = parent.family_id;
    
    // 创建新子女
    const newYouth = await Youth.create(youthData);
    res.status(201).json({ message: '子女创建成功', youth: newYouth });
  } catch (error) {
    res.status(400).json({ message: '创建子女失败', error: error.message });
  }
});

// 家长修改子女信息
// PUT /api/parent/:parentId/youths/:youthId
router.put('/:parentId/youths/:youthId', async (req, res) => {
  try {
    const { parentId, youthId } = req.params;
    const youthData = req.body;
    
    // 验证家长是否存在
    const parent = await Parent.findByPk(parentId);
    if (!parent) {
      return res.status(404).json({ message: '家长不存在' });
    }
    
    // 验证子女是否存在且属于该家长的家庭
    const youth = await Youth.findOne({
      where: {
        youth_id: youthId,
        family_id: parent.family_id
      }
    });
    
    if (!youth) {
      return res.status(404).json({ message: '子女不存在或不属于该家庭' });
    }
    
    // 更新子女信息
    const [updated] = await Youth.update(youthData, {
      where: {
        youth_id: youthId,
        family_id: parent.family_id
      }
    });
    
    if (updated) {
      const updatedYouth = await Youth.findByPk(youthId);
      res.json({ message: '子女信息更新成功', youth: updatedYouth });
    } else {
      res.status(404).json({ message: '更新失败，子女不存在' });
    }
  } catch (error) {
    res.status(400).json({ message: '更新子女失败', error: error.message });
  }
});

// 家长删除子女
// DELETE /api/parent/:parentId/youths/:youthId
router.delete('/:parentId/youths/:youthId', async (req, res) => {
  try {
    const { parentId, youthId } = req.params;
    
    // 验证家长是否存在
    const parent = await Parent.findByPk(parentId);
    if (!parent) {
      return res.status(404).json({ message: '家长不存在' });
    }
    
    // 验证子女是否存在且属于该家长的家庭
    const youth = await Youth.findOne({
      where: {
        youth_id: youthId,
        family_id: parent.family_id
      }
    });
    
    if (!youth) {
      return res.status(404).json({ message: '子女不存在或不属于该家庭' });
    }
    
    // 删除子女
    const deleted = await Youth.destroy({
      where: {
        youth_id: youthId,
        family_id: parent.family_id
      }
    });
    
    if (deleted) {
      res.json({ message: '子女删除成功' });
    } else {
      res.status(404).json({ message: '删除失败，子女不存在' });
    }
  } catch (error) {
    res.status(500).json({ message: '删除子女失败', error: error.message });
  }
});

// 家长查看所有社区
// GET /api/parent/:parentId/neighborhoods
router.get('/:parentId/neighborhoods', async (req, res) => {
  try {
    const { parentId } = req.params;
    // 验证家长是否存在
    const parent = await Parent.findByPk(parentId);
    if (!parent) {
      return res.status(404).json({ message: '家长不存在' });
    }
    
    // 获取所有社区
    const neighborhoods = await Neighborhood.findAll();
    res.json(neighborhoods);
  } catch (error) {
    res.status(500).json({ message: '获取社区列表失败', error: error.message });
  }
});

// 计算课程与孩子的匹配度
function calculateMatchPercentage(courseAgeRange, childAge) {
  // 如果课程年龄范围为空或孩子年龄为空，返回50%
  if (!courseAgeRange || !childAge) return 50;
  
  // 解析课程年龄范围（例如 "4-6" → [4, 6]）
  const ageRange = courseAgeRange.split('-').map(Number);
  if (ageRange.length !== 2) return 50;
  
  const [minAge, maxAge] = ageRange;
  
  // 完全匹配
  if (childAge >= minAge && childAge <= maxAge) {
    return 100;
  }
  // 年龄低于范围
  else if (childAge < minAge) {
    // 年龄差距不超过2岁，给予部分匹配度
    const ageDiff = minAge - childAge;
    if (ageDiff <= 2) {
      return 100 - (ageDiff * 15); // 每差1岁减少15%
    }
    return 0;
  }
  // 年龄高于范围
  else {
    // 年龄差距不超过2岁，给予部分匹配度
    const ageDiff = childAge - maxAge;
    if (ageDiff <= 2) {
      return 100 - (ageDiff * 15); // 每差1岁减少15%
    }
    return 0;
  }
}

// 家长查看所有课程
// GET /api/parent/:parentId/courses
router.get('/:parentId/courses', async (req, res) => {
  try {
    const { parentId } = req.params;
    
    // 验证家长是否存在并获取其孩子信息
    const parent = await Parent.findByPk(parentId, {
      include: [{ model: Youth, as: 'Youths' }]
    });
    
    if (!parent) {
      return res.status(404).json({ message: '家长不存在' });
    }
    
    // 获取所有课程，包含教师和地点信息
    const courses = await Course.findAll({
      include: [
        { model: Teacher, attributes: ['name'], as: 'Teacher' },
        { model: Neighborhood, attributes: ['address'], as: 'Neighborhood' }
      ]
    });
    
    // 获取孩子的年龄（如果有多个孩子，取第一个孩子的年龄）
    const childAge = parent.Youths && parent.Youths.length > 0 ? parent.Youths[0].age : null;
    
    // 转换数据格式，添加teacher_name、location和matching_degree字段
    const formattedCourses = courses.map(course => {
      const matchingDegree = calculateMatchPercentage(course.age_range, childAge);
      
      return {
        ...course.toJSON(),
        teacher_name: course.Teacher ? course.Teacher.name : '未知老师',
        location: course.Neighborhood ? course.Neighborhood.address : '未知地点',
        matching_degree: matchingDegree
      };
    });
    
    // 按匹配度降序排列
    formattedCourses.sort((a, b) => b.matching_degree - a.matching_degree);
    
    res.json(formattedCourses);
  } catch (error) {
    res.status(500).json({ message: '获取课程列表失败', error: error.message });
  }
});

// 家长为孩子报名课程
// POST /api/parent/:parentId/enroll
router.post('/:parentId/enroll', async (req, res) => {
  try {
    const { parentId } = req.params;
    const { youthId, courseId } = req.body;
    
    // 验证家长是否存在
    const parent = await Parent.findByPk(parentId);
    if (!parent) {
      return res.status(404).json({ message: '家长不存在' });
    }
    
    // 验证孩子是否存在且属于该家长的家庭
    const youth = await Youth.findOne({
      where: {
        youth_id: youthId,
        family_id: parent.family_id
      }
    });
    
    if (!youth) {
      return res.status(404).json({ message: '孩子不存在或不属于该家庭' });
    }
    
    // 验证课程是否存在
    const course = await Course.findByPk(courseId);
    if (!course) {
      return res.status(404).json({ message: '课程不存在' });
    }
    
    // 检查课程是否已满
    if (parseInt(course.current_enrollment) >= parseInt(course.capacity)) {
      return res.status(400).json({ message: '课程已满，无法报名' });
    }
    
    // 检查孩子是否已经报名该课程
    const existingEnrollment = await CourseSelection.findOne({
      where: {
        youth_id: youthId,
        course_id: courseId
      }
    });
    
    if (existingEnrollment) {
      return res.status(400).json({ message: '孩子已经报名该课程' });
    }
    
    // 使用事务确保数据一致性
    await sequelize.transaction(async (transaction) => {
      // 创建课程报名记录
      await CourseSelection.create({
        youth_id: youthId,
        course_id: courseId
      }, { transaction });
      
      // 更新课程的当前报名人数
      await Course.update(
        { current_enrollment: parseInt(course.current_enrollment) + 1 },
        { where: { course_id: courseId }, transaction }
      );
    });
    
    res.status(201).json({ message: '课程报名成功' });
  } catch (error) {
    console.error('课程报名失败:', error);
    res.status(500).json({ message: '课程报名失败', error: error.message });
  }
});

module.exports = router;