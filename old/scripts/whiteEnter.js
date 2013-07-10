$(window).load(function(){
	loop();
	pages[0] = new Page(0);
	pages[1] = new Page(1);
	pages[2] = new Page(2);
	setTimeout(enter, 2000);
})

var pages = [];

/*=============================================================================
	LOOP
=============================================================================*/

function loop(){
	requestAnimationFrame(loop);
	TWEEN.update();
}

function fadeTo(element, opacity, duration, delay, callback){
	var transitionType = TWEEN.Easing.Quadratic.In;
	var d = delay || 0;
	var c = callback || function(){};
	var currentOpacity  = element.css("opacity") || 1;
	var tween = new TWEEN.Tween({ opacity : currentOpacity})
		.to({opacity : opacity}, duration)
		.easing(transitionType)
		.onUpdate(function(){
			element.css({
				opacity : this.opacity
			});
		})
		.delay(d)
		.onComplete(c)
		.start();
}

var transitionTime = 700;
var delayTime = transitionTime/2;

function Page(position){

	var self = this;


	function init(){
		self.name = $("<div class='page"+position+" name'><img src='./images/white/name"+position+".jpg'/></div>").appendTo($("#container"));
		self.location = $("<div class='page"+position+" location'><img src='./images/white/location"+position+".jpg'/></div>").appendTo($("#container"));
		self.definition = $("<div class='page"+position+" definition'><img src='./images/white/definition"+position+".jpg'/></div>").appendTo($("#container"));
		self.related = $("<div class='page"+position+" related'><img src='./images/white/related"+position+".jpg'/></div>").appendTo($("#container"));
		self.image = $("<div class='page"+position+" image'><img src='./images/white/image"+position+".jpg'/></div>").appendTo($("#container"));
		self.idea = $("<div class='page"+position+" idea'><img src='./images/white/idea"+position+".jpg'/></div>").appendTo($("#container"));
		self.location.css({
			width: "400px",
			height: "0px"
		});
	}

	this.numberIn = function(){
		fadeTo(self.name, 1, transitionTime/2, delayTime * position);
	}

	this.numberOut = function(){
		fadeTo(self.name, 0, transitionTime/2, delayTime * position);
	}

	this.infoIn = function(){
		var diff = transitionTime / 5;
		var pos = 2 - position
		fadeTo(self.idea, 1, transitionTime, delayTime * pos + diff*0);
		fadeTo(self.image, 1, transitionTime, delayTime * pos + diff*1);
		fadeTo(self.related, 1, transitionTime, delayTime * pos + diff*2);
		fadeTo(self.definition, 1, transitionTime, delayTime * pos + diff*3);
	}

	this.infoOut = function(){
		var diff = transitionTime / 5;
		var pos = 2 - position
		fadeTo(self.idea, 0, transitionTime, delayTime * pos + diff*0);
		fadeTo(self.image, 0, transitionTime, delayTime * pos + diff*1);
		fadeTo(self.related, 0, transitionTime, delayTime * pos + diff*2);
		fadeTo(self.definition, 0, transitionTime, delayTime * pos + diff*3);
	}



	this.locationIn = function(){
		var transitionType = TWEEN.Easing.Quadratic.In;
		var element0 = this.location;
		var tween = new TWEEN.Tween({ 
				width : 400,
				height : 0,
			})
			.to({ 
				width : 700,
				height : 430,
			}, transitionTime)
			.easing(transitionType)
			.onUpdate(function(){
				element0.css({ 
					width : this.width,
					height : this.height,
				});
			})
			.delay(0)
			.start();
	}

	this.locationOut = function(){
		var transitionType = TWEEN.Easing.Quadratic.In;
		var element0 = this.location;
		var tween = new TWEEN.Tween({ 
				width : 700,
				height : 430,
			})
			.to({ 
				width : 400,
				height : 0,
			}, transitionTime)
			.easing(transitionType)
			.onUpdate(function(){
				element0.css({ 
					width : this.width,
					height : this.height,
				});
			})
			.delay(0)
			.start();
	}

	init();
}

/*=============================================================================
	ENTER
=============================================================================*/

function enter(){
	numberIn();
	setTimeout(infoIn, transitionTime );
	setTimeout(locationIn, transitionTime * 3);
	setTimeout(exit, 7000);
}

function numberIn(){
	for (var i = 0; i < pages.length; i++){
		pages[i].numberIn();
	}
}

function infoIn(){
	for (var i = 0; i < pages.length; i++){
		pages[i].infoIn();
	}
}

function locationIn(){
	for (var i = 0; i < pages.length; i++){
		pages[i].locationIn();
	}
}

/*=============================================================================
	EXIT
=============================================================================*/


function exit(){
	infoOut();
	setTimeout(locationOut, transitionTime);
	setTimeout(numberOut, transitionTime*3);
	setTimeout(enter, transitionTime*5);
}

function infoOut(){
	for (var i = 0; i < pages.length; i++){
		pages[i].infoOut();
	}
}

function locationOut(){
	for (var i = 0; i < pages.length; i++){
		pages[i].locationOut();
	}
}

function numberOut(){
	for (var i = 0; i < pages.length; i++){
		pages[i].numberOut();
	}
}


