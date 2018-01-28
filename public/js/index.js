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

socket.on('newLocationMessage', function (message) {
    var li = jQuery('<li></li>');
    var a = jQuery('<a target="_blank">My current location</a>');

    li.text(`${message.from}: `);
    a.attr('href', message.url);
    li.append(a);
    jQuery('#messages').append(li);
});

// Using jQuery to create custom event when message form is submitted
jQuery('#message-form').on('submit', function (e) {
    e.preventDefault();
    var messageTextBox = jQuery('[name=message]'); // Using jQuery to target input field with name attribute set to message

    socket.emit('createMessage', {
        from: 'User',
        text: messageTextBox.val() 
    }, function () {
        messageTextBox.val('');

    });
});

// Target button with id of "send-location"
var locationButton = jQuery('#send-location');
// Applying listener for on click event for accessing client location 
locationButton.on('click', function () {
    // If browser does not support geolocation library
    if (!navigator.geolocation) {
        return alert('Geolocation not supported by your browser')
    }

    locationButton.attr('disabled', 'disabled').text('Sending Location...');
    // If client aggress to share location and browser supports geolocation api, retrieval execute "navigator.geolocation.getCurrentPosition" call
    navigator.geolocation.getCurrentPosition(function (position) {
        // If browser supports geolocation api attempy call and re-enable send location button
        locationButton.removeAttr('disabled').text('Send Location');
        // send client's position to server by extracting attributes from the JSON data
        socket.emit('createLocationMessage', {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
        });
        
    }, function () {
        locationButton.removeAttr('disabled').text('Send Location');
        alert('Unable to fetch location');
    });
});