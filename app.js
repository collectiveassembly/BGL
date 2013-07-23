var express = require('express');
var async = require('async');
var fs = require('fs');
var WebSocketServer = require('ws').Server;
var terms = require("./public/scripts/app/terms-interim");
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

//send events
function sendWSEvent(){
	setTimeout(sendWSEvent, 10000);
	//shuffle a copy of the array
	var shuffled = terms.terms.slice().sort( function() { return 0.5 - Math.random() } );
	var args = shuffled.slice(0, 3);
	for (var i = 0; i < connections.length; i++){
		var ws = connections[i];
		//take the first 3 terms
		if (termCounter===0){
			var msg = { name : "labLogo", args : []};
		} else {
			var msg = { name : "nextTerm", args : args};
		}
		//send it
		ws.send(JSON.stringify(msg));
	}
	//increment and make sure the count doesn't go over 10
	termCounter++;
	termCounter = termCounter % 10;
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
