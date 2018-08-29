const express = require('express');
const app = express();
const http = require('http').Server(app)
const io = require('socket.io')(http);
const port = 3000;

app.get('/', (req, res) => {
    app.use(express.static('public'));
    res.sendFile(__dirname + "/public/index.html");
});

io.on('connection', (socket) => {
    console.log('a user connected');
    socket.on('chat message', function(msg){
        console.log('message: ' + msg);
      });
    socket.on('disconnect', () => {
        console.log('user disconnected'); 
    });
});

http.listen(port, console.log(`The server has started on port ${port}`)
);

