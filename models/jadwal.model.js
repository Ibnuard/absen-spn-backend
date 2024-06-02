module.exports = (sequelize, Sequelize) => {
  const Jadwal = sequelize.define(
    "jadwal",
    {
      title: {
        type: Sequelize.STRING,
      },
      mapel_id: {
        type: Sequelize.INTEGER,
      },
      kelas_id: {
        type: Sequelize.INTEGER,
      },
      jadwal_day: {
        type: Sequelize.STRING,
      },
      kelas: {
        type: Sequelize.STRING,
      },
      mapel: {
        type: Sequelize.STRING,
      },
      lokasi: {
        type: Sequelize.STRING,
      },
      jam_in: {
        type: Sequelize.STRING,
      },
      jam_out: {
        type: Sequelize.STRING,
      },
    },
    {
      timestamps: false,
    }
  );

  return Jadwal;
};
