let socket = io();

function scrollToBottom() {
    let messages = $('#messages');
    let newMessage = messages.children('li:last-child');
    let clientHeight = messages.prop('clientHeight');
    let scrollTop = messages.prop('scrollTop');
    let scrollHeight = messages.prop('scrollHeight');
    let newMessageHeight = newMessage.innerHeight();
    let lastMessageHeight = newMessage.prev().innerHeight();
    if (clientHeight + scrollTop + newMessageHeight + lastMessageHeight >= scrollHeight) {
        messages.scrollTop(scrollHeight);
    }
}

socket.on('connect', function() {
    console.log('Connected to server');
    let params = $.deparam(window.location.search);
    console.log(params);
    socket.emit('join', params, function(err) {
        if (err) {
            alert(err);
            window.location.href = '/';
        }
    });
    
});

socket.on('updateUserList', function(users) {
    console.log('Users list ', users);
    let ol = $('<ol></ol>');
    users.forEach(function(user) {
        ol.append($('<li></li>').text(user));
    });
    $('#users').html(ol);
});

socket.on('disconnect', function() {
    console.log('Disconnected from server');
});

socket.on('newMessage', (message)=> {
    let formattedTime = moment(message.createdAt).format('h:mm a');
    let template = $('#message-template').html();
    let html = Mustache.render(template, {
        from: message.from, 
        text: message.text,
        createdAt: formattedTime
    });
    $('#messages').append(html);
    scrollToBottom();
    
});

socket.on('newLocationMessage', function(message) {
    let template = $('#location-message-template').html();
    let formattedTime = moment(message.createdAt).format('h:mm a');
    let html = Mustache.render(template, {
        from: message.from,
        url: message.url,
        createdAt: formattedTime
    });
    $('#messages').append(html);
    scrollToBottom();
    
});

$('#message-form').on('submit', function(e) {
   e.preventDefault();
   let messageTextbox = $('[name=message]');
   socket.emit('createMessage', {
       //from: 'User',
       text: messageTextbox.val()
   }, function() {
       messageTextbox.val('');
   });
});

let locationButton = $('#send-location');
locationButton.on('click', function() {
    if (!navigator.geolocation) {
        return alert("Geolocation is not supported");
    }
    locationButton.attr('disabled', 'disabled').text('Sending location...');
    navigator.geolocation.getCurrentPosition(function(position) {
        locationButton.removeAttr('disabled').text('Send location');
        socket.emit('createLocationMessage', {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
        });
        
    }, function() {
        locationButton.removeAttr('disabled').text('Send location');
        alert('Unable to fetch location');
    });
});