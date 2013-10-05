function intInRange(from,to){
    return Math.floor(Math.random()*(to-from+1)+from);
}
function intInRangeFloat(from,to){
    return Math.random()*(to-from+1)+from;
}

Handlebars.registerHelper('eachProperty', function(context, options) {
    var ret = "";
    for(var prop in context)
    {
        ret = ret + options.fn({property:prop,value:context[prop]});
    }
    return ret;
});

var templates = {
	head: Handlebars.compile('<h1>{{ number }}</h1><h2>{{ name }}</h2>'),
	body: Handlebars.compile("\
		<div class='term-description'>{{{ content.term_desc }}}</div>\
		<div class='media'>\
			<div class='progress-bar'></div>\
			{{#eachProperty content.media}}\
				{{#if value.photo}}\
					<img src='{{value.photo}}'/>\
				{{else}}\
					<video autoplay><source src='{{value.video}}' type='video/mp4'></video>\
				{{/if}}\
			{{/eachProperty }}\
		</div>\
		<div class='project-desc'>{{{ content.project_desc }}}</div>\
		<div class='project-meta'>\
			<div class='location'>{{{ content.project_meta.location }}}</div>\
			<div class='program'>{{{ content.project_meta.program }}}</div>\
			<div class='date'>{{{ content.project_meta.date }}}</div>\
		</div>")
}

