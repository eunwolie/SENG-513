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
        	input = msg.split(' ');
			if(input[2] === 'undefined'){
				msg = '<li>' +'<div class = un >' + input[3] + ':' + '</div>' + 
					'<div class=message>' + input[4] + '</div>' + 
					'<div class=time>' + input[0] + ' ' + input[1] + '</div>' + '</li>';
			} else {
				msg = '<li>' +'<div class = un ' + input[2]+ '>' + input[3] + ':' + '</div>' + 
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
	
	//this chunk is for displaying the un chosen to other users
	//we are selcting only the first child as this is the current un
    socket.on('un', function(uns){
    	$('#users').find('li').not(':first').remove();
    	uns = JSON.parse(uns);
    	for (let un of uns){
    		un = un.split(" ");
    		if(un[1] === undefined){
		    	un  = '<li>' + '<span>' + un[0] + '</span>' + '</li>';
    		} else {
		    	un  = '<li>' + '<span ' + un[1] +'>' + un[0] + '</span>' + '</li>';
		    }
	    	$('#users').append(un);
    	}
    });
    

	//this chunk is for you own un space
    socket.on('your un', function(un){
    	$('.name').find('span').remove();
    	un = un.split(" ");
		let name = 'chatun=' + un[1];
        name_length = un[1].length;
    	if(un[0] == 'undefined'){
	   		un = '<span>' + un[1] + '</span>';
		} else {
	   		un = '<span '+ un[0]+'>' + un[1] + '</span>';
		}
		$('.name').append(un);
   		document.cookie = name;
   		console.log("current un " + document.cookie);
    });
    
	//this is for previous messages
    socket.on('old messages', function(msgs){
		msgs = JSON.parse(msgs);
		for (let msg of msgs){
            input = msg.split(" ");
            if(input[2] === 'undefined'){
                msg = '<li>' +'<div class = un >' + input[3] + ':' + '</div>' + 
					'<div class=message>' + input[4] + '</div>' + 
					'<div class=time>' + input[0] + ' ' + input[1] + '</div>' + '</li>';
            } else {
                msg = '<li>' +'<div class = un ' + input[2]+ '>' + input[3] + ':' + '</div>' +
					'<div class=message>' + input[4] + '</div>' + 
					'<div class=time>' + input[0] + ' ' + input[1] + '</div>' + '</li>';
			}
        	$('#messages').append(msg);
        	 window.scrollTo(0, document.body.scrollHeight);
		}
	});
});