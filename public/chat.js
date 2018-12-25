$(() => {
    let socket = io();
    socket.connect('http:localhost:3000');
    $('form').submit(() => {
        /*
         When you submit the form emit an event called chat message
        which should match the event name setup in the backend
        and send the value of the input which will be received in
        the backend and then display it.
        */ 
        socket.emit('chat message', $('#m').val());
        // After sending the data empty the input field
        $('#m').val('');
        // Exit
        return false;
    });
    // If the chat message is triggered in the backend receive the value
    socket.on('chat message', (msg) => {
        // Add the value to the page within an LI element
        $('#messages').append($('<li>').text(msg));
    });
    // When connected receive the socket.client.id and append it
    socket.on('connected', (user) => {
        $('#messages').append($('<li>').text(`Connected user: ${user}`));
    });
    // When disconnected receive the socket.client.id and append it
    socket.on('terminated', (user) => {
        $('#messages').append($('<li>').text(`User disconnected: ${user}`));
    });
});