module.exports = (sequelize, Sequelize) => {
  const Absen = sequelize.define("absen", {
    type: {
      type: Sequelize.STRING,
    },
    user_id: {
      type: Sequelize.INTEGER,
    },
    name: {
      type: Sequelize.STRING,
    },
    nrp: {
      type: Sequelize.STRING,
    },
    username: {
      type: Sequelize.STRING,
    },
    jadwal_id: {
      type: Sequelize.INTEGER,
    },
    kelas: {
      type: Sequelize.STRING,
    },
    kelas_id: {
      type: Sequelize.INTEGER,
    },
    mapel_id: {
      type: Sequelize.INTEGER,
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
    periode: {
      type: Sequelize.STRING,
    },
  });

  return Absen;
};
