//Author: George Murray

const path = require('path'); // Loading Path Parsing Library
const http = require('http'); // Loading HTTP Server Library
var port = 3000;
const express = require('express'); // Loading Node server Library
const socketIO = require('socket.io'); // Loading Socket IO Library
const {generateMessage} = require('./utils/message');
const publicPath = path.join(__dirname, '../public'); // Concatenating Path to index.html page

var port = process.env.PORT || 3000; // Assigning and configuring port variable
var app = express(); // Initializing Express Library Server
var server = http.createServer(app); // Creating HTTP Server
var io = socketIO(server); // Create Web Sockets server by passing in HTTP Server as construction argument (Communicator between Server and Client)

app.use(express.static(publicPath));

// Listening for client-server connection
io.on('connection', (socket) => {
    console.log('New user connected');
    
    // socket.emit to user who enjoyed from: Admin text: Welcome to the chat app
    socket.emit('newMessage', generateMessage('Admin', 'Welcome to the chat app'));

    // socket.broadcast.emit to all users already in chat room that new user had joined
    socket.broadcast.emit('newMessage', generateMessage('Admin', 'New user joined'));
    
    // message variable is data supplied from client
    socket.on('createMessage', (message, callback) => {
        console.log('createMessage', message); // message variable is data supplied from client
        //io will send off data to all clients not just one connected to a particular client
        io.emit('newMessage', generateMessage(message.from, message.text));
        callback('This is from the server');
        // Send event to all sockets except for this one
        // socket.broadcast.emit('newMessage', {
        //     from: message.from,
        //     text: message.text,
        //     createdAt: new Date().getTime()
        // });
    });

    // Listening for client-server disconnection
    socket.on('disconnect', () => {
        console.log('User was disconnected');
    });
});

// Instructing server to listen on particular port based upon environment
server.listen(port, () => {
    console.log(`Started on port ${port}`);  
});


