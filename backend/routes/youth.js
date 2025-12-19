const express = require('express');
const router = express.Router();
const sequelize = require('../config/db');
const { Youth, TeacherMatching } = require('../models');

// 查看学生列表
// GET /api/youth?familyId=F001
router.get('/', async (req, res) => {
  const { familyId } = req.query;

  try {
    // 如果提供了familyId，只查询该家庭的孩子
    if (familyId) {
      const list = await Youth.findAll({
        where: { family_id: familyId }
      });
      return res.json(list);
    }

    // 否则查询所有学生
    const list = await Youth.findAll();
    res.json(list);
  } catch (error) {
    res.status(500).json({ message: '获取学生列表失败', error: error.message });
  }
});

// 查询单个学生
// GET /api/youth/:youthId
router.get('/:youthId', async (req, res) => {
  const { youthId } = req.params;

  try {
    const youth = await Youth.findByPk(youthId);
    if (!youth) {
      return res.status(404).json({ message: '学生不存在' });
    }
    res.json(youth);
  } catch (error) {
    res.status(500).json({ message: '获取学生失败', error: error.message });
  }
});

// 查看某个青少年的匹配老师
// GET /api/youth/:youthId/matching
router.get('/:youthId/matching', async (req, res) => {
  const { youthId } = req.params;

  try {
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
  } catch (error) {
    res.status(500).json({ message: '获取匹配老师失败', error: error.message });
  }
});

module.exports = router;
