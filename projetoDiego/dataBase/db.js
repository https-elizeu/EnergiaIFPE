const Sequelize = require('sequelize');
const conection = new Sequelize('projetoBD', 'root', '20*(!g!5', {
    host: 'localhost',
    dialect: 'mysql'
});

module.exports = conection;