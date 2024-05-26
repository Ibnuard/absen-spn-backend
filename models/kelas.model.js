module.exports = (sequelize, Sequelize) => {
  const Kelas = sequelize.define(
    "kelas",
    {
      kelas: {
        type: Sequelize.STRING,
      },
    },
    {
      timestamps: false,
    }
  );

  return Kelas;
};
