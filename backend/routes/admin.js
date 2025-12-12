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
