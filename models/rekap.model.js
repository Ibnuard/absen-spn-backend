module.exports = (sequelize, Sequelize) => {
  const Rekap = sequelize.define("rekap", {
    user_id: {
      type: Sequelize.INTEGER,
    },
    mapel_id: {
      type: Sequelize.INTEGER,
    },
    mapel: {
      type: Sequelize.STRING,
    },
    kelas_id: {
      type: Sequelize.INTEGER,
    },
    kelas: {
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
