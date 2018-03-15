//setting up packages as the exmaple states
//parts of code have not been modified from the original chat example tutorial provided. 
//this below chunk contains code provided by the chat example
var express = require('express');
var app = express();
var http = require('http').createServer(app);
var io = require('socket.io')(http);
var port = process.env.PORT || 3000;

//the moment package will be used to parse the timestamp 
var moment = require('moment');

var cookieParser = require('cookie-parser');
app.use(cookieParser());


//this chunk contains the variables used
var previous_nickname = undefined;
var nicknames = {};
var colors = {};
var messages = [];

//following middleware code at 
//https://stackoverflow.com/questions/16209145/how-to-set-cookie-in-node-js-using-express-framework

app.use(function(req, res, next){
	var cookie = req.cookies.cookieName;
	//if there is no existing cookie, set new cookie 
	//in this case, check if cookie contains info about previous nicknames
	if (cookie !== undefined){
		if(existingName(cookie) === -1){
			previous_nickname = undefined; 
		} 
		else {
			previous_nickname = cookie;
		}
	}
	next();
});

//setting the directory to the folder 'public' and finding the main html
//we will be using public to denote front end 
app.use(express.static(__dirname + '/public'));

app.get('/', function(req, res){
    res.sendFile('index.html');
});

//below will be functions used or chunks of code that will not be displayed on the front end.
//the function below are create to work with the nickname. 
//These are to check if there is an existing nickname matching what has been typed, 
// getting the nickname and setting a nickname 
function existingName(nickname){
	//goes through each element of the list and comparing 
	Object.keys(nicknames).forEach(function(key){
		if(nicknames[key] === nickname){
			return -1;
		} 
		else {
			return 0;
		}
	});
}

function getName(){
	if(previous_nickname !== undefined){
		nickname = previous_nickname;		
	} 
	else {
		nickname = 'Anonymous' + (Math.ceil(Math.random() * 250));
	}
	return nickname;
}

//this function specifically will push both nickname and colors together as pairs
function getColors(){
	pairs = [];
	Objects.keys(nicknames).forEach(function(key){
		pairs.push(nicknames[key] + " " + colors[key]);
	});
	return pairs; 
}
									
//this function is for adding messages to the array so long that there is space for it
function getMessage(msg){
	if(messages.length != 150){
		messages.push(msg);
	}
}

function sanitize(str){
	var reject_chars = { '`': '&#x60;','=': '&#x3D;','>': '&gt;', '"': '&quot;', 
						'&': '&amp;', '<': '&lt;', "'": '&#39;','/': '&#x2F;'};
	word = String(str).replace(/[`<>/='"&]/g,function(r){
		return reject_chars[r];
	});
	word = String(str).replace(/[\\]/g,'&#92');
	return word;
}

//the below code uses the socket.io commands to display things such as the username
//color. message and things to display on connection and disconnection
//this section was modified to be more detailed following this source
//http://nodesource.com/blog/understanding-socketio/
//on connection to the web chat screen, this is what we would like to happen
io.on('connection', function(socket){
	console.log('user has connected');
	//once a user has connected, assign them a nickname and display the nickname for them to see 
	nicknames[socket.id] = getName();
	//sending to the socket your username and color
	socket.emit('your nickname', colors[socket.id] + ' ' + nicknames[socket.id]);
	//sending to other sockets that you are now online 
	io.emit('nickname', JSON.stringify(getColors()));
	//sending the list of your previous messages to your socket
	socket.emit('old messages', JSON.stringify(messages));
	
	//here, we want to specifically target the socket upon disconnect
	//things here follow the order above with opposite commands
	//such that things are deleted instead of pulled and other users are then updated
	socket.on('disconnect', function(){
		console.log('user has disconnected');
		delete nicknames[socket.id];
		delete colors[socket.id];
		io.emit('nickname', JSON.stringify(getColors()));
	});

	socket.on('chat message', function(msg){
		if (msg.indexOf('/nickcolor')===0){
			input = (msg.split(" "))[1];
			if(input !== undefined && input.length === 6){
				sanitize(input);
				//this is to change the colour
				input = 'style=color:#' + input + ';';
				colors[socket.id] = input;
				io.emit('nickname', JSON.stringify(getColors()));
				socket.emit('your nickname', colors[socket.id] + ' ' + nicknames[socket.id]);
			}
		} 
		else if (msg.indexOf('/nick') === 0) {
			input = (msg.split(" "))[1];
			if(input !== "" && input !== undefined && existingName(input) === 0){
				sanitize(input);
				nicknames[socket.id] = input;
				io.emit('nickname', JSON.stringify(getColors()));
				socket.emit('your nickname', colors[socket.id] + ' ' + nicknames[socket.id]);
			}
		} 
		else if (msg !== "" && msg !== undefined) {
      		var timestamp = moment();
      		msg = sanitize(msg);
      		msg = time.format('h:mm:ss a').concat(' ' + colors[socket.id] + ' ' + nicknames[socket.id] + ' '+ msg);
      		getMessage(msg);
      		console.log('message: ' + msg);
      		io.emit('chat message', msg);
    	}
  	});

});
		
//no need to change from given example 
http.listen(port, function(){
  console.log('listening on *:' + port);
});
