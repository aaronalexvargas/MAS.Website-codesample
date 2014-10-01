(function($) {

	$.pixelentity = $.pixelentity || {version: '1.0.0'};
	
	if ($.pixelentity.ticker) {
		return;
	}

	var queue = [];
	var active = 0;
	
	function now() {
		return (new Date()).getTime();
	}
		
	var tim1,tim2,tim3 
	
	var loop =	window.requestAnimationFrame || 
				window.webkitRequestAnimationFrame || 
   		      	window.mozRequestAnimationFrame    || 
       			window.oRequestAnimationFrame      || 
				window.msRequestAnimationFrame ||
				false;
		
	function tick() {
		
		var n,entry;
		if (active > 0) {
			n= now();
		
			for (var i in queue) {
				entry = queue[i];
				if (n-entry.last >= entry.each) {
					entry.callback();
					entry.last = n;
				}
			}
			
			if (loop) {
				loop(tick);
			}
			
		}
	}
		
	var ticker = $.pixelentity.ticker = {
		register: function (callback,fps) {
			active++;
			queue.push({"callback":callback,"last":now(),"each": fps ? parseInt(1000/fps,10) : 33});
			if (active == 1) {
				if (loop) {
					loop(tick)
				} else {
					tim1 = setInterval(tick, 16);
					tim2 = setInterval(tick, 20);
					tim3 = setInterval(tick, 30);
				}
			}
		},
		unregister: function (callback) {
			for (var i in queue) {
				if (queue[i].callback == callback) {
					delete queue[i];
					active--;
				}
			}
			if (active <= 0) {
				clearInterval(tim1);
				clearInterval(tim2);
				clearInterval(tim3);
			}
		}
	}
		
})(jQuery);