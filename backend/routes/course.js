const express = require('express');
const router = express.Router();
const { Course } = require('../models');

/**
 * 查询所有课程（家长 / 教师 / 管理员）
 * GET /api/course
 */
router.get('/', async (req, res) => {
  try {
    const courses = await Course.findAll();
    res.json(courses);
  } catch (err) {
    res.status(500).json({
      message: '查询课程失败',
      error: err.message
    });
  }
});

/**
 * 查询单个课程详情（可选）
 * GET /api/course/:courseId
 */
router.get('/:courseId', async (req, res) => {
  try {
    const { courseId } = req.params;
    const course = await Course.findByPk(courseId);

    if (!course) {
      return res.status(404).json({ message: '课程不存在' });
    }

    res.json(course);
  } catch (err) {
    res.status(500).json({
      message: '查询课程失败',
      error: err.message
    });
  }
});

module.exports = router;
