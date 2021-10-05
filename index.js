const bodyParser = require("body-parser");
const express = require("express");
const app = express();
const handlebars = require("express-handlebars");

// Config
    // Template engine
        app.engine('handlebars', handlebars({defaultLayout: 'main'}));
        app.set('view engine', 'handlebars');
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
app.use(express.static('public'))

// Conexão com o Banco de Dados MySQL
const mysql = require('mysql');
const con = mysql.createConnection({
    host: 'localhost', // O host do banco. Ex: localhost
    user: 'root', // Um usuário do banco. Ex: user 
    password: '', // A senha do usuário. Ex: user123
    database: 'dados_covid' // A base de dados a qual a aplicação irá se conectar, deve ser a mesma onde foi executado o Código 1. Ex: node_mysql
});

con.connect((err) => {
    if (err) {
        console.log('Erro ao se conectar ao Banco de Dados... => ', err)
        return
    }
    console.log('Conexão ao Banco de Dados estabelecida com sucesso!')
})


// Rotas
app.get("/", function (req, res) { // Index
    var quantMaterialGeral = "SELECT SUM(Quantidade) AS Quantidade, Material FROM distribuicaos GROUP BY Material";
    var quantMedicamentoRegiao = "SELECT SUM(QUANTIDADE) AS QUANTIDADE, REGIÃO AS REGIAO FROM distribuicao_medicamentos GROUP BY REGIÃO";
    var quantMedicamentoGeral = "SELECT SUM(QUANTIDADE) AS QUANTIDADE, ITEM FROM distribuicao_medicamentos GROUP BY ITEM";
    var quantRespiradorGeral = "SELECT SUM(QUANTIDADE) AS QUANTIDADE, UF FROM distribuicao_respiradores GROUP BY UF";
    var quantRespiradorPaises = "SELECT SUM(QUANTIDADE) AS QUANTIDADE, DESTINO FROM distribuicao_respiradores WHERE UF = '-' GROUP BY DESTINO"

    con.query(quantMaterialGeral, (err, queryMaterialGeral, fields) => {
        con.query(quantMedicamentoGeral, (err, queryMedicamentoGeral, fields) => {
            con.query(quantRespiradorGeral, (err, queryRespiradorGeral, fields) => {
                con.query(quantMedicamentoRegiao, (err, queryMedicamentoRegiao, fields) => {
                    con.query(quantRespiradorPaises, (err, queryRespiradorPaises, fields) => {
                        res.render("index", {
                            dadosMaterialGeral: JSON.stringify(queryMaterialGeral),
                            dadosMedicamentoRegiao: JSON.stringify(queryMedicamentoRegiao),
                            dadosMedicamentoGeral: JSON.stringify(queryMedicamentoGeral),
                            dadosRespiradorGeral: JSON.stringify(queryRespiradorGeral),
                            dadosRespiradorPaises: JSON.stringify(queryRespiradorPaises)
                        })
                    })
                })
            })
        })
    })
})

app.post("/medicamentos", (req, res) => { // Medicamentos
    let quantTotalMedicamentos = "SELECT SUM(QUANTIDADE) AS QUANTIDADE FROM distribuicao_medicamentos WHERE SIGLA = ?";
    let quantMedic = "SELECT SUM(QUANTIDADE) AS QUANTIDADE, ITEM FROM distribuicao_medicamentos WHERE SIGLA = ? GROUP BY ITEM";
    let quantMedicSemSol = "SELECT SUM(QUANTIDADE) AS QUANTIDADE, ITEM FROM distribuicao_medicamentos WHERE SIGLA = ? AND `DATA DE SOLICITAÇÃO` = '' GROUP BY ITEM";
    let datasDistMedic = "SELECT SUM(QUANTIDADE) AS QUANTIDADE, `DATA DE ENTREGA` AS DATA FROM distribuicao_medicamentos WHERE SIGLA = ? AND `DATA DE ENTREGA` != '' GROUP BY `DATA DE ENTREGA`";
    let datasSolMedic = "SELECT SUM (QUANTIDADE) AS QUANTIDADE, `DATA DE SOLICITAÇÃO` AS DATA FROM distribuicao_medicamentos WHERE SIGLA = ? AND `DATA DE SOLICITAÇÃO` != '' GROUP BY `DATA DE SOLICITAÇÃO`"
    let datasMedicSemSol = "SELECT SUM(QUANTIDADE) AS QUANTIDADE, `DATA DE ENTREGA` AS DATA FROM distribuicao_medicamentos WHERE SIGLA = ? AND `DATA DE SOLICITAÇÃO` = '' GROUP BY `DATA DE ENTREGA`";
    let frequenciaMedicamento = "SELECT SUM(QUANTIDADE) AS QUANTMEDIC, ITEM, COUNT(*) AS CONTADOR, `DATA DE ENTREGA` AS DATA FROM distribuicao_medicamentos WHERE SIGLA = ? AND `DATA DE ENTREGA` != '' GROUP BY ITEM";

    let siglaEstado = req.body.sigla_estado.substr(3,4)

    con.query(quantTotalMedicamentos, [siglaEstado], (err, queryQuantTotMedic, fields) => {
        con.query(quantMedic, [siglaEstado], (err, queryQuantMedic, fields) => {
            con.query(quantMedicSemSol, [siglaEstado], (err, queryQuantMedicSemSol, fields) => {
                con.query(datasDistMedic, [siglaEstado], (err, queryDatasDistMedic, fields) => {
                    con.query(datasSolMedic, [siglaEstado], (err, queryDatasSolMedic, fields) =>{
                        con.query(datasMedicSemSol, [siglaEstado], (err, queryDatasMedicSemSol, fields) => {
                            con.query(frequenciaMedicamento, [siglaEstado], (err, queryFreqMedic, fields) => {
                                res.render('medicamentos', {
                                    sigla: siglaEstado,
                                    dadosQuantTotMedic: JSON.stringify(queryQuantTotMedic),
                                    dadosQuantMedic: JSON.stringify(queryQuantMedic),
                                    dadosQuantMedicSemSol: JSON.stringify(queryQuantMedicSemSol),
                                    dadosDatasDistMedic: JSON.stringify(queryDatasDistMedic),
                                    dadosDatasSolMedic: JSON.stringify(queryDatasSolMedic),
                                    dadosDatasMedicSemSol: JSON.stringify(queryDatasMedicSemSol),
                                    dadosFreqMedic: JSON.stringify(queryFreqMedic)
                                })
                            })
                        })
                    })
                })
            })
        })
    })
})

