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
        u = msg.split(' ');
		//input[2] is the color element, if it's not present, we are making sure it's not included
		if(u[2] === 'undefined'){
			msg = '<li>' +'<div class = un >' + u[3] + ':' + '</div>' + '<div class=message>' + u[4] + '</div>' + '<div class=time>' + u[0] + ' ' + u[1] + '</div>' + '</li>';
		} 
		else{
			msg = '<li>' +'<div class = un ' + u[2]+ '>' + u[3] + ':' + '</div>' + '<div class=message>' + u[4] + '</div>' + '<div class=time>' + u[0] + ' ' + u[1] + '</div>' + '</li>';
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
	//we are selcting only the first child as this is the current 
    socket.on('user name',function(uns){
    	$('#users').find('li').not(':first').remove();
    	uns = JSON.parse(uns);
    	for (let un of uns){
    		un = un.split(" ");
    		if(un[1] === undefined){
		    	un  = '<li>' + '<span>' + un[0] + '</span>' + '</li>';
    		}
		    else{
		    	un  = '<li>' + '<span ' + un[1] +'>' + un[0] + '</span>' + '</li>';
		    }
	    	$('#users').append(un);
    	}
    });
    
   //this chunk is for you own un space
    socket.on('your un',function(un){
    	$('.name').find('span').remove();
    	un = un.split(" ");
		let name = 'chatun=' + un[1];
        unamelen = un[1].length;
    	if(un[0] == 'undefined')
	   		un = '<span>' + un[1] + '</span>';
	   	else
	   		un = '<span '+ un[0]+'>' + un[1] + '</span>';
   		$('.name').append(un);
   		document.cookie = name;
   		console.log("saved the username: " + document.cookie);
    });
    
	//this is for previous messages
    socket.on('last messages', function(msgs){
		msgs = JSON.parse(msgs);
		for (let msg of msgs){
            u = msg.split(' ');
            if(u[2] === 'undefined'){
                msg = '<li>' +'<div class = un >' + u[3] + ':' + '</div>' + '<div class=message>' + u[4] + '</div>' + '<div class=time>' + u[0] + ' ' + u[1] + '</div>' + '</li>';
            } 
            else{
                msg = '<li>' +'<div class = un ' + u[2]+ '>' + u[3] + ':' + '</div>' + '<div class=message>' + u[4] + '</div>' + '<div class=time>' + u[0] + ' ' + u[1] + '</div>' + '</li>';
            }
        	$('#messages').append(msg);
        	 window.scrollTo(0, document.body.scrollHeight);
		}
	});
});