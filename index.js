const express = require('express');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const port = 3000;

// Tell express to use the public folder for static files
app.use(express.static('public'));

// Create a route which responds to Get requests
app.get('/', (req, res) => {
    // As a response send a file
    res.sendFile(__dirname + '/public/index.html');
});

// When a connection has been established take in socket
io.on('connection', (socket) => {
    // On connection log a message with the socket id
    console.log('a user is connected', socket.client.id);
    // If the chat message event has been triggered receive msg
    socket.on('chat message', (msg) => {
        // Trigger the chat message event and pass in the value received
        io.emit('chat message', msg);
        // Log the value
        console.log(`message: ${msg}`);
    });
    // On disconnection, log a message with the socket id
    socket.on('disconnect', () => {
        console.log('a user is disconnected', socket.client.id);
    });
});

http.listen(port, () => {
    console.log(`listening on port: ${port}`); 
});