const express = require('express');
const router = express.Router();
const sequelize = require('../config/db');
const { Teacher, Evaluation, Course, Youth, Neighborhood } = require('../models');

// 教师查看个人信息
// GET /api/teacher/:teacherId
router.get('/:teacherId', async (req, res) => {
  const teacher = await Teacher.findByPk(req.params.teacherId);
  res.json(teacher);
});

// 教师查看自己的评价
// GET /api/teacher/:teacherId/evaluations
router.get('/:teacherId/evaluations', async (req, res) => {
  const list = await Evaluation.findAll({
    where: { teacher_id: req.params.teacherId }
  });
  res.json(list);
});

// 教师查看自己的课程
// GET /api/teacher/:teacherId/courses
router.get('/:teacherId/courses', async (req, res) => {
  try {
    const { teacherId } = req.params;
    const teacher = await Teacher.findByPk(teacherId, {
      include: [
        {
          model: Course, 
          as: 'Courses',
          include: [{ model: Neighborhood, attributes: ['address'], as: 'Neighborhood' }]
        }
      ]
    });
    if (!teacher) {
      return res.status(404).json({ message: '教师不存在' });
    }
    
    // 转换数据格式，添加location字段
    const formattedCourses = teacher.Courses.map(course => ({
      ...course.toJSON(),
      location: course.Neighborhood ? course.Neighborhood.address : '未知地点'
    }));
    
    res.json(formattedCourses);
  } catch (error) {
    res.status(500).json({ message: '获取课程失败', error: error.message });
  }
});

// 教师查看匹配的学生
// GET /api/teacher/:teacherId/student-matches
router.get('/:teacherId/student-matches', async (req, res) => {
  try {
    const { teacherId } = req.params;
    const result = await sequelize.query(
      `
      SELECT tm.*, y.name AS youth_name, y.age, y.interest
      FROM teacher_matching tm
      JOIN youth y ON tm.youth_id = y.youth_id
      WHERE tm.teacher_id = ?
      `,
      {
        replacements: [teacherId],
        type: sequelize.QueryTypes.SELECT
      }
    );
    res.json(result);
  } catch (error) {
    res.status(500).json({ message: '获取匹配学生失败', error: error.message });
  }
});

module.exports = router;
