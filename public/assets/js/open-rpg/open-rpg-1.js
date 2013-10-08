/**
 * Open-RPG
 * Open source massive online multiplayer sandbox game
 * https://github.com/Open-RPG/open-rpg
 * 
 * License: GNU GENERAL PUBLIC LICENSE
 */

var OpenRPG = (function() {
	var OpenRPG = {
		character : null,
		map : null,
		coords : {x:0,y:0},
		
		debug : false
	};
	
	OpenRPG.init = function(canvasElement, size){
		console.log("OpenRPG started");
	};
	
	return OpenRPG;
})();