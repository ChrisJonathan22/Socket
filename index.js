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

let users = {}; // This is where each connected user will be stored.

app.use(express.static('public'));  // Tell express to use the public folder for static files.


app.get('/', (req, res) => {    // Create a route which responds to Get requests.
    res.sendFile(__dirname + '/public/index.html'); // As a response send a file.
});

io.on('connection', (socket) => {   // When a connection has been established take in socket.

    console.log('a user is connected', users.uniqueSocket);   // On connection log a message with the socket id.

    let uniqueSocket = socket.client.id;    // Store the unique socket.client.id .
    let randomNumber = Math.floor(Math.random() * 152) + 1; // Generate a random number.
    
    users.uniqueSocket = names[randomNumber];   // Add the uniqueSocket to the object users as  property and use the random name as the value.
    console.log(users.uniqueSocket);
    
    socket.broadcast.emit('connected', users.uniqueSocket);     // On connection send the socket.client.id to the client side.

    socket.on('chat message', (msg) => {    // If the chat message event has been triggered receive msg.
        
        socket.broadcast.emit('chat message', `${users.uniqueSocket} ${msg}`);   // Trigger the chat message event and pass in the value received + a user.
        
        console.log(`message: ${msg}`); // Log the value.
        console.log(socket.client.id);
        console.log(util.inspect(users, {showHidden: false, depth: null}));
        
        
    });

    socket.on('typing', (who) => {  // When a user types pass in who
        socket.broadcast.emit('typing', who);     // Trigger the event and receive who which will be a string "a user is typing..." .
        console.log(who);
    });


    socket.on('notTyping', (who) => {   // When a user stops typing pass in who.
        socket.broadcast.emit('notTyping', who);      // Trigger the event and receive who which will be an empty string.
        console.log(who, 'user no longer typing...');
    });

    socket.on('disconnect', () => { // On disconnection, log a message with the socket.client.id .

        console.log('a user is disconnected', users.uniqueSocket);

        socket.broadcast.emit('terminated', users.uniqueSocket);    // On disconnection send the socket.client.id to the client side.
    });
});

http.listen(port, () => {
    console.log(`listening on port: ${port}`); 
});