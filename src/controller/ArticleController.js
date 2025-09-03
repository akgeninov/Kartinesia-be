const articles = require('../models/ArticleModels');
const Category = require('../models/CategoryModel');
const { Op } = require("sequelize");
const db = require("../config/db.js");
const Sequelize = require("sequelize");

// POST ARTICLE 
const addArticle = async (req, res) => {
  const { body } = req;
  try {
      const article = {
          title: req.body.title,
          url_image: req.body.url_image,
          description: req.body.description,
          category: req.body.category
      }

      await articles.create(article);

      res.json({ 
          msg: "Create Article Success",
          data: body 
      });

  } catch (error) {
      res.status(500).json({
          message: "Server Error",
          serverMessage : error
        })
      }
    }

// GET ALL ARTICLE/GET ARTICLE BY CATEGORY
const getArticles = async (req, res) => {
  try {
    const { category } = req.query;

    let options = {
      include: [{ model: Category, as: 'category', attributes: ["name"] }],
      limit: 50
    };

    if (category) {
      options.include[0].where = { name: category };
    }

    const articlesData = await articles.findAll(options);

    res.json({ message: "Get Article Success", data: articlesData });
  } catch (error) {
    console.error("Error getArticles:", error);
    res.status(500).json({ message: "Server Error", serverMessage: error.message });
  }
};

// GET ARTICLE BY TITLE
const getArticlesByTitle = async (req, res) => {
  try {
      const searchTerm = req.query.q; // Mendapatkan query pencarian dari request
      const article = await articles.findAll({
          where: {
              // Menentukan kondisi pencarian, misalnya judul mengandung searchTerm
              title: {
                  [Op.like]: `%${searchTerm}%`
                }
              }
            });

      if(!article || article.length === 0){
        res.status(404).json({ message: 'Artikel tidak ditemukan' });
        return;
      }

      res.json({
          message: 'Search Success',
          data: article
        });

  } catch (error) {
      res.status(500).json({
          message: "Error searching articles",
          error: error.message
        });
      }
    };

// GET ARTICLE BY ID
const getArticlesById = async (req, res) => {
  try {
    const { id } = req.params;
    const article = await articles.findByPk(id);
    if (!article) {
      res.status(404).json({ message: 'Artikel tidak ditemukan' });
      return;
    }

    res.json({
      message: 'Get Article Success',
      data: article
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Terjadi kesalahan dalam mengambil Artikel' });
  }
}

// GET ARTICLE BY DATE ASC AND DESC
const getArticlesByDate = async (req, res) => {
  try {
    const { order } = req.query; // 'asc' or 'desc'
      
    let article;
    if (order === 'asc') {
      article = await articles.findAll({
        order: [['createdAt', 'ASC']]
      });
    } else {
      article = await articles.findAll({
        order: [['createdAt', 'DESC']]
      });
    }

    res.json({
      message: 'Get Article Success',
      data: article
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Terjadi kesalahan dalam mengambil Artikel berdasarkan tanggal' });
  }
};

// GET ARTICLE BY CATEGORY AND DATE ASC/DESC
const getArticlesByDateAndCategory = async (req, res) => {
  try {
    const { order, category } = req.query; // 'asc' or 'desc', 'health' or 'fashion'
      
    let article;
    if (order === 'asc') {
      article = await articles.findAll({
        where: { category },
        order: [['createdAt', 'ASC']]
      });
    } else {
      article = await articles.findAll({
        where: {
          category: {
            [Op.or]: [category === 'kesehatan' ? 'kesehatan' : null, category === 'fesyen' ? 'fesyen' : null]
          }
        },
        order: [['createdAt', 'DESC']]
      });
    }
  
    res.json({
      message: 'Get Article Success',
      data: article
    });

    } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Terjadi kesalahan dalam mengambil Artikel berdasarkan tanggal dan kategori' });
  }
};

// GET ALL ARTICLE BY RANDOM ID
const getAllRandomArticles = async (req, res) => {
  try {
    const articlesData = await articles.findAll({
      order: Sequelize.literal('RAND()') // pakai 'RANDOM()' kalau PostgreSQL
    });
    res.json({ message: 'Get Article Success', data: articlesData });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Terjadi kesalahan dalam mengambil Artikel' });
  }
};


// GET ALL ARTICLE BY RANDOM ID WITH LIMIT
const getAllRandomArticlesLimit3 = async (req, res) => {
  try {
    const articlesData = await articles.findAll({
      order: Sequelize.literal('RAND()'),
      limit: 3
    });
    res.json({ message: 'Get Article Success', data: articlesData });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Terjadi kesalahan dalam mengambil Artikel' });
  }
};

const getAllRandomArticlesLimit9 = async (req, res) => {
  try {
    const articlesData = await articles.findAll({
      order: Sequelize.literal('RAND()'),
      limit: 9
    });
    res.json({ message: 'Get Article Success', data: articlesData });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Terjadi kesalahan dalam mengambil Artikel' });
  }
};

module.exports = {
    addArticle, 
    getArticles,
    getArticlesByTitle,
    getArticlesById,
    getArticlesByDate,
    getArticlesByDateAndCategory,
    getAllRandomArticles,
    getAllRandomArticlesLimit3,
    getAllRandomArticlesLimit9
}