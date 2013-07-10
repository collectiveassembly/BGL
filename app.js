var express = require('express');
var async = require('async');
var fs = require('fs');
var WebSocketServer = require('ws').Server;
var app = express();

/*
* WEBSOCKET STUFF
*/

var wss = new WebSocketServer({port: 9000});

wss.on('connection', function(ws) {
    ws.on('message', function(message) {
        console.log('received: %s', message);
    });
    ws.send('something');
});

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
