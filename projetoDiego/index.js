const express = require('express')
const app = express()
const bodyParser = require('body-parser')
app.set('view engine', 'ejs');
app.use(express.static('public'))
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
const conection = require("./dataBase/db")
const alarme = require("./Alarmes");
const Alarme = require('./Alarmes');

conection
  .authenticate()
  .then(() => {
    console.log("conexão ao banco feita com sucesso");
  })
  .catch((msgErro) => {
    console.log(msgErro);
  })

app.listen(8000, () => {
  console.log('servidor iniciado !!!')
})

app.get('/', (req, res) => {
  res.render('login/login')
  
})

app.get('/cadastro-de-usuario', (req, res) => {
  res.render('index.ejs')
})

/*----- cadastro ------*/ 

app.get('/cadastro-de-ambiente', (req, res) => {
  res.render('cadastros/cadastroDeAmbiente',{arvore: arvore,terminais:terminais
    , visitados:visitados})
})

app.get('/cadastro-de-equipamento', (req, res) => {
  res.render('cadastros/cadastroDeEquipamentos' ,{arvore: arvore,terminais:terminais
    , visitados:visitados})
})

var terminais = [
  {id:1	,nome:"1", local: 4, descricao:"computadores, impressora 3d1"},
  {id:2	,nome:"2", local: 4, descricao:"computadores, impressora 3d2"},
  {id:3	,nome:"3", local:	4, descricao:"computadores, impressora 3d3"},
  {id:4	,nome:"4",	local:4, descricao:"computadores, tv"},
  {id:5	,nome:"5",	local:4, descricao:"computadores"}
  ]
/*----- arvore ------*/ 
var arvore = [
  { id: 0, nome: "IFPE", sucessor: [1, 9, 15] },             //IIPE
  { id: 1, nome: "Local 1", sucessor: [2, 6] },           //  Local 1  
  { id: 2, nome: "Local 1.1", sucessor: [3, 4, 5,14] },      //      Local 1.1
  { id: 3, nome: "Local 1.1.1", sucessor: [] },           //          Local 1.1.1
  { id: 4, nome: "Local 1.1.2", sucessor: [] },           //          Local 1.1.2
  { id: 5, nome: "Local 1.1.3", sucessor: [] },           //          Local 1.1.3
  { id: 6, nome: "Local 1.2", sucessor: [7, 8] },         //      Local 1.2
  { id: 7, nome: "Local 1.2.1", sucessor: [] },           //          Local 1.2.1
  { id: 8, nome: "Local 1.2.2", sucessor: [] },           //          Local 1.2.2
  { id: 9, nome: "Local 2", sucessor: [10] },            //  Local 2
  { id: 10, nome: "Local 2.1", sucessor: [11, 12, 13] },  //      Local 2.2
  { id: 11, nome: "Local 2.1.1", sucessor: [] },          //          Local 2.2.1
  { id: 12, nome: "Local 2.1.2", sucessor: [] },          //          Local 2.2.2
  { id: 13, nome: "Local 2.1.3", sucessor: [] },           //          Local 2.2.3
  { id: 14, nome: "Local 1.1.4", sucessor: [] },
  { id: 15, nome: "Local 3", sucessor: [] } 
]

var visitados = []

organisar(0)

function organisar(a) {
  console.log(a)
  if(foiVisitado(a) === false){
      console.log(arvore[a].nome)
      visitados.push(a)
  }

  while(arvore[a].sucessor.length > 0) {
      var sucessor = arvore[a].sucessor[0]
      arvore[a].sucessor.splice(0,1);
      organisar(sucessor)
  }
}

function foiVisitado(a) {
  for (var l = 0; l < visitados.length; l++) {
      if (arvore[a].id == visitados[l]) {
          return true
      }
  }
  return false
}
/*----- fim arvore ------*/ 


/*----- fim cadastro ------*/ 
app.get('/gerenciar-itens-cadastrados', (req, res) => {
  res.render('cadastros/gerenciarItensCadastrados',{arvore: arvore,terminais:terminais
  , visitados:visitados})
})

app.get('/gerenciar-ambientes-cadastrados', (req, res) => {
  res.render('cadastros/gerenciarAmbientesCadastrados',{arvore: arvore, terminais:terminais,
  visitados: visitados})
})

app.get('/editar-equipamento', (req, res) => {
  res.render('cadastros/editarEquipamentos')
})


/*----- inicio relatórios------*/ 
app.get('/gastos-por-periodo', (req, res) => {
  res.render('relatorios/gastosPorPeriodo')
})

/*----- inicio retornos------*/
app.post('/loginUserAcess', (req, res) => {
  var nome = req.body.userName
  var senha = req.body.userPassword
  console.log("recebido usuario:" + nome+ " senha: " + senha)
  res.redirect('/cadastro-de-ambiente')
})

app.post('/cadastroAmbienteSave', (req, res) => {
  var nomeAmbiente = req.body.nomeAmbiente
  var check = req.body.marca1
  if(check === undefined){
    var tipoAmbiente = req.body.tipoAmbiente
  }else{
    var tipoAmbiente = req.body.tipodeAm
    console.log("check ativado")
  }
  console.log("nome do ambiente:" + nomeAmbiente)
  console.log("tipo do ambiente:" + tipoAmbiente )
  console.log("check:" + check )
  res.redirect('/cadastro-de-ambiente')
})

/*-----------------Alarmes----------- */

app.get('/new-alarme', (req, res) => {
  res.render('alarmes/CriarAlarme')
})

app.post("/salvarAlarme", (req, res) => {
  var nome = req.body.nome;
  var horario1 = req.body.horario1;
  var horario2 = req.body.horario2;
  var data = req.body.data;
  var checkboxes= req.body.checkboxes;
  Alarme.create({
    nome: nome,
    horario1: horario1,
    horario2: horario2,
    data: data
  }).then(() => {
   res.redirect("/");
})
 
});