$(function(){

	var paused = false;
	$('#pause').on('click', function(){
		$(this).toggleClass('paused');
		paused = !paused;
	});
	
	/*
	// generate output string for SVG generator
	var str = '';
	BGLTerms.forEach(function(term, i){
		str += term.number + ' ' + term.name + ' / ';
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

	 //springy seems to be causing a memory leak
	 //keep track of the created springies so they can be removed later
	var springies = [];

	
	/***********************************************
	 *
	 *	Set initial scroll position (#0, #1, #2)
	 *
	 ***********************************************/

	var hash = window.location.hash.substring(1);
	var coords = hash.split(",");
	$("body,html").scrollLeft( parseInt(coords[0]) * 1920);
	$("body,html").scrollTop( parseInt(coords[1]) * 1043);
	var targetNumber = parseInt(coords[0]);
	if (parseInt(coords[1]===0)){
		$("body,html").scrollTop(21);
	}
	//hide all the other sections (for performance reasons)
	// $("section").not("section:eq("+coords[0]+")").css("visibility", "hidden");


	/***********************************************
	 *
	 *	Caches
	 *
	 ***********************************************/

	var canvases = document.querySelectorAll('canvas');
	var $sections = $('section');
	
	var $interstitial = $('#interstitial');
	var $interstitial_terms_L = $interstitial.find('.L .term');
	var $interstitial_terms_A = $interstitial.find('.A .term');
	var $interstitial_terms_B = $interstitial.find('.B .term');
	
	var w = $(window).width();
	var h = $(window).height();

	
	/***********************************************
	 *
	 *	Events
	 *
	 ***********************************************/

	$(window).on("nextTerm", function(event, terms){
		
		if (!paused) {
		
		console.log('was last state interstitial?', last_state_was_interstitial);
			
		// scatter interstitials if on-screen
		if ($sections.eq(0).attr('data-theme') === 'LAB') {
			scatter_interstitial($interstitial_terms_L, 'left', terms[0]);
			scatter_interstitial($interstitial_terms_A, 'center', terms[1]);
			scatter_interstitial($interstitial_terms_B, 'right', terms[2]);
		}

		//tear down the previous springies
		springies.forEach(function(spring){
			spring.renderer = null;
			spring.layout = null;
			//delete all the nodes explicitly
			var nodes = spring.graph.nodes.slice();
			for (var i = 0; i < nodes.length; i++){
				spring.graph.removeNode(nodes[i]);
				nodes[i] = null;
			}
			nodes = null;
			spring.graph = null;
		})

		// render each term's contents to screen
		terms.forEach(function(term, i){
			//don't make springs for offscreen content
			if (targetNumber === i){
				render_term(term, i);
			}
		});

		last_state_was_interstitial = false;
		
		}

	});

	$(window).on("labLogo", function(){
		
		if (!paused) {
		
		console.log('was last state interstitial?', last_state_was_interstitial);
		
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
		
		last_state_was_interstitial = true;
		
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
			head: templates.head(term),
			body: templates.body(term)
		};
				
		setTimeout(function(){

			$target_section.attr('data-theme', term.theme);
			$target_section.addClass('transitioning');

			setTimeout(function(){

				if (!last_state_was_interstitial) {
					console.log('removing .transition-term(s)');
					$('.transition-term').fadeOut(2000, function(){
						$(this).remove();
					});
				}
								
				// replace term html
				$target_section.find('header').html(output.head);
				$target_section.find('article').html(output.body);
								
				// create node-graph
				var graph = new Springy.Graph();
				graph.loadJSON(term.related);
				var springy_instance = $target_section.find('canvas').springy({graph: graph});
				springies[target] = springy_instance;

				// clean up
				$target_section.removeClass('transitioning');
				$target_section.find('.progress-bar').addClass('active');
				
				// lo-fi slideshow
				var $imgs = $target_section.find('.media > img');
				var interval = 122000 / $imgs.length;
				$imgs.each(function(i){
					var $img = $(this);
					setTimeout(function(){
						$img.fadeOut(1000);
						$img = null;
					}, i*interval + interval);
				});
				//remove the reference to the target section
				$target_section = null
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
				$this.css({'opacity': 1,'-webkit-transform': 'scale(1) translate3d(0,0,0)'});
				$this = null;
			}, i * 30);
		});
		
	};

	/***********************************************
	 *
	 *	End interstitial
	 *
	 ***********************************************/

	var scatter_interstitial = function(terms, animDirection, targetTerm){
		
/*
		// create the transitional term 
		// (which optically links the interstitial to a term)

		var $transition_term = $interstitial.find('.term-' + targetTerm.number)
			.first()
			.clone();

		$transition_term.text(targetTerm.name)
			.css({
				// TODO: set additional offset for position relative to term letter
				'opacity': 0,
				'transform': 'translate3d('+$transition_term.css('left')+','+$transition_term.css('top')+',0)'
			})
			.addClass('transition-term');
	
		if (animDirection === 'left') {
			$transition_term.appendTo($interstitial.find('.L'));
		}
		else if (animDirection === 'center') {
			$transition_term.appendTo($interstitial.find('.A'));
		}
		else if (animDirection === 'right') {
			$transition_term.appendTo($interstitial.find('.B'));
		}
				
		setTimeout(function(){
			$transition_term.addClass('active');
		}, 10);
*/

		// scatter all terms off-screen
		
		terms.each(function(i){

			var $this = $(this);
			var multiplier = 10;

			if (animDirection === 'left') {
				setTimeout(function(){
					$this.css({'opacity':0,'-webkit-transform':'scale('+intInRangeFloat(0.5,3.2)+') translate3d('+intInRange(-900,-1200)+'px,'+intInRange(-1200,1200)+'px,0)'});
					$this = null;
				}, i * multiplier);
			} 
			else if (animDirection === 'center') {
				setTimeout(function(){
					$this.css({'opacity':0,'-webkit-transform':'scale('+intInRangeFloat(0.5,3.2)+') translate3d('+intInRange(-900,900)+'px,'+intInRange(-1200,1200)+'px,0)'});
					$this = null;
				}, i * multiplier);
			}
			else if (animDirection === 'right') {
				setTimeout(function(){
					$this.css({'opacity':0,'-webkit-transform':'scale('+intInRangeFloat(0.5,3.2)+') translate3d('+intInRange(900,1200)+'px,'+intInRange(-1200,1200)+'px,0)'});
					$this = null;
				}, i * multiplier);
			}
						
		});
		
	};



	/***********************************************
	 *
	 *	Initial app state
	 *
	 ***********************************************/

	$sections.attr('data-theme', 'LAB');
	var last_state_was_interstitial = true;

	// set interstitial colours
	$('.term').each(function(){
		
		var $this = $(this);
		if ($this.text() == ' ') $this.remove();
				
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
