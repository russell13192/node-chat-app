// Author: George Murray
// Description: Client side javascript implementation for chat app

var socket = io(); // Client makes request to server to open up a web socket and keep connection open
function scrollToBottom () {
    // Selectors
    var messages = jQuery('#messages');
    var newMessage = messages.children('li:last-child');
    // Heights
    var clientHeight = messages.prop('clientHeight');
    var scrollTop = messages.prop('scrollTop');
    var scrollHeight =  messages.prop('scrollHeight');
    var newMessageHeight = newMessage.innerHeight();
    var lastMessageHeight = newMessage.prev().innerHeight();
    
    if (clientHeight + scrollTop + newMessageHeight + lastMessageHeight >= scrollHeight) {
       messages.scrollTop(scrollHeight);
        
    }

}
// Listening for client-server connection
socket.on('connect', function () {
    var params = jQuery.deparam(window.location.search);
    socket.emit('join', params, function (err) {
        if (err) {
            alert(err);
            window.location.href = '/' // If an error is returned send user back to index page
        }
        else {
            console.log('No error');
            
        }
    });


});
// Listening for client-server disconnection - Not a custom event
socket.on('disconnect', function () {
    console.log('Disconnected from server');
});

socket.on('updateUserList', function (users) {
    var ol = jQuery('<ol></ol>');

    users.forEach(function (user) {
        ol.append(jQuery('<li></li>').text(user));
    });

    jQuery('#users').html(ol);
    
});
// Listening for newMessage event from server and printing to console
socket.on('newMessage', function (message) {
    var formattedTime = moment(message.createdAt).format('h:mm a');
    var template = jQuery('#message-template').html();
    var html = Mustache.render(template, {
        text: message.text,
        from: message.from,
        createdAt: formattedTime
    });

    jQuery('#messages').append(html);
    scrollToBottom();
    
    // var li = jQuery('<li></li>');
    // li.text(`${message.from} ${formattedTime}: ${message.text}`);

    // jQuery('#messages').append(li);
});

socket.on('newLocationMessage', function (message) {
    var formattedTime = moment(message.createdAt).format('h:mm a');
    var template = jQuery('#location-message-template').html();
    var html = Mustache.render(template, {
        from: message.from,
        url: message.url,
        createdAt: formattedTime
    });
   
    jQuery('#messages').append(html);
    // var li = jQuery('<li></li>');
    // var a = jQuery('<a target="_blank">My current location</a>');

    // li.text(`${message.from} ${formattedTime}: `);
    // a.attr('href', message.url);
    // li.append(a);
    // jQuery('#messages').append(li);
    scrollToBottom();
});

// Using jQuery to create custom event when message form is submitted
jQuery('#message-form').on('submit', function (e) {
    e.preventDefault();
    var messageTextBox = jQuery('[name=message]'); // Using jQuery to target input field with name attribute set to message

    socket.emit('createMessage', {   
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