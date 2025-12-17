const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const TeacherMatching = sequelize.define('TeacherMatching', {
  matching_id: {
    type: DataTypes.STRING,
    primaryKey: true,
  },
  youth_id: DataTypes.STRING,
  teacher_id: DataTypes.STRING,
  match_score: DataTypes.DECIMAL(5, 2),
  match_date: DataTypes.DATE,
  status: DataTypes.STRING,
}, {
  tableName: 'teacher_matching',
  timestamps: false,
});

module.exports = TeacherMatching;