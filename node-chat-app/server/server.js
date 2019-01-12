const path = require('path');
const http = require('http');
const express = require('express');
const app = express();
const server = http.createServer(app);
const socketIO = require('socket.io');
const io = socketIO(server);

const publicPath = path.join(__dirname, '../public');

const {generateMessage, generateLocationMessage} = require('./utils/message');

app.use(express.static(publicPath));

io.on('connection', (socket)=> {
    console.log('New user connected');
    
    socket.emit('newMessage', generateMessage('Admin', 'Welcome to the chat'));
    
    socket.broadcast.emit('newMessage', generateMessage('Admin', 'New user joined'));
    
    socket.on('createMessage', function(message, callback) {
        console.log('Create new message ', message);
        io.emit('newMessage', generateMessage(message.from, message.text));
        callback('This is from server');
    });
    
    socket.on('createLocationMessage', (coords)=> {
        io.emit('newLocationMessage', generateLocationMessage('Admin', coords.latitude, coords.longitude));
    });
    
    socket.on('disconnect', ()=> {
        console.log('User disconnected');
    });
});


server.listen(process.env.PORT, process.env.IP, ()=> {
    console.log('Server started on port ', process.env.PORT);   
});