const { Sequelize } = require('sequelize');
const path = require("path");

const DAO = new Sequelize({
    dialect: 'sqlite',
    storage: path.resolve(__dirname, "../database.sqlite"),
    logging: false
});

module.exports = DAO;
