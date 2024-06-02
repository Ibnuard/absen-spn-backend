module.exports = (sequelize, Sequelize) => {
  const Session = sequelize.define(
    "session",
    {
      user_id: {
        type: Sequelize.STRING,
      },
      kelas_id: {
        type: Sequelize.STRING,
      },
      kelas: {
        type: Sequelize.STRING,
      },
      mapel_id: {
        type: Sequelize.STRING,
      },
      mapel: {
        type: Sequelize.STRING,
      },
    },
    {
      timestamps: false,
    }
  );

  return Session;
};
