require("dotenv-safe").config();
const jwt = require('jsonwebtoken');

const http = require('http');
const express = require('express');
const app = express();

const bodyParser = require('body-parser');
app.use(bodyParser.json());

app.get('/', (req, res, next) => {
    res.json({message: "Tudo OK!"});
})

app.get('/clientes', verifyJWT, (req, res, next) => {
    console.log("Retornou todos os clientes");
    res.json([
        {
            id: 1,
            nome: 'Alice'
        }
    ]);
})

app.post('/login', (req, res, next) => {
    if(req.body.user === 'alice' && req.body.password === '123') {
        const id = 1; //esse id viria do bd
        const token = jwt.sign({id}, process.env.SECRET,{token: token});
        return res.json({ auth: true, token: token})
    }
    res.status(500).json({message: 'Login invalido'});
})

app.post('/logout', function(req, res){
    res.json({auth: false, token: null});
})

function verifyJWT(req, res, next) {
    const token = req. headers['x-acces-token'];
    if (!token) return res.status(401).json({auth: false, message: 'No token provided'});

    jwt.verify(token, process.env.SECRET, 
        function(err, decoded) {
            if (err) return res.status(500).json({auth:false, message: 'Failed to authenticate token'})

            //se tudo estiver ok, salva no request para uso posterior
            req.userId = decoded.id;
            next();
    });
}

const server = http.createServer(app);
server.listen(3000);
console.log("Servidor escutando na porta 3000");