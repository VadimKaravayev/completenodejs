const express = require('express');
const bodyParser = require('body-parser');
const {ObjectID} = require('mongodb');

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


app.get('/todos', (request, response)=> {
    Todo.find().then((todos)=> {
        response.send({todos});
    }).catch((error)=> {
        response.status(400).send(error);
    });
});

app.get('/todos/:id', (request, response)=> {
    let id = request.params.id;
    
    if (!ObjectID.isValid(id)) {
        return response.status(404).send('Id not valid');
    }
    Todo.findById(id).then((todo)=> {
        if (!todo) {
            return response.status(404).send('No todo found');
        }
        response.send({todo});
    }).catch(error=> response.status(400).send('Error occurred'));
    
});

app.listen(process.env.PORT, process.env.IP, ()=> {
    console.log('Server started');
});

module.exports = {app};