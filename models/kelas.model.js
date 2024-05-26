module.exports = (sequelize, Sequelize) => {
  const Kelas = sequelize.define(
    "kelas",
    {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true, // Automatically increments the value for each new record
        primaryKey: true, // Sets this field as the primary key
      },
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
