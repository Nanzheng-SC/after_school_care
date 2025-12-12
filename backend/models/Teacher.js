const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Teacher = sequelize.define('Teacher', {
  teacher_id: {
    type: DataTypes.STRING,
    primaryKey: true,
  },
  neighborhood_id: DataTypes.STRING,
  name: DataTypes.STRING,
  certificate: DataTypes.STRING,
  specialty: DataTypes.STRING,
  teaching_style: DataTypes.STRING,
  available_time: DataTypes.STRING,
  avg_score: DataTypes.DECIMAL,
}, {
  tableName: 'teacher',
  timestamps: false,
});

module.exports = Teacher;
