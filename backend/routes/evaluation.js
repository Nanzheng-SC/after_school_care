const express = require('express');
const router = express.Router();
const { Evaluation } = require('../models');

/**
 * 提交评价（家长端）
 * POST /api/evaluation
 * body: { evaluation_id, parent_id, teacher_id, course_id, eval_type, score }
 */
router.post('/', async (req, res) => {
  const {
    evaluation_id,
    parent_id,
    teacher_id,
    course_id,
    eval_type,
    score
  } = req.body;

  try {
    const evaluation = await Evaluation.create({
      evaluation_id,
      parent_id,
      teacher_id,
      course_id,
      eval_time: new Date(),
      eval_type,
      score
    });

    // 数据库触发器会自动更新 teacher.avg_score
    res.status(201).json({
      message: '评价提交成功',
      evaluation
    });
  } catch (err) {
    res.status(500).json({
      message: '评价提交失败',
      error: err.message
    });
  }
});

module.exports = router;
