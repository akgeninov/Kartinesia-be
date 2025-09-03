const { DataTypes } = require('sequelize');
const db = require('../config/db.js');
const Category = require('./CategoryModel.js');

const Articles = db.define("articles", {
  article_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  title: {
    type: DataTypes.STRING
  },
  url_image: {
    type: DataTypes.STRING
  },
  description: {
    type: DataTypes.TEXT
  },
  category_id: {
    type: DataTypes.INTEGER,
    references: {
      model: Category,
      key: 'category_id'
    }
  }
}, {
  freezeTableName: true,
});

Articles.belongsTo(Category, { foreignKey: 'category_id', as: 'category' });
Category.hasMany(Articles, { foreignKey: 'category_id', as: 'articles'});

module.exports = Articles;
