const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Course = sequelize.define('Course', {
  course_id: {
    type: DataTypes.STRING,
    primaryKey: true,
  },
  teacher_id: DataTypes.STRING,
  neighborhood_id: DataTypes.STRING,
  name: DataTypes.STRING,
  type: DataTypes.STRING,
  age_range: DataTypes.STRING,
  schedule: DataTypes.STRING,
}, {
  tableName: 'course',
  timestamps: false,
});

module.exports = Course;
