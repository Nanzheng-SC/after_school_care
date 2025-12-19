const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Neighborhood = sequelize.define('Neighborhood', {
  neighborhood_id: {
    type: DataTypes.STRING,
    primaryKey: true
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  district: {
    type: DataTypes.STRING,
    allowNull: false
  },
  contact: {
    type: DataTypes.STRING
  },
  address: {
    type: DataTypes.STRING
  },
  facility: {
    type: DataTypes.STRING
  },
  service_scope: {
    type: DataTypes.STRING
  }
}, {
  tableName: 'neighborhood',
  timestamps: false
});

module.exports = Neighborhood;