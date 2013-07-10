$(window).load(function(){
	enterFrame();
	loop();
})

function enterFrame(){
	stripesDown();
	contentSlideIn();
	$(".contentStrip").css({
		x : "2100px",
		opacity: 1
	})
	setTimeout(exitFrame, 6000);
}

function exitFrame(){
	flashBackground()
	setTimeout(function(){
		fadeOutFullSize()
		stripesOut();
		//contentSlideOut();
		$(".contentStrip").css({
			opacity : 0
		})
	}, transitionTime * 3);
}

/*=============================================================================
	TRANSITION IN
=============================================================================*/

var transitionTime = 800;

function stripesDown(){
	var transitionType = TWEEN.Easing.Quadratic.Out;
	var delayTime = transitionTime / 2;
	//make a tween for each of the objects
	var five = $("#fiveStripe");
	var fiveTween = new TWEEN.Tween({ y : -750})
		.to({y : 0}, transitionTime)
		.easing(transitionType)
		.onUpdate(function(){
			five.css({
				y : this.y + "px"
			});
		})
		.delay(0)
		.start();
	var six = $("#sixStripe");
	var sixTween = new TWEEN.Tween({ y : -750})
		.to({y : 0}, transitionTime)
		.easing(transitionType)
		.onUpdate(function(){
			six.css({
				y : this.y + "px"
			});
		})
		.delay(delayTime)
		.start();
	var seven = $("#sevenStripe");
	var sixTween = new TWEEN.Tween({ y : -750})
		.to({y : 0}, transitionTime)
		.easing(transitionType)
		.onUpdate(function(){
			seven.css({
				y : this.y + "px"
			});
		})
		.delay(delayTime * 2)
		.start();
}

function fadeInFullSize(){
	var transitionType = TWEEN.Easing.Quadratic.In;
	var delayTime = transitionTime / 2;
	//make a tween for each of the objects
	var five = $("#fiveFULL");
	var fiveTween = new TWEEN.Tween({ opacity : 0})
		.to({opacity : 1}, transitionTime)
		.easing(transitionType)
		.onUpdate(function(){
			five.css({
				opacity : this.opacity
			});
		})
		.delay(0)
		.start();
	var six = $("#sixFULL");
	var sixTween = new TWEEN.Tween({ opacity : 0})
		.to({opacity : 1}, transitionTime)
		.easing(transitionType)
		.onUpdate(function(){
			six.css({
				opacity : this.opacity
			});
		})
		.delay(delayTime)
		.start();
	var seven = $("#sevenFULL");
	var sixTween = new TWEEN.Tween({ opacity : 0})
		.to({opacity : 1}, transitionTime)
		.easing(transitionType)
		.onUpdate(function(){
			seven.css({
				opacity : this.opacity
			});
		})
		.delay(delayTime * 2)
		.start();
}

function contentSlideIn(){
	var transitionType = TWEEN.Easing.Quadratic.Out;
	var delayTime = transitionTime / 2;
	//make a tween for each of the objects
	var five = $("#fiveContent");
	var fiveTween = new TWEEN.Tween({ x : 2100})
		.to({x : 0}, transitionTime)
		.easing(transitionType)
		.onUpdate(function(){
			five.css({
				x : this.x + "px"
			});
		})
		.delay(0)
		.onComplete(fadeInFullSize)
		.start();
	var six = $("#sixContent");
	var sixTween = new TWEEN.Tween({ x : 2100})
		.to({x : 0}, transitionTime)
		.easing(transitionType)
		.onUpdate(function(){
			six.css({
				x : this.x + "px"
			});
		})
		.delay(delayTime)
		.start();
	var seven = $("#sevenContent");
	var sixTween = new TWEEN.Tween({ x : 2100})
		.to({x : 0}, transitionTime)
		.easing(transitionType)
		.onUpdate(function(){
			seven.css({
				x : this.x + "px"
			});
		})
		.delay(delayTime * 2)
		.start();

}

/*=============================================================================
	TRANSITION OUT
=============================================================================*/

function flashBackground(callback){
	var transitionType = TWEEN.Easing.Quadratic.In;
	var flashTime = transitionTime / 1.5;
	var delayTime = flashTime / 2;
	flash($("#fiveFULL"), flashTime, delayTime * 0);
	flash($("#sixFULL"), flashTime, delayTime);
	flash($("#sevenFULL"), flashTime, delayTime * 2, callback);
}

