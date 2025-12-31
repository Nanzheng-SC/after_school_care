const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const Youth = require('./Youth');
const Course = require('./Course');

const CourseSelection = sequelize.define('CourseSelection', {
  selection_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false
  },
  youth_id: {
    type: DataTypes.STRING(20),
    allowNull: false,
    references: {
      model: Youth,
      key: 'youth_id'
    },
    onDelete: 'CASCADE'
  },
  course_id: {
    type: DataTypes.STRING(20),
    allowNull: false,
    references: {
      model: Course,
      key: 'course_id'
    },
    onDelete: 'CASCADE'
  },
  selection_date: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
    allowNull: false
  },
  status: {
    type: DataTypes.ENUM('enrolled', 'dropped'),
    defaultValue: 'enrolled',
    allowNull: false
  }
}, {
  tableName: 'CourseSelection',
  timestamps: false,
  indexes: [
    {
      unique: true,
      fields: ['youth_id', 'course_id']
    }
  ]
});

// 关联关系
Youth.hasMany(CourseSelection, { foreignKey: 'youth_id', onDelete: 'CASCADE' });
CourseSelection.belongsTo(Youth, { foreignKey: 'youth_id' });

Course.hasMany(CourseSelection, { foreignKey: 'course_id', onDelete: 'CASCADE' });
CourseSelection.belongsTo(Course, { foreignKey: 'course_id' });

module.exports = CourseSelection;
