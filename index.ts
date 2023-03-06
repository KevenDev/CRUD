//importar

import express from "express";
import data from './data.json';
import cors from 'cors'
import bodyParser from 'body-parser';
import Ajv from "ajv";

//express - framework
const app = express();

//ajv - biblioteca
const ajv = new Ajv();

//porta em que o servidor está
const port = process.env.PORT || 8080;

//regras da requisição - aceitar apenas oq foi passado
const userSchema = {
  type: 'object',
  properties: {
    name: { type: 'string' },
    email: { type: 'string' },
  },
  required: ['name', 'email'],
  additionalProperties: false,
};

const validate = ajv.compile(userSchema);

//ACESSO AUTORIZADO API
const corsOptions = {
  origin: '*'
}

app.use(cors(corsOptions));

//transformar em algo que o navegador possa ler
app.use(bodyParser.json());

// crinado endpoint - request - resposta - mapear array e trazer resposta 
app.get('/api/users', (req, res) =>{
  res.send(
    data.users.map((user: typeof data.users[number]) =>{
    return{
      id: user.id,
      email: user.email,
      name: user.name,
    }
  }));
});

//interface do usuário com propriedades - cadastro
interface NewUser{
  id: number
  name: string
  email: string
}

//validação de usuário
app.post('/api/users', (req, res) => {
  const newUser: NewUser = req.body
  const valid = validate(newUser)

  if(!valid){
    res.status(400).json({error: validate.errors})
  }else{
    //adiciona o id+1 fins de contagem
    newUser.id = data.users.length + 1;
    //adiciona novo usuário e retorna ele como cadastrado
    data.users.push(newUser);
    res.status(201).json(newUser);
  }
})

//alteração o conteudo de um objeto - usuário 

app.put('/api/users/:id/', (req, res) =>{
  const userId = Number(req.params.id)
  const userIndex = data.users.findIndex((user) => user.id === userId);
  if(userIndex === -1){
    res.status(404).json({error: 'Usuário não encontrado'})
  }else{
    //trocando o usuário pelo oq foi digitado
    const newUser = req.body;
    newUser.id = userId;
    data.users[userIndex] = newUser;
    res.status(200).json(newUser)
  }
})

//deletando usuário 
app.delete('/api/users/:id', (req, res) =>{
  const userId = Number(req.params.id)
  const userIndex = data.users.findIndex((user) => user.id === userId);
  if(userIndex === -1){
    res.status(404).json({error: 'Usuário não encontrado'})
  }else{
    data.users.splice(userIndex, 1);
    res.status(204).send('Usuario deletado')
  }
})

//pegando usuário a partir do ID
app.get('/api/users/:id', (req, res) =>{
  const userId = Number(req.params.id)
  const userIndex = data.users.findIndex((user) => user.id === userId);
  if(userIndex === -1){
    res.status(404).json({error: 'Usuário não encontrado'})
  }else{
    res.json(data.users[userIndex])
  }
})

//inicialização da porta - onde esperar esses requests
app.listen(port, ()=>{
  console.log(`Servidor iniciado na porta ${port}`);
})

// AJV - BIBLIOTECA PARA ESQUEMAS - 