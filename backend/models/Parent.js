const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Parent = sequelize.define('Parent', {
  parent_id: {
    type: DataTypes.STRING,
    primaryKey: true,
  },
  family_id: DataTypes.STRING,
  name: DataTypes.STRING,
  phone: DataTypes.STRING,
  payment_account: DataTypes.STRING,
  register_time: DataTypes.DATE,
  account_status: DataTypes.STRING,
}, {
  tableName: 'parent',
  timestamps: false,
});

module.exports = Parent;
