const path = require('path');
const http = require('http');
const express = require('express');
const app = express();
const server = http.createServer(app);
const socketIO = require('socket.io');
const io = socketIO(server);

const publicPath = path.join(__dirname, '../public');

const {generateMessage, generateLocationMessage} = require('./utils/message');
const {isRealString} = require('./utils/validation');
const {Users} = require('./utils/users');
let users = new Users();

app.use(express.static(publicPath));

io.on('connection', (socket)=> {
    console.log('New user connected');
    
    
    
    socket.on('join', (params, callback)=> {
        if (!isRealString(params.name) || !isRealString(params.room)) {
            return callback('Name and room are required');
        }
        socket.join(params.room);
        //users.removeUser(socket.id);
        console.log(socket.id);
        console.log('Type of socke it: ', typeof socket.id);
        let added = users.addUser(socket.id, params.name, params.room);
        console.log('added: ', added);
        io.to(params.room).emit('updateUserList', users.getUserList(params.room));
        console.log('List of users: ', users.getUserList(params.room));
        socket.emit('newMessage', generateMessage('Admin', 'Welcome to the chat'));
        socket.broadcast.to(params.room).emit('newMessage', generateMessage('Admin', `${params.name} has joined`));
        
        callback();
    });
    
    
    
    socket.on('createMessage', function(message, callback) {
        let user = users.getUser(socket.id);
        if (user && isRealString(message.text)) {
            io.to(user.room).emit('newMessage', generateMessage(user.name, message.text));
        }
        callback('This is from server');
    });
    
    socket.on('createLocationMessage', (coords)=> {
        let user = users.getUser(socket.id);
        if (user) {
            io.to(user.room).emit('newLocationMessage', generateLocationMessage(user.name, coords.latitude, coords.longitude));
        }
    });
    
    socket.on('disconnect', ()=> {
        let user = users.removeUser(socket.id);
        if (user) {
            io.to(user.room).emit('updateUserList', users.getUserList(user.room));
            io.to(user.room).emit('newMessage', generateMessage('Admin', `${user.name} has left.`));
        }
        console.log('User disconnected');
    });
});


server.listen(process.env.PORT, process.env.IP, ()=> {
    console.log('Server started on port ', process.env.PORT);   
});