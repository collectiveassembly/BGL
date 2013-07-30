function intInRange(from,to){
    return Math.floor(Math.random()*(to-from+1)+from);
}
function intInRangeFloat(from,to){
    return Math.random()*(to-from+1)+from;
}

var templates = {
	head: Hogan.compile('<h1>{{ number }}</h1><h2>{{ name }}</h2>'),
	body: Hogan.compile("\
		<div class='term-description'>{{ content.term }}</div>\
		<div class='media'>\
			<div class='progress-bar'></div>\
			{{#content.media.photo}}\
				<img src='{{content.media.photo}}'/>\
				<p class='caption'>Lorem ipsum sit dolor amet.</p>\
			{{/content.media.photo}}\
			{{#content.media.video}}\
				<video autoplay><source src='{{content.media.video}}' type='video/mp4'></video>\
				<p class='caption'>Lorem ipsum sit dolor amet.</p>\
			{{/content.media.video}}\
		</div>\
		<div class='project-desc'>{{ content.project_desc }}</div>\
		<div class='project-meta'>{{ content.project_meta }}</div>")
}

$(function(){
	
	/*
	// generate output string for SVG generator
	var str = '';
	BGLTerms.forEach(function(term, i){
		str += term.number + ' ' + term.name + ' ';
	});
	console.log(str);
	*/	

	/*
	// generate skeletal HTML src from tspan-SVG
	var tspan_to_div = '';
	var $tspan = $('tspan');		
	$tspan.each(function(){
		var $this = $(this);
		tspan_to_div += '<div style="top:'+$this.attr('y')+'px;left:'+$this.attr('x')+'px;'+$this.attr('style')+'">'+$this.text()+'</div>';
	});
	console.log(tspan_to_div);
	*/


	
	/***********************************************
	 *
	 *	Set initial scroll position (#0, #1, #2)
	 *
	 ***********************************************/

	var hash = parseInt(window.location.hash.substring(1));
	if (hash === 0) $('body').scrollLeft(0);
	if (hash === 1) $('body').scrollLeft(960);
	if (hash === 2) $('body').scrollLeft(1920);

	/***********************************************
	 *
	 *	Caches
	 *
	 ***********************************************/

	var canvases = document.querySelectorAll('canvas');
	var $sections = $('section');
	
	var $interstitial = $('#interstitial');
	var $interstitial_terms_L = $interstitial.find('.letter.L > div');
	var $interstitial_terms_A = $interstitial.find('.letter.A > div');
	var $interstitial_terms_B = $interstitial.find('.letter.B > div');
	
	var w = $(window).width();
	var h = $(window).height();

	
	/***********************************************
	 *
	 *	Events
	 *
	 ***********************************************/

	$(window).on("nextTerm", function(event, terms){

		// scatter interstitials if on-screen
		if ($sections.eq(0).attr('data-theme') === 'LAB') {
			scatter_interstitial($interstitial_terms_L, 'left');
			scatter_interstitial($interstitial_terms_A, 'center');
			scatter_interstitial($interstitial_terms_B, 'right');
		}

		// render each term's contents to screen
		terms.forEach(function(term, i){
			render_term(term, i);
		});

	});

	$(window).on("labLogo", function(){
		
		$sections.attr('data-theme', 'LAB');
		$('section header, section article').empty();

		show_interstitial($interstitial_terms_L);
		show_interstitial($interstitial_terms_A);
		show_interstitial($interstitial_terms_B);

		// clear canvases
		for (var i = 0; i < canvases.length; ++i) {
			var context = canvases[i].getContext('2d');
			context.clearRect(0, 0, context.canvas.width, context.canvas.height);
		}

	});













	/***********************************************
	 *
	 *	Render term
	 *
	 ***********************************************/

	var render_term = function(term, target){
		
		var $target_section = $('section').eq(target);
		var output = {
			head: templates.head.render(term),
			body: templates.body.render(term)
		};
		
		setTimeout(function(){

			$target_section.attr('data-theme', term.theme);
			$target_section.addClass('transitioning');

			setTimeout(function(){

				// replace term html
				$target_section.find('header').html(output.head);
				$target_section.find('article').html(output.body);
				
				// createnode-graph
				var graph = new Springy.Graph();
				graph.loadJSON(term.related);
				var springy_instance = $target_section.find('canvas').springy({graph: graph});

				// clean up
				$target_section.removeClass('transitioning');
				$target_section.find('.progress-bar').addClass('active');
				
			}, (target*500)+2000);		

		}, (target*1000)+1000);
		
	};

	/***********************************************
	 *
	 *	Start interstitial
	 *
	 ***********************************************/

	var show_interstitial = function(terms){
		
		console.log('show interstitial');
		
		terms.each(function(i){
			var $this = $(this);
			setTimeout(function(){
				$this.css({'opacity': 1,'-webkit-transform': 'scale(1) translate3d(0px,0px,0px)'});
			}, i * 30);
		});
		
	};

	/***********************************************
	 *
	 *	End interstitial
	 *
	 ***********************************************/

	var scatter_interstitial = function(terms, animDirection){
		
		if (typeof animDirection === "undefined") var animDirection = 'center';		
		console.log('scatter interstitial in direction', animDirection);
		
		terms.each(function(i){

			var $this = $(this);
			var multiplier = 10;

			if (animDirection === 'left') {
				setTimeout(function(){
					$this.css({'opacity':0,'-webkit-transform':'scale('+intInRangeFloat(0.5,3.2)+') translate3d('+intInRange(-900,-1200)+'px,'+intInRange(-1200,1200)+'px,0px)'});
				}, i * multiplier);
			} 
			else if (animDirection === 'center') {
				setTimeout(function(){
					$this.css({'opacity':0,'-webkit-transform':'scale('+intInRangeFloat(0.5,3.2)+') translate3d('+intInRange(-900,900)+'px,'+intInRange(-1200,1200)+'px,0px)'});
				}, i * multiplier);
			}
			else if (animDirection === 'right') {
				setTimeout(function(){
					$this.css({'opacity':0,'-webkit-transform':'scale('+intInRangeFloat(0.5,3.2)+') translate3d('+intInRange(900,1200)+'px,'+intInRange(-1200,1200)+'px,0px)'});
				}, i * multiplier);
			} else {
				console.warn('no animDirection specified');
			}
			
		});

	};



	/***********************************************
	 *
	 *	Initial app state
	 *
	 ***********************************************/

	$sections.attr('data-theme', 'LAB');



	$('.term').each(function(){
		
		var $this = $(this);
		var classes = $this.attr('class').split(' ');
		
		if (classes[1]) {
			var numref = parseInt(classes[1].replace( /^\D+/g, ''), 10) - 1;
			$this.addClass(BGLTerms[numref].theme);
		} else {
			var numref2 = parseInt($this.find('span').attr('class').replace( /^\D+/g, ''), 10);
			$this.addClass(BGLTerms[numref2].theme);
		}
		
	});
	
});
