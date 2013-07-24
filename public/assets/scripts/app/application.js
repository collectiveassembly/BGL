function intInRange(from,to){
    return Math.floor(Math.random()*(to-from+1)+from);
}
function intInRangeFloat(from,to){
    return Math.random()*(to-from+1)+from;
}

var templates = {
	head: Hogan.compile('<h1>{{ number }}</h1><h2>{{ name }}</h2>'),
	body: Hogan.compile("\
		<div class='intro'>{{ content.intro }}</div>\
		<div class='media'>\
			{{#content.media.photo}}\
				<img src='{{content.media.photo}}'/>\
			{{/content.media.photo}}\
			{{#content.media.video}}\
				<video autoplay><source src='{{content.media.video}}' type='video/mp4'></video>\
			{{/content.media.video}}\
		</div>\
		<div class='idea'>{{ content.idea }}</div>")
}

$(function(){

	$('svg').remove(); // debug...
	
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
	var w = $(window).width();
	var h = $(window).height();
	var L_Groups = {};
	L_Groups.$els = $('#LAB-L g, #LAB-L > path')
	L_Groups.total = L_Groups.$els.length;
	L_Groups.lastIndex = L_Groups.total - 1;
	var A_Groups = {};
	A_Groups.$els = $('#LAB-A g, #LAB-A > path')
	A_Groups.total = A_Groups.$els.length;
	A_Groups.lastIndex = A_Groups.total - 1;
	var B_Groups = {};
	B_Groups.$els = $('#LAB-B svg g, #LAB-B > path')
	B_Groups.total = B_Groups.$els.length;
	B_Groups.lastIndex = B_Groups.total - 1;

	
	/***********************************************
	 *
	 *	Events
	 *
	 ***********************************************/

	$(window).on("nextTerm", function(event, terms){

		// scatter interstitials if on-screen
		if ($sections.eq(0).attr('data-theme') === 'LAB') {
			scatter_interstitial(L_Groups);
			scatter_interstitial(A_Groups);
			scatter_interstitial(B_Groups);			
		}

		// render each term's contents to screen
		terms.forEach(function(term, i){
			render_term(term, i);
		});			

	});

	$(window).on("labLogo", function(){
		
		$sections.attr('data-theme', 'LAB');
		$('section header, section article').html('<p class="notify">LAB</p>');

		show_interstitial(L_Groups);
		show_interstitial(A_Groups);
		show_interstitial(B_Groups);

		// clear canvases
		for (var i = 0; i < canvases.length; ++i) {
			var context = canvases[i].getContext('2d');
			context.clearRect(0, 0, context.canvas.width, context.canvas.height);
		}

	});

	/***********************************************
	 *
	 *	MAKE IT HAPPEN
	 *
	 ***********************************************/

	var render_term = function(term, target){
		
		var $target_section = $('section').eq(target);
		var output = {
			head: templates.head.render(term),
			body: templates.body.render(term)
		};
		
		setTimeout(function(){

			$target_section.attr('data-theme', term.theme)
			$target_section.addClass('transitioning');

			// show
			setTimeout(function(){

				// replace term html
				$target_section.find('header').html(output.head);
				$target_section.find('article').html(output.body);
				
				// createnode-graph
				var graph = new Springy.Graph();
				graph.loadJSON(term.related);
				var springy_instance = $target_section.find('canvas').springy({graph: graph});

				$target_section.removeClass('transitioning');
				
			}, (target*2000)+1000);		

		}, (target*2000)+1000);
		
	};

	var show_interstitial = function(group){

		console.log('showing interstitial', group);

		group.$els.each(function(index){
			if (index === group.lastIndex){
				group.$els.each(function(index){
					var $this = $(this);
					setTimeout(function(){
						$this.removeAttr('style').find('path').removeAttr('style');
					}, index * 50);
				});
			}
		});
		
	};

	var scatter_interstitial = function(group){
		
		console.log('scattering interstitial', group);
		
		group.$els.each(function(index){
			var $this = $(this);
			setTimeout(function(){
				if (index%2) {
					$this.css({
						'-webkit-transform': 'scale('+intInRangeFloat(0.5,3.2)+') translate3d('+intInRange(-900,-1200)+'px,'+intInRange(-900,-1200)+'px,0px)'
					});
				} else {
					$this.css({
						'-webkit-transform': 'scale('+intInRangeFloat(0.5,3.2)+') translate3d('+intInRange(-900,-1200)+'px,'+intInRange(900,1200)+'px,0px)'
					});
				}
			}, index * 150);
		});

	};



	/***********************************************
	 *
	 *	Initial app state
	 *
	 ***********************************************/

	$sections.attr('data-theme', 'LAB');
/*
	scatter_interstitial(L_Groups);
	scatter_interstitial(A_Groups);
	scatter_interstitial(B_Groups);
*/
	
});
