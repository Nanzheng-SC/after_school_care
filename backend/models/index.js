const Parent = require('./Parent');
const Youth = require('./Youth');
const Teacher = require('./Teacher');
const Course = require('./Course');
const Evaluation = require('./Evaluation');
const TeacherMatching = require('./TeacherMatching');
const Neighborhood = require('./Neighborhood');

// Neighborhood associations
Neighborhood.hasMany(Course, { foreignKey: 'neighborhood_id' });
Course.belongsTo(Neighborhood, { foreignKey: 'neighborhood_id' });

Neighborhood.hasMany(Teacher, { foreignKey: 'neighborhood_id', as: 'Teachers' });
Teacher.belongsTo(Neighborhood, { foreignKey: 'neighborhood_id', as: 'Neighborhood' });

// 关系（最基础、够用）
Parent.hasMany(Youth, { foreignKey: 'family_id', sourceKey: 'family_id', as: 'Youths' });
Youth.belongsTo(Parent, { foreignKey: 'family_id', targetKey: 'family_id', as: 'Parent' });

Teacher.hasMany(Course, { foreignKey: 'teacher_id', as: 'Courses' });
Course.belongsTo(Teacher, { foreignKey: 'teacher_id', as: 'Teacher' });

Teacher.hasMany(Evaluation, { foreignKey: 'teacher_id' });
Evaluation.belongsTo(Teacher, { foreignKey: 'teacher_id' });

Parent.hasMany(Evaluation, { foreignKey: 'parent_id' });
Evaluation.belongsTo(Parent, { foreignKey: 'parent_id' });

Youth.hasMany(TeacherMatching, { foreignKey: 'youth_id', onDelete: 'CASCADE' });
TeacherMatching.belongsTo(Youth, { foreignKey: 'youth_id' });

Teacher.hasMany(TeacherMatching, { foreignKey: 'teacher_id' });
TeacherMatching.belongsTo(Teacher, { foreignKey: 'teacher_id' });

module.exports = {
  Parent,
  Youth,
  Teacher,
  Course,
  Evaluation,
  TeacherMatching,
  Neighborhood,
};
