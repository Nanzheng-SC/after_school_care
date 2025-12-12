const express = require('express');
const router = express.Router();
const { Teacher, Evaluation } = require('../models');

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

module.exports = router;
