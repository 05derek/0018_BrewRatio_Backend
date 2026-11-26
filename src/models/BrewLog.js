const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const BrewLog = sequelize.define(
  'BrewLog',
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
    coffee_bean_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    brew_method_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    coffee_weight_grams: {
      type: DataTypes.DECIMAL(8, 2),
      allowNull: false,
    },
    water_volume_ml: {
      type: DataTypes.DECIMAL(8, 2),
      allowNull: false,
    },
    water_temp_celsius: {
      type: DataTypes.DECIMAL(5, 2),
      allowNull: false,
    },
    rating: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    flavor_notes: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    brewed_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    tableName: 'brew_logs',
    timestamps: true,
    underscored: true,
  }
);

module.exports = BrewLog;