module.exports = (sequelize, Sequelize) => {
  const Mapel = sequelize.define(
    "mapel",
    {
      name: {
        type: Sequelize.STRING,
      },
      max_pertemuan: {
        type: Sequelize.INTEGER,
      },
    },
    {
      timestamps: false,
    }
  );

  return Mapel;
};
