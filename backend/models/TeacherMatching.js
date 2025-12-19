const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const TeacherMatching = sequelize.define('TeacherMatching', {
  match_id: {
    type: DataTypes.STRING,
    primaryKey: true,
  },
  youth_id: DataTypes.STRING,
  teacher_id: DataTypes.STRING,
  match_time: DataTypes.DATE,
  algorithm_version: DataTypes.STRING,
  match_score: DataTypes.DECIMAL(5, 2),
  match_basis: DataTypes.STRING,
}, {
  tableName: 'teacher_matching',
  timestamps: false,
});

module.exports = TeacherMatching;