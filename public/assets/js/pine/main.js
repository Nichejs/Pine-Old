/**
 * Pine Game
 * Here we handle most common things, user login, character data...
 * 
 * https://github.com/Open-RPG/open-rpg
 * 
 * License: GNU GENERAL PUBLIC LICENSE
 */

define(["jquery", "socket"], function($, io){
	
	var Main = {
		character : null,
		map : null,
		size : null,
		container : null,
		coords : {x:0,y:0},
		socketHost : 'http://server.pinegame.com:9002',
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
	Main.start = function(){
		$(Main.container).html('<div id="overlay" class="clickThrough"></div><canvas id="game" width="900" height="500"></canvas><div id="chatOut" class="clickThrough"></div><input type="text" id="chatIn" class="clickThrough" placeholder="Chat..."><div id="bottomInfo"></div>');
	 	
	 	// Canvas reference
		Main.canvas.canvasElement=$("#game").get(0);
		Main.canvas.canvasElement.height = Main.size.h;
		Main.canvas.canvasElement.width = Main.size.w;
		Main.canvas.size=Main.size;
		
		$('canvas').mousemove(function(evt){
			// Update mouse coordinates
			var rect = Main.canvas.canvasElement.getBoundingClientRect();
			Main.mouse = {
				u: evt.clientX - rect.left,
				v: evt.clientY - rect.top
			};
		});
	};
	
	/**
	 * Check if current user is logged in
	 * @return boolean 
	 */
	Main.logged = function(){
		if(Main.user.id !== null && Main.user.id > 0) return true;
		return false;
	};
	
	/**
	 * Returns a random rgba color
	 * @return {String} Color in RGBA format 
	 */
	Main.randColor = function(){
		return 'rgba('+Math.ceil(10+Math.random()*245)+','+Math.ceil(10+Math.random()*245)+','+Math.ceil(10+Math.random()*245)+',1)';
	};

	return Main;
});

