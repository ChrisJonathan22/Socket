$(() => {
    let socket = io();
    socket.connect('http:localhost:3000');
    // This is an array of names which will be used as nicknames for every new message. The names will be picked by random.
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
  
    
    $('#m').click(()=> {    // When a user clicks inside the input field, show the element with an id of typing.  
        
        socket.emit('typing', "a user is typing...");   // Trigger the event and pass in the value.
    });

    
    $('#m').blur(() => {    // When the user clicks outside the input field, hide the element with an id of typing.

        socket.emit('notTyping', " ");   // Trigger the event.
    });

    socket.on('typing', (who) => {  // Create an event for when a user types.
        $('#typing').text(who);     // Receive the value sent and add or replace the content of #typing with the value received.
    });

    socket.on('notTyping', (who) => {   // Create an event for when a user stops typing.
        $('#typing').text(who);         // Receive the value sent and add or replace the content of #typing with the value received.
    });

    $('form').submit(() => {    // When a user submits his or her message, hide the element with an id of typing.
        $('#typing').hide();

       let randomNumber = Math.floor(Math.random() * 152) + 1;  // Generate a random number between 1 & 152.
    
       console.log(randomNumber);   // Log the random number.   
       
       /*
         When you submit the form trigger an event called chat message
        which should match the event name setup in the backend
        and send the value of the input which will be received in
        the backend and then display it.
        Add the random number before the message.
        */ 
        socket.emit('chat message', `${names[randomNumber]}: ${$('#m').val()}`);

        $('#m').val('');    // After sending the data empty the input field.
        
        return false;   // Exit.
    });

    socket.on('chat message', (msg) => {    // Create an event called chat message which receives a value = msg.
        
        $('#messages').append($('<li>').text(msg)); // Add the value to the page within an LI element.
    });

    
    socket.on('connected', (user) => {  // Create an event called connected which receives user.

        $('#messages').append($('<li>').text(`Connected user: ${user}`));   // Receive user = socket.client.id and append it.
    });
    
    socket.on('terminated', (user) => { // Create an event called terminated which receives user.

        $('#messages').append($('<li>').text(`User disconnected: ${user}`));    // Receive user = socket.client.id and append it
    });
});