const Sequelize = require("sequelize")

const sequelize = new Sequelize("dados_covid", "root", "", {
    host: "localhost",
    dialect: "mysql"
})

sequelize.authenticate().then(() => {
    console.log("Conexão realizada com sucesso!");
}).catch((err) => {
    console.log("Erro ao tentar se conectar ao DB: " + err);
});

module.exports = {
    Sequelize: Sequelize,
    sequelize: sequelize
}