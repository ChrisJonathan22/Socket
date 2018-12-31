$(() => {
    let socket = io();
    socket.connect('http://localhost:3000');

    $('#m').click(()=> {    // When a user clicks inside the input field, show the element with an id of typing.  
        
        socket.emit('typing', "a user is typing...");   // Trigger the event and pass in the value.
    });

    
    $('#m').blur(() => {    // When the user clicks outside the input field, hide the element with an id of typing.

        socket.emit('notTyping', " ");   // Trigger the event.
    });

    socket.on('typing', (who) => {  // Create an event for when a user types.

        $('#typing').show();    // When the user starts typing show the text.

        $('#typing').text(who);     // Receive the value sent and add or replace the content of #typing with the value received.
    });

    socket.on('notTyping', (who) => {   // Create an event for when a user stops typing.
        $('#typing').text(who);         // Receive the value sent and add or replace the content of #typing with the value received.
    });

    $('form').submit(() => {    // When a user submits his or her message, hide the element with an id of typing.
        $('#typing').hide();
       
       /*
         When you submit the form trigger an event called chat message
        which should match the event name setup in the backend
        and send the value of the input which will be received in
        the backend and then display it.
        Add the random number before the message.
        */ 
        socket.emit('chat message', `: ${$('#m').val()}`);

        $('#m').val('');    // After sending the data empty the input field.
        
        return false;   // Exit.
    });

    socket.on('chat message', (msg) => {    // Create an event called chat message which receives a value = msg.
        
        $('#messages').append($('<li>').text(msg)); // Add the value to the page within an LI element.
    });

    
    socket.on('connected', (user) => {  // Create an event called connected which receives user.

        $('#users').append($('<li>').text(user)); // Use the random number to pick a name and append the name to the element with an id of users.
        
        $('#messages').append($('<li>').text(`Connected user: ${user}`));   // Receive user = socket.client.id and append it.
    });
    
    socket.on('terminated', (user) => { // Create an event called terminated which receives user.

        $('#messages').append($('<li>').text(`User disconnected: ${user}`));    // Receive user = socket.client.id and append it
    });
});
