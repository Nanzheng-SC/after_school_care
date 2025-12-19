const express = require('express');
const router = express.Router();
const sequelize = require('../config/db');
const { Teacher, Evaluation, Course, Neighborhood, Youth } = require('../models');





// 管理员查看所有学生
// GET /api/admin/youth
router.get('/youth', async (req, res) => {
  try {
    const students = await Youth.findAll();
    res.json(students);
  } catch (error) {
    res.status(500).json({ message: '获取学生列表失败', error: error.message });
  }
});

// 管理员查看单个学生
// GET /api/admin/youth/:youthId
router.get('/youth/:youthId', async (req, res) => {
  try {
    const { youthId } = req.params;
    const student = await Youth.findByPk(youthId);
    if (!student) {
      return res.status(404).json({ message: '学生不存在' });
    }
    res.json(student);
  } catch (error) {
    res.status(500).json({ message: '获取学生失败', error: error.message });
  }
});

// 管理员新增学生
// POST /api/admin/youth
router.post('/youth', async (req, res) => {
  try {
    const student = await Youth.create(req.body);
    res.status(201).json({ message: '学生创建成功', student });
  } catch (error) {
    res.status(400).json({ message: '创建学生失败', error: error.message });
  }
});

// 管理员修改学生
// PUT /api/admin/youth/:youthId
router.put('/youth/:youthId', async (req, res) => {
  try {
    const { youthId } = req.params;
    const [updated] = await Youth.update(req.body, {
      where: { youth_id: youthId }
    });
    if (updated) {
      const updatedStudent = await Youth.findByPk(youthId);
      res.json({ message: '学生更新成功', student: updatedStudent });
    } else {
      res.status(404).json({ message: '学生不存在' });
    }
  } catch (error) {
    res.status(400).json({ message: '更新学生失败', error: error.message });
  }
});

// 管理员删除学生
// DELETE /api/admin/youth/:youthId
router.delete('/youth/:youthId', async (req, res) => {
  try {
    const { youthId } = req.params;
    const deleted = await Youth.destroy({
      where: { youth_id: youthId }
    });
    if (deleted) {
      res.json({ message: '学生删除成功' });
    } else {
      res.status(404).json({ message: '学生不存在' });
    }
  } catch (error) {
    res.status(500).json({ message: '删除学生失败', error: error.message });
  }
});

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

// 管理员查看所有社区
// GET /api/admin/neighborhood
router.get('/neighborhood', async (req, res) => {
  try {
    const neighborhoods = await Neighborhood.findAll();
    res.json(neighborhoods);
  } catch (error) {
    res.status(500).json({ message: '获取社区列表失败', error: error.message });
  }
});

// 管理员查看单个社区
// GET /api/admin/neighborhood/:id
router.get('/neighborhood/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const neighborhood = await Neighborhood.findByPk(id);
    if (!neighborhood) {
      return res.status(404).json({ message: '社区不存在' });
    }
    res.json(neighborhood);
  } catch (error) {
    res.status(500).json({ message: '获取社区失败', error: error.message });
  }
});

// 管理员新增社区
// POST /api/admin/neighborhood
router.post('/neighborhood', async (req, res) => {
  try {
    const neighborhood = await Neighborhood.create(req.body);
    res.status(201).json({ message: '社区创建成功', neighborhood });
  } catch (error) {
    res.status(400).json({ message: '创建社区失败', error: error.message });
  }
});

// 管理员修改社区
// PUT /api/admin/neighborhood/:id
router.put('/neighborhood/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const [updated] = await Neighborhood.update(req.body, {
      where: { neighborhood_id: id }
    });
    if (updated) {
      const updatedNeighborhood = await Neighborhood.findByPk(id);
      res.json({ message: '社区更新成功', neighborhood: updatedNeighborhood });
    } else {
      res.status(404).json({ message: '社区不存在' });
    }
  } catch (error) {
    res.status(400).json({ message: '更新社区失败', error: error.message });
  }
});

// 管理员删除社区
// DELETE /api/admin/neighborhood/:id
router.delete('/neighborhood/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Neighborhood.destroy({
      where: { neighborhood_id: id }
    });
    if (deleted) {
      res.json({ message: '社区删除成功' });
    } else {
      res.status(404).json({ message: '社区不存在' });
    }
  } catch (error) {
    res.status(500).json({ message: '删除社区失败', error: error.message });
  }
});



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

// 管理员查看社区下的所有教师
// GET /api/admin/neighborhood/:id/teachers
router.get('/neighborhood/:id/teachers', async (req, res) => {
  try {
    const { id } = req.params;
    const neighborhood = await Neighborhood.findByPk(id, {
      include: [{ model: Teacher, as: 'Teachers' }]
    });
    if (!neighborhood) {
      return res.status(404).json({ message: '社区不存在' });
    }
    res.json(neighborhood.Teachers);
  } catch (error) {
    res.status(500).json({ message: '获取社区教师失败', error: error.message });
  }
});





module.exports = router;
