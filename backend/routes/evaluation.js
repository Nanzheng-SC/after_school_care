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
    // 数据验证
    if (!evaluation_id || !parent_id || !teacher_id || !course_id || !eval_type || score === undefined) {
      return res.status(400).json({
        message: '缺少必要字段'
      });
    }

    // 验证score是否为数字且在1-100之间
    // 确保score是数字类型且是整数
    const scoreNumber = Number(score);
    if (isNaN(scoreNumber) || !Number.isInteger(scoreNumber)) {
      return res.status(400).json({
        message: '评分必须是整数'
      });
    }
    
    if (scoreNumber < 1 || scoreNumber > 100) {
      return res.status(400).json({
        message: '评分必须是1-100之间的数字'
      });
    }

    const evaluation = await Evaluation.create({
      evaluation_id,
      parent_id,
      teacher_id,
      course_id,
      eval_time: new Date(),
      eval_type,
      score: scoreNumber
    });

    // 数据库触发器会自动更新 teacher.avg_score
    res.status(201).json({
      message: '评价提交成功',
      evaluation
    });
  } catch (err) {
    console.error('评价提交错误:', err);
    
    // 处理各种验证错误
    if (err.name === 'SequelizeDatabaseError') {
      if (err.message.includes('chk_evaluation_score')) {
        return res.status(400).json({
          message: '评分必须是1-100之间的数字'
        });
      } else if (err.message.includes('Incorrect integer value')) {
        return res.status(400).json({
          message: '评分必须是整数'
        });
      } else if (err.message.includes('Field')) {
        return res.status(400).json({
          message: '数据格式错误'
        });
      }
    } else if (err.name === 'SequelizeValidationError') {
      return res.status(400).json({
        message: '验证失败',
        error: err.errors[0].message
      });
    } else if (err.message.includes('Validation error')) {
      // 捕获通用的验证错误
      return res.status(400).json({
        message: '验证失败，请检查输入数据'
      });
    }
    
    res.status(500).json({
      message: '评价提交失败',
      error: err.message
    });
  }
});

module.exports = router;
