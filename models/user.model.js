module.exports = (sequelize, Sequelize) => {
  const User = sequelize.define("user", {
    nama: {
      type: Sequelize.STRING,
    },
    username: {
      type: Sequelize.STRING,
    },
    password: {
      type: Sequelize.STRING,
    },
    nim: {
      type: Sequelize.STRING,
    },
    status: {
      type: Sequelize.STRING,
    },
    password: {
      type: Sequelize.STRING,
    },
    avatar: {
      type: Sequelize.STRING,
    },
    kelas: {
      type: Sequelize.STRING,
    },
    tahun_masuk: {
      type: Sequelize.STRING,
    },
    wali_kelas: {
      type: Sequelize.STRING,
    },
    tanggal_lahir: {
      type: Sequelize.STRING,
    },
    tempat_lahir: {
      type: Sequelize.STRING,
    },
    nomor_telp: {
      type: Sequelize.STRING,
    },
  });

  return User;
};
