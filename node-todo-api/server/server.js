require('./config/config');

const express = require('express');
const bodyParser = require('body-parser');
const {ObjectID} = require('mongodb');
const _ = require('lodash');

const {mongoose} = require('./db/mongoose');
const {Todo} = require('./models/todo');
const {User} = require('./models/user');
const {authenticate} = require('./middleware/authenticate');

const app = express();

app.use(bodyParser.json());

app.post('/todos', authenticate, (request, response)=> {
    let theTodo = new Todo({
        text: request.body.text,
        _creator: request.user._id
    });
    
    theTodo.save().then((doc)=> {
        response.send(doc);
    }).catch((error)=> {
        response.status(400).send(error);
    });
});


app.get('/todos', authenticate, (request, response)=> {
    Todo.find({_creator: request.user._id}).then((todos)=> {
        response.send({todos});
    }).catch((error)=> {
        response.status(400).send(error);
    });
});

app.get('/todos/:id', authenticate, (request, response)=> {
    let id = request.params.id;
    
    if (!ObjectID.isValid(id)) {
        return response.status(404).send('Id not valid');
    }
    Todo.findOne({
        _id: id,
        _creator: request.user._id
    }).then((todo)=> {
        if (!todo) {
            return response.status(404).send('No todo found');
        }
        response.send({todo});
    }).catch(error=> response.status(400).send('Error occurred'));
    
});

// app.delete('/todos/:id', authenticate, (request, response)=> {
//     let id = request.params.id;
//     if (!ObjectID.isValid(id)) {
//         return response.status(404).send('Id not valid');
//     }
//     Todo.findOneAndDelete({
//         _id: id,
//         _creator: request.user._id
//     }).then((todo)=> {
//         if (!todo) {
//             return response.status(404).send('No todo found');
//         }
//         response.send({todo});
//     }).catch(error=> response.status(400).send());
// });

app.delete('/todos/:id', authenticate, async (request, response)=> {
    try {
        const id = request.params.id;
        if (!ObjectID.isValid(id)) {
            return response.status(404).send('Id not valid');
        }
        const todo = await Todo.findOneAndDelete({_id: id, _creator: request.user._id});
        if (!todo) {
            return response.status(404).send('No todo found');
        }
        response.send({todo});
    } catch(error) {
        response.status(400).send();
    }
});



app.patch('/todos/:id', authenticate, (request, response)=> {
    let id = request.params.id;
    let body = _.pick(request.body, ['text', 'completed']);
    if (!ObjectID.isValid(id)) {
        return response.status(404).send('Id not valid');
    }
    
    if (_.isBoolean(body.completed) && body.completed) {
        body.completedAt = new Date().getTime();
    } else {
        body.completed = false;
        body.completedAt = null;
    }
    
    Todo.findOneAndUpdate({
        _id: id,
        _creator: request.user._id
    }, {$set: body}, {new: true}).then((todo)=> {
        if (!todo) {
            return response.status(404).send('No todo found');
        }
        response.send({todo});
    }).catch((error)=> {
        response.status(400).send();
    });
});

// app.post('/users', (request, response)=> {
//     let body = _.pick(request.body, ['email', 'password']);
//     let user = new User(body);
//     user.save().then(()=> {
//         return user.generateAuthToken();
//     }).then((token)=> {
//         response.header('x-auth', token).send(user);
//     }).catch(error=> {
//         response.status(400).send(error);
//     });
// });

app.post('/users', async (request, response)=> {
    try {
        const body = _.pick(request.body, ['email', 'password']);
        const user = new User(body);
        await user.save();
        const token = await user.generateAuthToken();
        response.header('x-auth', token).send(user);
    } catch(error) {
        response.status(400).send(error);
    }
    
});



app.get('/users/me', authenticate, (request, response)=> {
    response.send(request.user);
});

// app.post('/users/login', (request, response)=> {
//     let body = _.pick(request.body, ['email', 'password']);
//     User.findByCredentials(body.email, body.password).then((user)=> {
        
//         return user.generateAuthToken().then((token)=> {
//             response.header('x-auth', token).send(user);
//         });
//     }).catch((error)=> {
//         response.status(400).send();
//     });    
// });
app.post('/users/login', async (request, response)=> {
    try {
        const body = _.pick(request.body, ['email', 'password']);
        const user = await User.findByCredentials(body.email, body.password);
        const token = await user.generateAuthToken();
        response.header('x-auth', token).send(user);
    } catch(e) {
        response.status(400).send();
    }
});

// app.delete('/users/me/token', authenticate, (request, response)=> {
//     request.user.removeToken(request.token).then(()=> {
//         response.status(200).send();
//     }).catch((error)=> {
//         response.status(400).send();
//     });
// });
app.delete('/users/me/token', authenticate, async (request, response)=> {
    try {
        await request.user.removeToken(request.token);
        response.status(200).send();
    } catch(e) {
        response.status(400).send();
    }
});

app.listen(process.env.PORT, process.env.IP, ()=> {
    console.log('Server started');
});

module.exports = {app};