app.post("/materiais", (req, res) => { // Materiais
    var quantMaterial = "SELECT SUM(Quantidade) AS Quantidade, Material AS QMaterial FROM distribuicaos WHERE Sigla = ? GROUP BY Material";
    var frequenciaDatas = "SELECT COUNT(*) AS Contador, SUM(Quantidade) AS Quant, Dt FROM distribuicaos WHERE Sigla = ? GROUP BY Dt";
    var frequenciaMaterial = "SELECT SUM(Quantidade) AS QuantMaterial, Material, COUNT(*) AS Contador, Dt FROM Distribuicaos WHERE Sigla = ? GROUP BY Material";

    var siglaEstado = req.body.sigla_estado.substr(3,4)
    
    con.query(quantMaterial, [siglaEstado], (err, queryMaterial, fields) => {
        con.query(frequenciaDatas, [siglaEstado], (err, queryData, fields) => {
            con.query(frequenciaMaterial, [siglaEstado], (err, queryFreqMaterial, fields) => {
                res.render('materiais', {
                    sigla: JSON.stringify(siglaEstado),
                    dadosMaterial: JSON.stringify(queryMaterial),
                    dadosData: JSON.stringify(queryData),
                    dadosFreqMaterial:  JSON.stringify(queryFreqMaterial)
                })
            })
        })
    })
})

app.post("/respiradores", (req, res) => { // Respiradores
    let quantRespirador = "SELECT SUM(QUANTIDADE) AS QUANTIDADE FROM distribuicao_respiradores WHERE UF = ?";
    let fornecedor = "SELECT SUM(QUANTIDADE) AS QUANTIDADE, FORNECEDOR FROM distribuicao_respiradores WHERE UF = ? GROUP BY FORNECEDOR";
    let fornecedorValor = "SELECT SUM(VALOR) AS VALOR, FORNECEDOR FROM distribuicao_respiradores WHERE UF = ? GROUP BY FORNECEDOR";
    let frequenciaRespirador = "SELECT SUM(QUANTIDADE) AS QUANTIDADE, DATA FROM distribuicao_respiradores WHERE UF = ? GROUP BY FORNECEDOR ORDER BY DATA";
    let frequenciaDatas = "SELECT COUNT(*) AS CONTADOR, SUM (QUANTIDADE) AS QUANTIDADE, DATA FROM distribuicao_respiradores WHERE UF = ? GROUP BY DATA ORDER BY QUANTIDADE DESC";

    let siglaEstado = req.body.sigla_estado.substr(3,4)

    con.query(quantRespirador, [siglaEstado], (err, queryQuantResp, fields) => {
        con.query(fornecedor, [siglaEstado], (err, queryFornecedor, fields) => {
            con.query(fornecedorValor, [siglaEstado], (err, queryFornecedorValor, fields) => {
                con.query(frequenciaRespirador, [siglaEstado], (err, queryFreqRespirador, fields) => {
                    con.query(frequenciaDatas, [siglaEstado], (err, queryFreqDatas, fields) =>{
                        res.render('respiradores', {
                            sigla: JSON.stringify(siglaEstado),
                            dadosQuantResp: JSON.stringify(queryQuantResp),
                            dadosFornecedor: JSON.stringify(queryFornecedor),
                            dadosFornecedorValor: JSON.stringify(queryFornecedorValor),
                            dadosFreqRespirador: JSON.stringify(queryFreqRespirador),
                            dadosFreqDatas: JSON.stringify(queryFreqDatas)
                        })
                    })
                })
            })
        })
    })
})


app.listen("8081", function () {
    console.log("Servidor rodando na url http://localhost:8081");
});