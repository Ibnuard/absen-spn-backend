module.exports = (sequelize, Sequelize) => {
  const Parameter = sequelize.define(
    "parameter",
    {
      parameter_id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
      },
      minimum_clock_in: {
        type: Sequelize.STRING,
      },
      maximum_clock_out: {
        type: Sequelize.STRING,
      },
    },
    {
      timestamps: false,
    }
  );

  return Parameter;
};
