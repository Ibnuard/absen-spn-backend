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
//db.devs = require("../models/dev.model.js")(sequelize, Sequelize);
db.user = require("../models/user.model.js")(sequelize, Sequelize);
db.absen = require("../models/absen.model.js")(sequelize, Sequelize);
db.jadwal = require("../models/jadwal.model.js")(sequelize, Sequelize);
db.kelas = require("../models/kelas.model.js")(sequelize, Sequelize);
db.mapel = require("../models/mapel.model.js")(sequelize, Sequelize);
db.rekap = require("../models/rekap.model.js")(sequelize, Sequelize);
db.parameter = require("../models/parameter.model.js")(sequelize, Sequelize);

module.exports = db;
