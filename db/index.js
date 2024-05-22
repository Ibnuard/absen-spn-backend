const dbConfig = require("../config/db.config.js");

const Sequelize = require("sequelize");
const sequelize = new Sequelize(dbConfig.DB, dbConfig.USER, dbConfig.PASSWORD, {
  host: dbConfig.HOST,
  dialect: dbConfig.dialect,
  operatorsAliases: false,
  pool: {
    max: dbConfig.pool.max,
    min: dbConfig.pool.min,
    acquire: dbConfig.pool.acquire,
    idle: dbConfig.pool.idle,
  },
  timezone: "+07:00",
});

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

// table
db.devs = require("../models/dev.model.js")(sequelize, Sequelize);

module.exports = db;
