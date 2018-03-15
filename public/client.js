//this above chunk is copied over from the initial index.html provided with the chat example
//this is because we would like to keep the scripts together. 
$(function () {
        var socket = io();
        $('form').submit(function(){
          socket.emit('chat message', $('#m').val());
          $('#m').val('');
          return false;
        });

	//mirorring the other js file
	socket.on('chat message', function(msg){
			//input[2] is the color element, if it's not present, we are making sure it's not included
        	input = msg.split(" ");
			if(input[2] === 'undefined'){
				msg = '<li>' +'<div class = nickname >' + input[3] + '</div>' + 
					'<div class=message>' + input[4] + '</div>' + 
					'<div class=time>' + input[0] + ' ' + input[1] + '</div>' + '</li>';
			} else {
				msg = '<li>' +'<div class = nickname ' + input[2]+ '>' + input[3] + '</div>' + 
					'<div class=message>' + input[4] + '</div>' + 
					'<div class=time>' + input[0] + ' ' + input[1] + '</div>' + '</li>';
			}

        	$('#messages').append(msg);
			//this is to make it responsive 
        	window.scrollTo(0, document.body.scrollHeight);
	});

	//the chunks implemented below are to watch elements from the server script in order to display it 
	//properly on the front end 

	//these chunks are similar to that of the above such that if does not specify a colour
	//we may remove the colour element 
	
	//this chunk is for displaying the nickname chosen to other users
	//we are selcting only the first child as this is the current nickname
    socket.on('nickname', function(pairs){
    	$('#users').find('li').not(':first').remove();
    	pairs = JSON.parse(pairs);
    	for (let nickname of pairs){
    		nickname = nickname.split(" ");
    		if(nickname[1] === undefined){
		    	nickname  = '<li>' + '<span>' + nickname[0] + '</span>' + '</li>';
    		} else {
		    	nickname  = '<li>' + '<span ' + nickname[1] +'>' + nickname[0] + '</span>' + '</li>';
		    }
	    	$('#users').append(nickname);
    	}
    });
    

	//this chunk is for you own nickname space
    socket.on('your nickname', function(nickname){
    	$('.name').find('span').remove();
    	nickname = nickname.split(" ");
		let name = 'cookieName=' + nickname[1];
        name_length = nickname[1].length;
    	if(nickname[0] == 'undefined'){
	   		nickname = '<span>' + nickname[1] + '</span>';
		} else {
	   		nickname = '<span '+ nickname[0]+'>' + nickname[1] + '</span>';
		}
		$('.name').append(nickname);
   		document.cookie = name;
   		console.log("current nickname " + document.cookie);
    });
    
	//this is for previous messages
    socket.on('old messages', function(message_list){
		message_list = JSON.parse(message_list);
		for (let msg of message_list){
            input = msg.split(" ");
            if(input[2] === 'undefined'){
                msg = '<li>' +'<div class = nickname >' + input[3] + '</div>' + 
					'<div class=message>' + input[4] + '</div>' + 
					'<div class=time>' + input[0] + ' ' + input[1] + '</div>' + '</li>';
            } else {
                msg = '<li>' +'<div class = nickname ' + input[2]+ '>' + input[3] + '</div>' +
					'<div class=message>' + input[4] + '</div>' + 
					'<div class=time>' + input[0] + ' ' + input[1] + '</div>' + '</li>';
			}
        	$('#messages').append(msg);
        	 window.scrollTo(0, document.body.scrollHeight);
		}
	});
});