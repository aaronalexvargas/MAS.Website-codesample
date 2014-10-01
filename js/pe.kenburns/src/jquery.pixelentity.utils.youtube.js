(function($) {

	$.pixelentity = $.pixelentity || {version: '1.0.0'};
	
	if ($.pixelentity.youtube) {
		return;
	}
	
	var loading = false;
	var player = window.YT && window.YT.Player;
	var list = []; 
	
	function callbacks() {
		for (var i=0;i<list.length;i++) {
			list[i](player);
		}
	}
	
	function loadPlayer() {
		if (loading) {
			return;
		}
		loading = true;
		var tag = document.createElement('script');
		tag.src = "http://www.youtube.com/player_api";
		var firstScriptTag = document.getElementsByTagName('script')[0];
		firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
		
		window.onYouTubePlayerAPIReady = function() {
			player = YT.Player;
			callbacks();
		};
		
	}
	
	$.pixelentity.youtube = function(callback) {
		if (player) {
			callback(player);
		} else {
			list.push(callback);
			loadPlayer();
		}
	};
	
})(jQuery);