function fadeOutFullSize(){
	var transitionType = TWEEN.Easing.Quadratic.In;
	var delayTime = transitionTime / 2;
	//make a tween for each of the objects
	var five = $("#fiveFULL");
	var fiveTween = new TWEEN.Tween({ opacity : 1})
		.to({opacity : 0}, transitionTime)
		.easing(transitionType)
		.onUpdate(function(){
			five.css({
				opacity : this.opacity
			});
		})
		.delay(delayTime * 0)
		.start();
	var six = $("#sixFULL");
	var sixTween = new TWEEN.Tween({ opacity : 1})
		.to({opacity : 0}, transitionTime)
		.easing(transitionType)
		.onUpdate(function(){
			six.css({
				opacity : this.opacity
			});
		})
		.delay(delayTime)
		.start();
	var seven = $("#sevenFULL");
	var sixTween = new TWEEN.Tween({ opacity : 1})
		.to({opacity : 0}, transitionTime)
		.easing(transitionType)
		.onUpdate(function(){
			seven.css({
				opacity : this.opacity
			});
		})
		.delay(delayTime * 2)
		.start();
}

function flash(element, flashDuration, delay, callback){
	var transitionType = TWEEN.Easing.Quadratic.In;
	var dim = .7;
	var fadeIn = new TWEEN.Tween({ opacity : dim})
		.to({opacity : 1}, flashDuration)
		.easing(transitionType)
		.onUpdate(function(){
			element.css({
				opacity : this.opacity
			});
		})
		.onComplete(function(){
			if (callback){
				callback();
			}
		})
	var fadeOut = new TWEEN.Tween({ opacity : 1})
		.to({opacity : dim}, flashDuration)
		.easing(transitionType)
		.onUpdate(function(){
			element.css({
				opacity : this.opacity
			});
		})
		.delay(delay)
		.chain(fadeIn)
		.start();
}

function stripesOut(){
	var transitionType = TWEEN.Easing.Quadratic.In;
	var delayTime = transitionTime / 2;
	//make a tween for each of the objects
	var five = $("#fiveStripe");
	var fiveTween = new TWEEN.Tween({ y : 0})
		.to({y : 750}, transitionTime)
		.easing(transitionType)
		.onUpdate(function(){
			five.css({
				y : this.y + "px"
			});
		})
		.delay(delayTime * 0 + transitionTime)
		.start();
	var six = $("#sixStripe");
	var sixTween = new TWEEN.Tween({ y : 0})
		.to({y : 750}, transitionTime)
		.easing(transitionType)
		.onUpdate(function(){
			six.css({
				y : this.y + "px"
			});
		})
		.delay(delayTime * 1 + transitionTime)
		.start();
	var seven = $("#sevenStripe");
	var sixTween = new TWEEN.Tween({ y : 0})
		.to({y : 750}, transitionTime)
		.easing(transitionType)
		.onUpdate(function(){
			seven.css({
				y : this.y + "px"
			});
		})
		.onComplete(enterFrame)
		.delay(delayTime * 2 + transitionTime)
		.start();
}

function contentSlideOut(){
	var transitionType = TWEEN.Easing.Linear.None;
	var delayTime = transitionTime / 2;
	//make a tween for each of the objects
	var five = $("#fiveContent");
	var fiveTween = new TWEEN.Tween({ y : 0})
		.to({y : -750}, transitionTime)
		.easing(transitionType)
		.onUpdate(function(){
			five.css({
				y : this.y + "px"
			});
		})
		.delay(transitionTime)
		.start();
	var six = $("#sixContent");
	var sixTween = new TWEEN.Tween({ y : 0})
		.to({y : -750}, transitionTime)
		.easing(transitionType)
		.onUpdate(function(){
			six.css({
				y : this.y + "px"
			});
		})
		.delay(delayTime + transitionTime)
		.start();
	var seven = $("#sevenContent");
	var sixTween = new TWEEN.Tween({ y : 0})
		.to({y : -750}, transitionTime)
		.easing(transitionType)
		.onUpdate(function(){
			seven.css({
				y : this.y + "px"
			});
		})
		.delay(delayTime * 2 + transitionTime)
		.onComplete(enterFrame)
		.start();
}


/*=============================================================================
	LOOP
=============================================================================*/

function loop(){
	requestAnimationFrame(loop);
	TWEEN.update();
}