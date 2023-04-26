const path = require('path');
const configPath = path.join(__dirname, '..', '..', '..', 'config', 'config.json');
const dbConfig = require(configPath)[process.env.NODE_ENV];
const Sequelize = require("sequelize");


const sequelize = new Sequelize(dbConfig.DB, dbConfig.USER, dbConfig.PASSWORD, {
  host: dbConfig.HOST,
  dialect: dbConfig.dialect,
  operatorsAliases: false,

  pool: {
    max: dbConfig.pool.max,
    min: dbConfig.pool.min,
    acquire: dbConfig.pool.acquire,
    idle: dbConfig.pool.idle
  }
});

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.Session = require("./Session.js")(sequelize, Sequelize);
db.SessionHistory = require("./SessionHistory.js")(sequelize, Sequelize);
db.User = require("./User.js")(sequelize, Sequelize);

module.exports = db;