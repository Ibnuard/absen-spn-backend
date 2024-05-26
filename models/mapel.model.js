module.exports = (sequelize, Sequelize) => {
  const Mapel = sequelize.define(
    "mapel",
    {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true, // Automatically increments the value for each new record
        primaryKey: true, // Sets this field as the primary key
      },
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
