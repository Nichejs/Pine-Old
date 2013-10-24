/**
 * Pine Game
 * Here we handle most common things, user login, character data...
 * 
 * https://github.com/Open-RPG/open-rpg
 * 
 * License: GNU GENERAL PUBLIC LICENSE
 */

define(["jquery", "socket"], function($, io){
	
	var OpenRPG = {
		character : null,
		map : null,
		size : null,
		container : null,
		coords : {x:0,y:0},
		socketHost : 'http://uplei.com:9002',
		socket : null,
		debug : false,
		container : null,
		canvas : {canvasElement:null,size:null},
		user : {
			id : null,
			name : null
		},
		// Canvas mouse coordinates
		mouse: {
			u : 0,
			v : 0
		}
	};
	
	/**
	 * Launches Game, it requires the user to be logged in. 
	 */
	OpenRPG.start = function(){
		$(OpenRPG.container).html('<div id="overlay" class="clickThrough"></div><canvas id="game" width="900" height="500"></canvas><div id="chatOut" class="clickThrough"></div><input type="text" id="chatIn" class="clickThrough" placeholder="Chat..."><div id="bottomInfo"><span id="usersOnline"></span><span id="server"></span></div>');
	 	
	 	// Canvas reference
		OpenRPG.canvas.canvasElement=$("#game").get(0);
		OpenRPG.canvas.canvasElement.height = OpenRPG.size.h;
		OpenRPG.canvas.canvasElement.width = OpenRPG.size.w;
		OpenRPG.canvas.size=OpenRPG.size;
		
		$('canvas').mousemove(function(evt){
			// Update mouse coordinates
			var rect = OpenRPG.canvas.canvasElement.getBoundingClientRect();
			OpenRPG.mouse = {
				u: evt.clientX - rect.left,
				v: evt.clientY - rect.top
			};
		});
	};
	
	/**
	 * Check if current user is logged in
	 * @return boolean 
	 */
	OpenRPG.logged = function(){
		if(OpenRPG.user.id !== null && OpenRPG.user.id > 0) return true;
		return false;
	};

	return OpenRPG;
});

