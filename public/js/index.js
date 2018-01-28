var socket = io(); // Client makes request to server to open up a web socket and keep connection open
// Listening for client-server connection
socket.on('connect', function () {
    console.log('Connected to server');

    // Emitting custom event "createMessage" - socket emits message-type object that server receives.
    socket.emit('createMessage', {
        from: 'Paige',
        text: 'Save the fat cats!!'
    });
});
// Listening for client-server disconnection - Not a custom event
socket.on('disconnect', function () {
    console.log('Disconnected from server');
});

socket.on('newMessage', function (message) {
    console.log('newMessage', message);
    
});