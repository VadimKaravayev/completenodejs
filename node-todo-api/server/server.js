const express = require('express');
const bodyParser = require('body-parser');

const {mongoose} = require('./db/mongoose');
const {Todo} = require('./models/todo');
const {User} = require('./models/user'); 

const app = express();

app.use(bodyParser.json());

app.post('/todos', (request, response)=> {
    let theTodo = new Todo({
        text: request.body.text
    });
    
    theTodo.save().then((doc)=> {
        response.send(doc);
    }).catch((error)=> {
        response.status(400).send(error);
    });
});

app.listen(process.env.PORT, process.env.IP, ()=> {
    console.log('Server started');
});

module.exports = {app};