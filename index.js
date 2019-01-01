const express = require('express');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const port = 3000;
const util = require('util');

// This is an array of names which will be used as nicknames for every new message and connected users. The names will be picked by random.
let names = ['Allison',
    'Arthur',
    'Ana',  
    'Alex',
    'Arlene',
    'Alberto',
    'Barry',
    'Bertha',
    'Bill',
    'Bonnie',
    'Bret',
    'Beryl',
    'Chantal',
    'Cristobal',
    'Claudette',
    'Charley',
    'Cindy',
    'Chris',
    'Dean',
    'Dolly',
    'Danny',
    'Danielle',
    'Dennis',
    'Debby',
    'Erin',
    'Edouard',
    'Erika',
    'Earl',
    'Emily',
    'Ernesto',
    'Felix',
    'Fay',
    'Fabian',
    'Frances',
    'Franklin',
    'Florence',
    'Gabielle',
    'Gustav',
    'Grace',
    'Gaston',
    'Gert',
    'Gordon',
    'Humberto',
    'Hanna',
    'Henri',
    'Hermine',
    'Harvey',
    'Helene',
    'Iris',
    'Isidore',
    'Isabel',
    'Ivan',
    'Irene',
    'Isaac',
    'Jerry',
    'Josephine',
    'Juan',
    'Jeanne',
    'Jose',
    'Joyce',
    'Karen',
    'Kyle',
    'Kate',
    'Karl',
    'Katrina',
    'Kirk',
    'Lorenzo',
    'Lili',
    'Larry',
    'Lisa',
    'Lee',
    'Leslie',
    'Michelle',
    'Marco',
    'Mindy',
    'Maria',
    'Michael',
    'Noel',
    'Nana',
    'Nicholas',
    'Nicole',
    'Nate',
    'Nadine',
    'Olga',
    'Omar',
    'Odette',
    'Otto',
    'Ophelia',
    'Oscar',
    'Pablo',
    'Paloma',
    'Peter',
    'Paula',
    'Philippe',
    'Patty',
    'Rebekah',
    'Rene',
    'Rose',
    'Richard',
    'Rita',
    'Rafael',
    'Sebastien',
    'Sally',
    'Sam',
    'Shary',
    'Stan',
    'Sandy',
    'Tanya',
    'Teddy',
    'Teresa',
    'Tomas',
    'Tammy',
    'Tony',
    'Van',
    'Vicky',
    'Victor',
    'Virginie',
    'Vince',
    'Valerie',
    'Wendy',
    'Wilfred',
    'Wanda',
    'Walter',
    'Wilma',
    'William',
    'Kumiko',
    'Aki',
    'Miharu',
    'Chiaki',
    'Michiyo',
    'Itoe',
    'Nanaho',
    'Reina',
    'Emi',
    'Yumi',
    'Ayumi',
    'Kaori',
    'Sayuri',
    'Rie',
    'Miyuki',
    'Hitomi',
    'Naoko',
    'Miwa',
    'Etsuko',
    'Akane',
    'Kazuko',
    'Miyako',
    'Youko',
    'Sachiko',
    'Mieko',
    'Toshie',
    'Junko'];

let users = {list: []}; // This is where each connected user will be stored.
let latestUser; //  This is where the last connected user will be stored.

app.use(express.static('public'));  // Tell express to use the public folder for static files.


app.get('/', (req, res) => {    // Create a route which responds to Get requests.
    res.sendFile(__dirname + '/public/index.html'); // As a response send a file.
});

io.on('connection', (socket) => {   // When a connection has been established take in socket.

    let randomNumber = Math.floor(Math.random() * 152) + 1; // Generate a random number.
    
    users.list.push({[socket.client.id]: names[randomNumber]});   // Add the unique socket.client.id to the array list within the object users as a property and use the random name as the value.

    latestUser = users.list[users.list.length - 1][socket.client.id];    // Store the latest connected user.

    console.log('a user is connected', latestUser);   // On connection log a message with the latest connected user.
    
    socket.broadcast.emit('connected', latestUser);     // On connection send the latest connected user to the client side which will be added to the end of the list.

    socket.on('chat message', (msg) => {    // If the chat message event has been triggered receive msg.
        
        // Loop through the users.list array.
        for(let i = 0; i < users.list.length; i++) {
            if(users.list[i].hasOwnProperty(socket.client.id) == true){ // If one of the users.list item(object) has a property matching the unique socket.client.id .

                socket.broadcast.emit('chat message', `${users.list[i][socket.client.id]} ${msg}`);   // Trigger the chat message event and pass in the value received + a user which will be the value from the matched property.

                console.log(users.list[i][socket.client.id]);   // Log the user name matched.

                console.log(`${users.list[i][socket.client.id]}${msg}`); // Log the value.
            }
            else {  // If there aren't any matches log the message below.
                console.log("No match!");                
            }
        }        
        console.log(util.inspect(users.list, {showHidden: false, depth: null}));    // Log the array of connected users.
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
        console.log('a user is disconnected', latestUser);
        socket.broadcast.emit('terminated', latestUser);    // On disconnection send the disconnected user's name to the client side.
    });
});

http.listen(port, () => {   // Start the server and listen on port: 3000.
    console.log(`listening on port: ${port}`); 
});