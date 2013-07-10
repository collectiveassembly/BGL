function intInRange(from,to){
    return Math.floor(Math.random()*(to-from+1)+from);
}

$(function() {

	var PathGroups = {};
	PathGroups.$els = $('svg g, svg > path')
	PathGroups.total = PathGroups.$els.length;
	PathGroups.lastIndex = PathGroups.total - 1;
	PathGroups.randomIndeces = randsort(PathGroups.total);
	PathGroups.randomIndecesLast = PathGroups.randomIndeces.slice(-1)[0];

	var Paths = {};
	Paths.$els = $('svg path')
	Paths.total = Paths.$els.length;
	Paths.lastIndex = Paths.total - 1;
	Paths.randomIndeces = randsort(Paths.total);
	Paths.randomIndecesLast = Paths.randomIndeces.slice(-1)[0];


	/************************************************************/


	// Return array of the element indices in random order
	function randsort(items) {
	    var o = new Array();
	    for (var i = 0; i < items; i++) {
	        var n = Math.floor(Math.random()*items);
	        if( jQuery.inArray(n, o) > 0 ) --i;
	        else o.push(n);
	    }
	    return o;
	}

	// Reset after transitions
	function reset(delay){
		console.log('Finished triggering, resetting in '+delay+' milliseconds');
		setTimeout(function(){
			$('svg, svg *').removeClass('verticalize offset erode faded rotate');
			console.log('Finished resetting');
		}, delay);
	}


/*
	$('button').on('click', function(){
		reset(1);
	});
*/



	/************************************************************/


	
	// Trigger sequential path fade
	$('#sequential-fade').on('click', function(){

		Paths.$els.each(function(index){

			var $this = $(this);
			
			setTimeout(function(){
				$this.addClass('faded');
				if (index === Paths.lastIndex) reset(400);
			}, index * 5);

		});

	});

	// Trigger random path fade
	$('#random-fade').on('click', function(){

		Paths.randomIndeces.forEach(function(element, index, array){

			var $this = Paths.$els.eq(element);
			
			setTimeout(function(){
				$this.addClass('faded');
				if (index === Paths.randomIndecesLast) reset(3500);
			}, index * 5);			

		});		

	});

	// Trigger verticalize
	$('#verticalize').on('click', function(){
		$('svg').addClass('verticalize');
		PathGroups.$els.each(function(index){
			var $this = $(this);
			setTimeout(function(){
				$this.addClass('verticalize');
				if (index === PathGroups.lastIndex) reset(2000);
			}, index * 20);
		});
	});

	// Trigger offset
	$('#offset').on('click', function(){
		Paths.$els.each(function(index){
			var $this = $(this);
			setTimeout(function(){
				$this.addClass('offset');
				if (index === Paths.lastIndex) reset(2000);
			}, index * 5);
		});
	});

	// Trigger erode
	$('#erode').on('click', function(){
		PathGroups.$els.each(function(index){
			var $this = $(this);
			setTimeout(function(){
				$this.addClass('erode');
				if (index === PathGroups.lastIndex) reset(1200);
			}, index * 40);
		});
	});

	// Trigger rotate
	$('#rotate').on('click', function(){
		PathGroups.$els.each(function(index){
			var $this = $(this);
			setTimeout(function(){
				$this.addClass('rotate');
				//if (index === PathGroups.lastIndex) reset(1200);
			}, index * 40);
		});
	});

	// Trigger displace
	$('#displace').on('click', function(){
				
		Paths.$els.each(function(index){

			var $this = $(this);
			
			setTimeout(function(){
				
				$this.css({
					'-webkit-transform': 'scale('+intInRange(1,2.5)+') translate3d('+intInRange(-600,600)+'px,'+intInRange(-600,600)+'px,0px)'});	
				
				if (index === Paths.lastIndex){
					//reset(2000);
					Paths.$els.each(function(index){
						var $this = $(this);
						setTimeout(function(){
							$this.removeAttr('style');
						}, index * 10);
					});
				}
		
				
				
			}, index * 5);
		});

	});
	
});