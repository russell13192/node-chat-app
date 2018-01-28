//Author: George Murray

const path = require('path'); // Loading Path Parsing Library
const http = require('http'); // Loading HTTP Server Library
var port = 3000;
const express = require('express'); // Loading Node server Library
const socketIO = require('socket.io'); // Loading Socket IO Library

const publicPath = path.join(__dirname, '../public'); // Concatenating Path to index.html page

var port = process.env.PORT || 3000; // Assigning and configuring port variable
var app = express(); // Initializing Express Library Server
var server = http.createServer(app); // Creating HTTP Server
var io = socketIO(server); // Create Web Sockets server by passing in HTTP Server as construction argument (Communicator between Server and Client)

app.use(express.static(publicPath));

// Listening for client-server connection
io.on('connection', (socket) => {
    console.log('New user connected');
    
    // Emitting custon event "newEmail" sending object 
    socket.emit('newMessage', {
        from: 'John',
        text: 'I need to get laid',
        createdAt: 123123
    });

    socket.on('createMessage', (message) => {
        console.log('createMessage', message); // message variable is data supplied from client
        
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


