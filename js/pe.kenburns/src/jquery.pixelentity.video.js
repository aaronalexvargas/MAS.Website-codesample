(function($) {

	$.pixelentity = $.pixelentity || {version: '1.0.0'};
	
	$.pixelentity.video = {	
		conf: { 
		} 
	};
	
	function PeVideo(t, conf) {
		var self = this;
		var jthis = $(this);
		var target = t;
		var player;
		var checkTimer;
		
		function start() {
			switch (conf.type) {
				case "youtube":
					$.pixelentity.youtube(youtubePlayerReady);
				break;
				case "vimeo":
					$.pixelentity.vimeo(vimeoPlayerReady);
				break;
			}
		} 
		
		
		function youtubePlayerReady(ytplayer) {
			player = new ytplayer(target[0], {
				height: conf.height,
				width: conf.width,
				videoId: conf.videoId,
				playerVars: {
					theme: "dark",
					wmode: "opaque",
					autohide: 0,
					enablejsapi: 1,
					origin: location.href.match(/:\/\/(.[^\/]+)/)[1],
					loop: conf.loop ? 1 : 0,
					autoplay: conf.autoPlay ? 1 : 0,
					showinfo:0,
					iv_load_policy:3,
					modestbranding:1,
					showsearch:0,
					fs:0
				},
				events: {
				  'onStateChange': ytStateChange
				}
			});
			checkTimer = setInterval(ytStateChange,250);
		}
		
		function vimeoPlayerReady(vimeoplayer) {
			player = new vimeoplayer(target[0], {
				height: conf.height,
				width: conf.width,
				videoId: conf.videoId,
				playerVars: {
					autohide: 0,
					origin: location.href.match(/:\/\/(.[^\/]+)/)[1],
					loop: conf.loop ? 1 : 0,
					autoplay: conf.autoPlay ? 1 : 0
				}
			});
			$(player).one("pixelentity.video_ended",vimeoVideoEnded);
		}
		
		function vimeoVideoEnded() {
			jthis.trigger("pixelentity.video_ended");
		}
		
		function ytStateChange() {
			if (!player) {return;}
			
			switch (player.getPlayerState()) {
				case YT.PlayerState.ENDED:
					jthis.trigger("pixelentity.video_ended");
				break;
				case YT.PlayerState.PLAYING:
					if ((player.getDuration()-player.getCurrentTime()) < 0.4) {
						jthis.trigger("pixelentity.video_ended");
					}
				break;
				
			}
		}
		
		$.extend(self, {
			bind: function(ev,hander) {
				jthis.bind(ev,handler);
			},
			destroy: function() {
				clearInterval(checkTimer);
				if (jthis) {
					jthis.remove();
				}
				jthis = self = undefined;
				if (player) {
					$(player).unbind("pixelentity.video_ended");
					player.destroy();
				}
				player = undefined;
				target.data("peVideo", null);
				target = undefined;
				
			}
		});
		
		start();
		
		
	}
	
	// jQuery plugin implementation
	$.fn.peVideo = function(conf) {
		// return existing instance
		
		var api = this.data("peVideo");
		
		if (api) { 
			return api; 
		}

		conf = $.extend(true, {}, $.pixelentity.video.conf, conf);
		
		// install kb for each entry in jQuery object
		this.each(function() {
			api = new PeVideo($(this), conf);
			$(this).data("peVideo", api); 
		});
		
		return conf.api ? api: this;		 
	};
	
		
})(jQuery);