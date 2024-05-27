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
    nrp: {
      type: Sequelize.STRING,
    },
    avatar: {
      type: Sequelize.STRING,
    },
    jabatan: {
      type: Sequelize.STRING,
    },
    pangkat: {
      type: Sequelize.STRING,
    },
  });

  return User;
};
