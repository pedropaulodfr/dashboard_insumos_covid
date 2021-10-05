const db = require("./db")

const Distribuicao = db.sequelize.define("distribuicao", {
    Material: {
        type: db.Sequelize.STRING
    },
    Quantidade: {
        type: db.Sequelize.STRING
    },
    RequisitanteDestino: {
        type: db.Sequelize.STRING
    }
})

module.exports = Distribuicao