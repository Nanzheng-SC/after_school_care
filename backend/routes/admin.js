const express = require('express');
const router = express.Router();
const sequelize = require('../config/db');
const { Teacher } = require('../models');

// 管理员查看所有评价
// GET /api/admin/evaluations
router.get('/evaluations', async (req, res) => {
  const list = await sequelize.query(
    `
    SELECT e.*, p.name AS parent_name, t.name AS teacher_name
    FROM evaluation e
    JOIN parent p ON e.parent_id = p.parent_id
    JOIN teacher t ON e.teacher_id = t.teacher_id
    `,
    { type: sequelize.QueryTypes.SELECT }
  );

  res.json(list);
});

// 管理员查看所有教师
// GET /api/admin/teachers
router.get('/teachers', async (req, res) => {
  const list = await Teacher.findAll();
  res.json(list);
});

module.exports = router;
const { Evaluation } = require('../models');

/**
 * 管理员删除评价
 * DELETE /api/admin/evaluation/:evaluationId
 */
router.delete('/evaluation/:evaluationId', async (req, res) => {
  const { evaluationId } = req.params;

  try {
    const count = await Evaluation.destroy({
      where: { evaluation_id: evaluationId }
    });

    if (count === 0) {
      return res.status(404).json({
        message: '评价不存在'
      });
    }

    // 删除后，数据库触发器会自动重新计算教师评分
    res.json({
      message: '评价删除成功'
    });
  } catch (err) {
    res.status(500).json({
      message: '删除评价失败',
      error: err.message
    });
  }
});
const { Course } = require('../models');

/**
 * 新增课程（管理员）
 * POST /api/admin/course
 */
router.post('/course', async (req, res) => {
  try {
    const course = await Course.create(req.body);
    res.json({
      message: '课程创建成功',
      course
    });
  } catch (err) {
    res.status(500).json({
      message: '课程创建失败',
      error: err.message
    });
  }
});

/**
 * 修改课程（管理员）
 * PUT /api/admin/course/:courseId
 */
router.put('/course/:courseId', async (req, res) => {
  try {
    const { courseId } = req.params;
    const [count] = await Course.update(req.body, {
      where: { course_id: courseId }
    });

    if (count === 0) {
      return res.status(404).json({ message: '课程不存在' });
    }

    res.json({ message: '课程更新成功' });
  } catch (err) {
    res.status(500).json({
      message: '课程更新失败',
      error: err.message
    });
  }
});

/**
 * 删除课程（管理员）
 * DELETE /api/admin/course/:courseId
 */
router.delete('/course/:courseId', async (req, res) => {
  try {
    const { courseId } = req.params;
    const count = await Course.destroy({
      where: { course_id: courseId }
    });

    if (count === 0) {
      return res.status(404).json({ message: '课程不存在' });
    }

    res.json({ message: '课程删除成功' });
  } catch (err) {
    res.status(500).json({
      message: '课程删除失败',
      error: err.message
    });
  }
});

module.exports = router;
