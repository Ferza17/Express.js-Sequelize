const Sequelize = require("sequelize").Sequelize;

const sequelize = new Sequelize("nodejs_products", "root", "", {
  dialect: "mysql",
  host: "localhost",
});

module.exports = sequelize;