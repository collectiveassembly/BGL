$(function(){
	BGL.initialize();
});

var BGL = (function(){

	//initialization
	function init(){
		setupWS();
	}

	/*=========================================================================
	WEBSOCKET STUFFS
	=========================================================================*/

	var websocket;

	function setupWS(){
		//get the ip from the address bar
		var ip = "ws://"+window.location.host.split(":")[0]+":9000/";
		websocket = new WebSocket(ip);
		//the message callback
		websocket.onopen = function(){
			console.log("connected");
		}
		//onmesssage callback
		websocket.onmessage = wsMessage;
	}

	//trigger an event when a message is recieved
	function wsMessage(msg){
		var eventObj = JSON.parse(msg.data);
		var event = $.Event(eventObj.name)
		$(window).trigger(event, [eventObj.args]);
	}

	/*=========================================================================
	RETURN OBJ
	=========================================================================*/
	return {
		initialize : init
	}
}());