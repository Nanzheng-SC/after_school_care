const express = require('express');
const router = express.Router();
const sequelize = require('../config/db');
const { Parent, Youth } = require('../models');

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

module.exports = router;