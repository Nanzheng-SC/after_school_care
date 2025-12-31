const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const SystemParameter = sequelize.define('SystemParameter', {
  parameter_id: {
    type: DataTypes.STRING(36),
    primaryKey: true,
    defaultValue: DataTypes.UUIDV4,
    allowNull: false
  },
  name: {
    type: DataTypes.STRING(100),
    allowNull: false,
    unique: true,
    comment: '参数名称'
  },
  type: {
    type: DataTypes.STRING(50),
    allowNull: false,
    comment: '参数类型（如：weight, price, limit等）'
  },
  value: {
    type: DataTypes.STRING(255),
    allowNull: false,
    comment: '参数值'
  },
  scope: {
    type: DataTypes.STRING(50),
    allowNull: false,
    defaultValue: 'system',
    comment: '作用域'
  },
  effective_time: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW,
    comment: '生效时间'
  },
  version: {
    type: DataTypes.STRING(20),
    allowNull: false,
    defaultValue: '1.0',
    comment: '版本号'
  }
}, {
  tableName: 'system_parameters',
  timestamps: true,
  underscored: true
});

module.exports = SystemParameter;
