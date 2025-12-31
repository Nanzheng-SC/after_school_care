const express = require('express');
const router = express.Router();

const { Parent, Teacher } = require('../models');

/**
 * 登录接口
 * POST /api/auth/login
 * body: { role, account, password }
 */
router.post('/login', async (req, res) => {
  const { role, account } = req.body;

  try {
    // 家长登录（用家长ID）
    if (role === 'parent') {
      const parent = await Parent.findOne({
        where: { parent_id: account }
      });

      if (!parent) {
        return res.status(401).json({ message: '家长不存在' });
      }

      return res.json({
        role: 'parent',
        user: parent
      });
    }

    // 教师登录（用 teacher_id）
    if (role === 'teacher') {
      const teacher = await Teacher.findOne({
        where: { teacher_id: account }
      });

      if (!teacher) {
        return res.status(401).json({ message: '教师不存在' });
      }

      return res.json({
        role: 'teacher',
        user: teacher
      });
    }

    // 管理员登录（示例写死）
    if (role === 'admin') {
      if (account === 'admin') {
        return res.json({
          role: 'admin',
          user: { name: '管理员' }
        });
      }
      return res.status(401).json({ message: '管理员账号错误' });
    }

    res.status(400).json({ message: '角色不合法' });
  } catch (err) {
    res.status(500).json({ message: '服务器错误' });
  }
});

module.exports = router;
