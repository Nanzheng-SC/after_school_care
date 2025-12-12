const Parent = require('./Parent');
const Youth = require('./Youth');
const Teacher = require('./Teacher');
const Course = require('./Course');
const Evaluation = require('./Evaluation');

// 关系（最基础、够用）
Parent.hasMany(Youth, { foreignKey: 'family_id', sourceKey: 'family_id' });
Youth.belongsTo(Parent, { foreignKey: 'family_id', targetKey: 'family_id' });

Teacher.hasMany(Course, { foreignKey: 'teacher_id' });
Course.belongsTo(Teacher, { foreignKey: 'teacher_id' });

Teacher.hasMany(Evaluation, { foreignKey: 'teacher_id' });
Evaluation.belongsTo(Teacher, { foreignKey: 'teacher_id' });

Parent.hasMany(Evaluation, { foreignKey: 'parent_id' });
Evaluation.belongsTo(Parent, { foreignKey: 'parent_id' });

module.exports = {
  Parent,
  Youth,
  Teacher,
  Course,
  Evaluation,
};
