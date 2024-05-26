module.exports = (sequelize, Sequelize) => {
  const Rekap = sequelize.define("rekap", {
    id: {
      type: Sequelize.INTEGER,
      autoIncrement: true, // Automatically increments the value for each new record
      primaryKey: true, // Sets this field as the primary key
    },
    user_id: {
      type: Sequelize.INTEGER,
    },
    mapel_id: {
      type: Sequelize.INTEGER,
    },
    mapel: {
      type: Sequelize.STRING,
    },
    periode: {
      type: Sequelize.STRING,
    },
    kehadiran: {
      type: Sequelize.INTEGER,
    },
    max_kehadiran: {
      type: Sequelize.INTEGER,
    },
  });

  return Rekap;
};
