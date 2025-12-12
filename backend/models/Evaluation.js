const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Evaluation = sequelize.define('Evaluation', {
  evaluation_id: {
    type: DataTypes.STRING,
    primaryKey: true,
  },
  parent_id: DataTypes.STRING,
  teacher_id: DataTypes.STRING,
  course_id: DataTypes.STRING,
  eval_time: DataTypes.DATE,
  eval_type: DataTypes.STRING,
  score: DataTypes.INTEGER,
}, {
  tableName: 'evaluation',
  timestamps: false,
});

module.exports = Evaluation;
