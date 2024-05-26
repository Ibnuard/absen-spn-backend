module.exports = (sequelize, Sequelize) => {
  const Absen = sequelize.define("absen", {
    id: {
      type: Sequelize.INTEGER,
      autoIncrement: true, // Automatically increments the value for each new record
      primaryKey: true, // Sets this field as the primary key
    },
    type: {
      type: Sequelize.STRING,
    },
    user_id: {
      type: Sequelize.INTEGER,
    },
    name: {
      type: Sequelize.STRING,
    },
    nim: {
      type: Sequelize.STRING,
    },
    username: {
      type: Sequelize.STRING,
    },
    kelas: {
      type: Sequelize.STRING,
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
