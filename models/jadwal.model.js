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
