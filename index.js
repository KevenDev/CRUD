"use strict";
//importar
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const data_json_1 = __importDefault(require("./data.json"));
const cors_1 = __importDefault(require("cors"));
const body_parser_1 = __importDefault(require("body-parser"));
const ajv_1 = __importDefault(require("ajv"));
//express - framework
const app = (0, express_1.default)();
//ajv - biblioteca
const ajv = new ajv_1.default();
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
};
app.use((0, cors_1.default)(corsOptions));
//transformar em algo que o navegador possa ler
app.use(body_parser_1.default.json());
// crinado endpoint - request - resposta - mapear array e trazer resposta 
app.get('/api/users', (req, res) => {
    res.send(data_json_1.default.users.map((user) => {
        return {
            id: user.id,
            email: user.email,
            name: user.name,
        };
    }));
});
//validação de usuário
app.post('/api/users', (req, res) => {
    const newUser = req.body;
    const valid = validate(newUser);
    if (!valid) {
        res.status(400).json({ error: validate.errors });
    }
    else {
        //adiciona o id+1 fins de contagem
        newUser.id = data_json_1.default.users.length + 1;
        //adiciona novo usuário e retorna ele como cadastrado
        data_json_1.default.users.push(newUser);
        res.status(201).json(newUser);
    }
});
//alteração o conteudo de um objeto - usuário 
app.put('/api/users/:id/', (req, res) => {
    const userId = Number(req.params.id);
    const userIndex = data_json_1.default.users.findIndex((user) => user.id === userId);
    if (userIndex === -1) {
        res.status(404).json({ error: 'Usuário não encontrado' });
    }
    else {
        //trocando o usuário pelo oq foi digitado
        const newUser = req.body;
        newUser.id = userId;
        data_json_1.default.users[userIndex] = newUser;
        res.status(200).json(newUser);
    }
});
//deletando usuário 
app.delete('/api/users/:id', (req, res) => {
    const userId = Number(req.params.id);
    const userIndex = data_json_1.default.users.findIndex((user) => user.id === userId);
    if (userIndex === -1) {
        res.status(404).json({ error: 'Usuário não encontrado' });
    }
    else {
        data_json_1.default.users.splice(userIndex, 1);
        res.status(204).send('Usuario deletado');
    }
});
//pegando usuário a partir do ID
app.get('/api/users/:id', (req, res) => {
    const userId = Number(req.params.id);
    const userIndex = data_json_1.default.users.findIndex((user) => user.id === userId);
    if (userIndex === -1) {
        res.status(404).json({ error: 'Usuário não encontrado' });
    }
    else {
        res.json(data_json_1.default.users[userIndex]);
    }
});
//inicialização da porta - onde esperar esses requests
app.listen(port, () => {
    console.log(`Servidor iniciado na porta ${port}`);
});
// AJV - BIBLIOTECA PARA ESQUEMAS - 
