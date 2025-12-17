const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Course = sequelize.define('Course', {
  course_id: {
    type: DataTypes.STRING,
    primaryKey: true
  },
  teacher_id: {
    type: DataTypes.STRING
  },
  neighborhood_id: {
    type: DataTypes.STRING
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  type: {
    type: DataTypes.STRING,
    allowNull: false
  },
  age_range: {
    type: DataTypes.STRING
  },
  schedule: {
    type: DataTypes.STRING
  }
}, {
  tableName: 'course',   
  timestamps: false
});

module.exports = Course;
