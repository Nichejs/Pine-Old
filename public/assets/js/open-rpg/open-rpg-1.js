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
		socketHost : 'http://c.uplei.com:9002',
		socket : null,
		debug : false,
		canvas : {canvasElement:null,size:null},
		user : {
			id : null,
			name : null
		}
	};
	
	/**
	 * Launches Game, it requires the user to be logged in. 
	 */
	OpenRPG.start = function(){
		$(container).html('<canvas id="game" width="900" height="500"></canvas><div id="chatOut"></div><input type="text" id="chatIn" placeholder="Chat..."><div id="usersOnline"></div>');
	 	
	 	// Canvas reference
		OpenRPG.canvas.canvasElement=$("#game").get(0);
		OpenRPG.canvas.canvasElement.height = OpenRPG.size.h;
		OpenRPG.canvas.canvasElement.width = OpenRPG.size.w;
		OpenRPG.canvas.size=OpenRPG.size;

		console.log("OpenRPG started");
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

