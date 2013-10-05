var express = require('express');
var async = require('async');
var fs = require('fs');
var WebSocketServer = require('ws').Server;
var terms = require("./public/assets/scripts/app/shuffledTerms").terms;
var app = express();

/*
* WEBSOCKET STUFF
*/

var wss = new WebSocketServer({port: 9000});
var connections = [];

wss.on('connection', function(ws) {
    ws.on('close', function() {
    	console.log('stopping client');
    	var newConnections = [];
    	for (var i = 0; i < connections.length; i++){
			var test = connections[i];
			if (test !== ws){
				newConnections.push(test);
			}
		}
		connections = newConnections;
  	})
    connections.push(ws);
});

//the counter for how many term events have been fired
var termCounter = 0;


// sourced from http://snippets.dzone.com/posts/show/849
function shuffleArray(arr) {
	var o = arr.slice(0);
	for(var j, x, i = o.length; i; j = parseInt(Math.random() * i), x = o[--i], o[i] = o[j], o[j] = x);
	return o;
};

//shuffle the terms
// terms = shuffleArray(terms);

//send events
function sendWSEvent(){
	setTimeout(sendWSEvent,  126000);
	//take the next three terms
	var args = [];
	for (var i = 0; i < 3; i++){
		args.push(terms[termCounter]);
		termCounter++;
		termCounter = termCounter % terms.length;
	}
	for (var i = 0; i < connections.length; i++){
		var ws = connections[i];
		//show the lab logo every 3 iterations
		if (termCounter % 33 === 0){
			var msg = { name : "labLogo", args : []};
		} else {
			var msg = { name : "nextTerm", args : args};
		}
		//send it
		ws.send(JSON.stringify(msg));
	}
}


//start the loop
sendWSEvent();

/*
* SERVER STUFF
*/

var log = fs.createWriteStream('./log/BGL.log', {
	'flags' : 'a'
});

//all client requests goes through here
//app.use('/get', client.get);

//static file server
app.use(express.static(__dirname + '/public'));

//start the server
app.listen(3000, "127.0.0.1");

//print a message
log.write('BGL Started'+new Date()+'\n');
