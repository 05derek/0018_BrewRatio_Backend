const sequelize = require('../config/database');
const User = require('./User');
const CoffeeBean = require('./CoffeeBean');
const BrewMethod = require('./BrewMethod');
const BrewLog = require('./BrewLog');

// Users 1:N -> CoffeeBeans (CASCADE)
User.hasMany(CoffeeBean, { foreignKey: 'user_id', onDelete: 'CASCADE' });
CoffeeBean.belongsTo(User, { foreignKey: 'user_id' });

// Users 1:N -> BrewMethods (CASCADE)
User.hasMany(BrewMethod, { foreignKey: 'user_id', onDelete: 'CASCADE' });
BrewMethod.belongsTo(User, { foreignKey: 'user_id' });

// Users 1:N -> BrewLogs (CASCADE)
User.hasMany(BrewLog, { foreignKey: 'user_id', onDelete: 'CASCADE' });
BrewLog.belongsTo(User, { foreignKey: 'user_id' });

// CoffeeBeans 1:N -> BrewLogs (SET NULL)
CoffeeBean.hasMany(BrewLog, { foreignKey: 'coffee_bean_id', onDelete: 'SET NULL' });
BrewLog.belongsTo(CoffeeBean, { foreignKey: 'coffee_bean_id' });

// BrewMethods 1:N -> BrewLogs (SET NULL)
BrewMethod.hasMany(BrewLog, { foreignKey: 'brew_method_id', onDelete: 'SET NULL' });
BrewLog.belongsTo(BrewMethod, { foreignKey: 'brew_method_id' });

module.exports = {
  sequelize,
  User,
  CoffeeBean,
  BrewMethod,
  BrewLog,
};