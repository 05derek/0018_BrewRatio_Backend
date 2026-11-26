const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const BrewMethod = sequelize.define(
  'BrewMethod',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    method_name: {
      type: DataTypes.STRING(120),
      allowNull: false,
    },
    default_ratio: {
      type: DataTypes.STRING(30),
      allowNull: false,
    },
    grind_size: {
      type: DataTypes.STRING(60),
      allowNull: false,
    },
    instructions: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
  },
  {
    tableName: 'brew_methods',
    timestamps: true,
    underscored: true,
  }
);

module.exports = BrewMethod;