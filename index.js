const express = require('express');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const port = 3000;


app.use(express.static('public'));  // Tell express to use the public folder for static files.


app.get('/', (req, res) => {    // Create a route which responds to Get requests.
    res.sendFile(__dirname + '/public/index.html'); // As a response send a file.
});

io.on('connection', (socket) => {   // When a connection has been established take in socket.
    console.log('a user is connected', socket.client.id);   // On connection log a message with the socket id.

    socket.on('chat message', (msg) => {    // If the chat message event has been triggered receive msg.
        
        io.emit('chat message', msg);   // Trigger the chat message event and pass in the value received.
        
        console.log(`message: ${msg}`); // Log the value.
    });

    
    socket.on('disconnect', () => { // On disconnection, log a message with the socket.client.id .

        console.log('a user is disconnected', socket.client.id);

        io.emit('terminated', socket.client.id);    // On disconnection send the socket.client.id to the client side.
    });

    
    io.emit('connected', socket.client.id);     // On connection send the socket.client.id to the client side.


    socket.on('typing', (who) => {  // When a user types pass in who
        io.emit('typing', who);     // Trigger the event and receive who which will be a string "a user is typing..." .
        console.log(who);
    });


    socket.on('notTyping', (who) => {   // When a user stops typing pass in who.
        io.emit('notTyping', who);      // Trigger the event and receive who which will be an empty string.
        console.log(who, 'user no long typing...');
    });
});

http.listen(port, () => {
    console.log(`listening on port: ${port}`); 
});