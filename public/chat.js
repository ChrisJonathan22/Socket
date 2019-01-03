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

    /* 
        If an online user has been clicked on, send a private message to that user and if no user has been clicked on the send a message to everyone.
        match the name with the unique socket.client.id and then emit the message to that user.
    */
   let children = $('#users').children();  //  Store all child elements (objects) of the element with an id of #users.
   let listElements = $('li');

//    children.each(function (idx, val){  // Loop through each element.
//     //    console.log($(this)['0'].innerText);    // Log each element's innerText.
//         $(this)[0].addEventListener('click', () => {
//             console.log("item clicked");
            
//         }, false);


//     //    let singleUser = $(this)['0'].innerText;    // Store the each element's innerText.

//    });

    // for(let i = 0; i < listElements.length; i++){
    //     listElements[i].addEventListener('click', () => {
    //         console.log('Clicked user!');
    //     }, false);
    // }

    socket.on('connected', (user) => {  // Create an event called connected which receives list which is an array of connected users.

        $('#users').append($('<li>').text(user)); // Append each name to the element with an id of users.
        
        $('#messages').append($('<li>').text(`Connected user: ${user}`));   // Append each name to the element with an id of messages.
    });
    
    socket.on('terminated', (user) => { // Create an event called terminated which receives user.

        let children = $('#users').children();  //  Store all child elements (objects) of the element with an id of #users.

        children.each(function (idx, val){  // Loop through each element.
            console.log($(this)['0'].innerText);    // Log each element's innerText.

            let singleUser = $(this)['0'].innerText;    // Store the each element's innerText.

            if(singleUser == user) {    //  Compare each element's innerText value to the value of the user received.

                    $(this).css("background-color","red");   // If there's a match turn the background colour from green to red.
                }
        });
        $('#messages').append($('<li>').text(`User disconnected: ${user}`));    // Receive user = socket.client.id and append it to messages.
    });
});
