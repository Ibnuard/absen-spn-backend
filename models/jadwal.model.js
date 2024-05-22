module.exports = (sequelize, Sequelize) => {
  const Jadwal = sequelize.define(
    "jadwal",
    {
      title: {
        type: Sequelize.STRING,
      },
      tanggal: {
        type: Sequelize.STRING,
      },
      jam_masuk: {
        type: Sequelize.STRING,
      },
      jam_keluar: {
        type: Sequelize.STRING,
      },
    },
    {
      timestamps: false,
    }
  );

  return Jadwal;
};
