const { DataTypes } = require('sequelize');
const db = require('../config/db.js');

const Category = db.define('categories', {
  category_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  name: {
    type: DataTypes.STRING(50),
    allowNull: false
  }
}, {
  freezeTableName: true
});

module.exports = Category;
