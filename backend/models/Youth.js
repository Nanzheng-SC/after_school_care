const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Youth = sequelize.define('Youth', {
  youth_id: {
    type: DataTypes.STRING,
    primaryKey: true,
  },
  family_id: DataTypes.STRING,
  name: DataTypes.STRING,
  age: DataTypes.INTEGER,
  health_note: DataTypes.STRING,
  interest: DataTypes.STRING,
  learning_style: DataTypes.STRING,
}, {
  tableName: 'youth',
  timestamps: false,
});

module.exports = Youth;
