const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const CoffeeBean = sequelize.define(
  'CoffeeBean',
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
    bean_name: {
      type: DataTypes.STRING(120),
      allowNull: false,
    },
    origin: {
      type: DataTypes.STRING(120),
      allowNull: false,
    },
    roast_level: {
      type: DataTypes.STRING(60),
      allowNull: false,
    },
    process_type: {
      type: DataTypes.STRING(80),
      allowNull: false,
    },
  },
  {
    tableName: 'coffee_beans',
    timestamps: true,
    underscored: true,
  }
);

module.exports = CoffeeBean;