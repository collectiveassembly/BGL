var express = require('express');
var async = require('async');
var fs = require('fs');
var WebSocketServer = require('ws').Server;
var app = express();
var shuffledTerms = require("./public/assets/scripts/app/shuffledTerms").terms;
var terms = require("./public/assets/scripts/app/terms").terms;

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
var cycleCount = 0;

//shuffle the terms

//send events
function sendWSEvent(){
	//take the next three terms
	var args = new Array();
	if (cycleCount !== 0){
		for (var i = 0; i < 3; i++){
			var index = parseInt(shuffledTerms[termCounter]) - 1;
			// var index = 36;
			args.push(terms[index]);
			termCounter++;
			termCounter = termCounter % shuffledTerms.length;
		}	
		var msg = { name : "nextTerm", args : args};
	} else {
		var msg = { name : "labLogo", args : []};
	}
	for (var i = 0; i < connections.length; i++){
		var ws = connections[i];
		//send it
		ws.send(JSON.stringify(msg));
	}
	//show the lab logo every 3 iterations
	if (cycleCount === 0){
		setTimeout(sendWSEvent,  12000);
	} else {
		setTimeout(sendWSEvent,  126000); //126000
	}
	cycleCount++;
	cycleCount = cycleCount % 11;
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
app.listen(3000, "10.71.5.51");
// app.listen(3000, "127.0.0.1");

//print a message
log.write('BGL Started'+new Date()+'\n');
