module.exports = (sequelize, Sequelize) => {
  const Absen = sequelize.define("absen", {
    type: {
      type: Sequelize.STRING,
    },
    user_id: {
      type: Sequelize.STRING,
    },
    username: {
      type: Sequelize.STRING,
    },
    kelas: {
      type: Sequelize.STRING,
    },
    mapel: {
      type: Sequelize.STRING,
    },
    tgl_absen: {
      type: Sequelize.STRING,
    },
    jam_absen: {
      type: Sequelize.STRING,
    },
  });

  return Absen;
};
