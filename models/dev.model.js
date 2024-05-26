module.exports = (sequelize, Sequelize) => {
  const Dev = sequelize.define("dev", {
    id: {
      type: Sequelize.INTEGER,
      autoIncrement: true, // Automatically increments the value for each new record
      primaryKey: true, // Sets this field as the primary key
    },
    title: {
      type: Sequelize.STRING,
    },
    description: {
      type: Sequelize.STRING,
    },
    published: {
      type: Sequelize.BOOLEAN,
    },
  });

  return Dev;
};
