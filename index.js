const express = require("express");
const cors = require('cors');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, './.env') }); // pastikan env terbaca

const db = require('./src/config/db'); // koneksi Sequelize
require('./src/models/UserModel.js');          
require('./src/models/ContactUsModel.js');
require('./src/models/ArticleModels.js');

const UserRoute = require('./src/routes/UserRoute.js');
const ContactUsRoute = require('./src/routes/ContactUsRoute.js');
const ArticleRoute = require('./src/routes/ArticleRoutes.js');

const app = express();

// PORT dari env, default 3600
const PORT = process.env.PORT || 3600;

// MIDDLEWARE
app.use(cors({ origin: '*' })); // biar bisa diakses dari mana saja
app.use(express.json());

// ROUTES
app.use(UserRoute);
app.use(ContactUsRoute);
app.use(ArticleRoute);

// SYNC DATABASE lalu start server
db.authenticate()
  .then(() => {
    console.log('Database connected');

    // sync tanpa drop table, aman data
    db.sync({ alter: true })
      .then(() => console.log('Database synced'))
      .catch(err => console.error('Database sync failed:', err));

    // Listen ke semua interface supaya frontend di browser bisa akses
    app.listen(PORT, '0.0.0.0', () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((err) => console.error('Database connection failed:', err));
