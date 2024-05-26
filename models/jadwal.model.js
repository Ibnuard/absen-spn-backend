module.exports = (sequelize, Sequelize) => {
  const Jadwal = sequelize.define(
    "jadwal",
    {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true, // Automatically increments the value for each new record
        primaryKey: true, // Sets this field as the primary key
      },
      title: {
        type: Sequelize.STRING,
      },
      tanggal: {
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
