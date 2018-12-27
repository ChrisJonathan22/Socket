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
  
    $('form').submit(() => {
        // Generate a random number between 1 & 152.
       let randomNumber = Math.floor(Math.random() * 152) + 1;
        // Log the random number.   
       console.log(randomNumber);
       
       /*
         When you submit the form emit an event called chat message
        which should match the event name setup in the backend
        and send the value of the input which will be received in
        the backend and then display it.
        Add the random number before the message.
        */ 
        socket.emit('chat message', `${names[randomNumber]}: ${$('#m').val()}`);
        // After sending the data empty the input field.
        $('#m').val('');
        // Exit.
        return false;
    });
    // If the chat message is triggered in the backend receive the value.
    socket.on('chat message', (msg) => {
        // Add the value to the page within an LI element.
        $('#messages').append($('<li>').text(msg));
    });
    // When connected receive the socket.client.id and append it.
    socket.on('connected', (user) => {
        $('#messages').append($('<li>').text(`Connected user: ${user}`));
    });
    // When disconnected receive the socket.client.id and append it.
    socket.on('terminated', (user) => {
        $('#messages').append($('<li>').text(`User disconnected: ${user}`));
    });
});