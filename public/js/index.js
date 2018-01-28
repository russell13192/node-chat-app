// Author: George Murray
// Description: Client side javascript implementation for chat app

var socket = io(); // Client makes request to server to open up a web socket and keep connection open
// Listening for client-server connection
socket.on('connect', function () {
    console.log('Connected to server');


});
// Listening for client-server disconnection - Not a custom event
socket.on('disconnect', function () {
    console.log('Disconnected from server');
});
// Listening for newMessage event from server and printing to console
socket.on('newMessage', function (message) {
    console.log('newMessage', message);
    var li = jQuery('<li></li>');
    li.text(`${message.from}: ${message.text}`);

    jQuery('#messages').append(li);
});


// Using jQuery to create custom event when message form is submitted
jQuery('#message-form').on('submit', function (e) {
    e.preventDefault();

    socket.emit('createMessage', {
        from: 'User',
        text: jQuery('[name=message]').val() // Using jQuery to target input field with name attribute set to message
    }, function () {

    });
});