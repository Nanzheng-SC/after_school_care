const express = require('express');
const router = express.Router();
const sequelize = require('../config/db');
const { Youth } = require('../models');

// 家长查看自己的孩子
// GET /api/youth?familyId=F001
router.get('/', async (req, res) => {
  const { familyId } = req.query;

  const list = await Youth.findAll({
    where: { family_id: familyId }
  });

  res.json(list);
});

// 查看某个青少年的匹配老师
// GET /api/youth/:youthId/matching
router.get('/:youthId/matching', async (req, res) => {
  const { youthId } = req.params;

  const result = await sequelize.query(
    `
    SELECT tm.*, t.name AS teacher_name, t.specialty, t.avg_score
    FROM teacher_matching tm
    JOIN teacher t ON tm.teacher_id = t.teacher_id
    WHERE tm.youth_id = ?
    `,
    {
      replacements: [youthId],
      type: sequelize.QueryTypes.SELECT
    }
  );

  res.json(result);
});

module.exports = router;
