const Sequelize = require("sequelize");
const conection = require("./dataBase/db");

const Alarme = conection.define('alarme', {
    nome: {
        type: Sequelize.STRING,
        allowNull: false
    },
    horario1: {
        type: Sequelize.TIME,
        allowNull: false
    },
    horario2: {
        type: Sequelize.TIME,
        allowNull: false
    },
    data: {
        type: Sequelize.DATE,
        allowNull: false
    },

});

Alarme.sync({ force: false }).then(() => {
    console.log("tabela criada no banco de dados")
})

module.exports = Alarme;