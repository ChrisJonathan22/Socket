const express = require('express'); // Require Express to this file.
const app = express();  // Initialise the an Express app.
const http = require('http').Server(app);   // Require the http module, use the Server method and supply it with app.
const io = require('socket.io')(http);  // Require Socket.io and supply it with the http server.
const port = 3000;  // Create a port number.
const util = require('util');   // Require Util.
const listOfNames = require('./names'); // Require the file names.js and store it in this variable.
const names = listOfNames.names;        // Access the names array and store it in this variable.


let users = {list: []}; // This is where each connected and disconnected users will be stored.
let latestUser; //  This is where the last connected user will be stored.
let author; // If the chat message event receives an object this is where the author will be stored.

app.use(express.static('public'));  // Tell express to use the public folder for static files.


app.get('/', (req, res) => {    // Create a route which responds to Get requests.
    res.sendFile(__dirname + '/public/index.html'); // As a response send a file.
});

io.on('connection', (socket) => {   // When a connection has been established take in socket.
    console.log(socket.client.id);

    let randomNumber = Math.floor(Math.random() * 152) + 1; // Generate a random number.
    
    users.list.push({[socket.client.id]: names[randomNumber]});   // Add the unique socket.client.id to the array list within the object users as a property and use the random name as the value.

    latestUser = users.list[users.list.length - 1][socket.client.id];    // Store the latest connected user.

    console.log('a user is connected', latestUser);   // On connection log a message with the latest connected user.
    
    socket.broadcast.emit('connected', latestUser);     // On connection send the latest connected user to the client side which will be added to the end of the list.

    socket.on('chat message', (msg) => {    // If the chat message event has been triggered receive msg.
        
        if(typeof msg == "object") {  // If msg is a type of object do this.
            
            for(let i = 0; i < users.list.length; i++) {    // Loop through the list of connected users which is an array of objects.

                if(users.list[i].hasOwnProperty(socket.client.id) == true){ /* 
                                                                                If one of the users.list item(object)
                                                                                has a property matching the unique socket.client.id, do this.
                                                                                In other words, if the connected socket matches one of the sockets
                                                                                within the list take its value which will be a name.
                                                                            */
                    author = users.list[i][socket.client.id];   // Store the value found inside this variable.
                }

                else {  // If the socket sending the message doesn't match any of the connected users, do this.

                    console.log("No author matched.");  // Log this message.
                }

                Object.keys(users.list[i]).forEach((key) => {   // Loop through each object and grab its value.

                    if(users.list[i][key] == msg.user) {    /* 
                                                                Compare the name sent along with the message with the value found within one of the connected users.
                                                                If there is a match, do this.
                                                            */
                        socket.to(Object.getOwnPropertyNames(users.list[i])).emit('chat message', `${author}: ${msg.targetText}`);  // Send a private message to the matching socket.

                        // console.log("This is the property",Object.getOwnPropertyNames(users.list[i]));    
                        console.log("User found.");
                    }
                    else {  // If no users match, the user must be offline.

                        console.log("User not found!"); //
                    }
                });
            }
        }

        else {  // If msg isn't an Object do this.

        // Loop through the users.list array which contains connected users.
        for(let i = 0; i < users.list.length; i++) {
            if(users.list[i].hasOwnProperty(socket.client.id) == true){ // If one of the users.list item(object) has a property matching the unique socket.client.id, do this.

                socket.broadcast.emit('chat message', `${users.list[i][socket.client.id]}: ${msg}`);   // Trigger the chat message event and pass in the value received + a user which will be the value from the matched property.

                console.log(users.list[i][socket.client.id]);   // Log the user name matched.

                console.log(`${users.list[i][socket.client.id]}: ${msg}`); // Log the value.
            }
            else {  // If there aren't any matches log the message below.
                console.log("No match!");              
            }
        }        
        console.log(util.inspect(users.list, {showHidden: false, depth: null}));    // Log the array of connected users.
    }
    });

    socket.on('typing', (who) => {  // When a user types pass in who
        socket.broadcast.emit('typing', who);     // Trigger the event and receive who which will be a string "a user is typing..." .
        console.log(who);
    });


    socket.on('notTyping', (who) => {   // When a user stops typing pass in who.
        socket.broadcast.emit('notTyping', who);      // Trigger the event and receive who which will be an empty string.
        console.log(who, 'user no longer typing...');
    });

    socket.on('disconnect', () => { // On disconnection, log a message with the disconnected user's name.

        console.log('a user is disconnected', latestUser);  // Log the latest disconnected user.
        socket.broadcast.emit('terminated', latestUser);    // On disconnection send the disconnected user's name to the client side.
    });
});

http.listen(port, () => {   // Start the server and listen on port: 3000.
    console.log(`listening on port: ${port}`); 
});