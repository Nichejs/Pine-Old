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
		socketHost : 'http://c.uplei.com:9002',
		socket : null,
		debug : false
	};
	
	/**
	 * Start OpenRPG 
	 */
	OpenRPG.init = function(canvasElement, size){
		console.log("OpenRPG started");
		// Start socket
		OpenRPG.socketStart();
		console.log("Socket connected");
	};
	
	OpenRPG.socketStart = function(){
		OpenRPG.socket = io.connect(OpenRPG.socketHost);
	};
	
	/**
	 * Sets up the game Chat 
	 * @param {Object} input
	 * @param {Object} output
	 * @requires ChatOpenRPG
	 */
	OpenRPG.chat = function(input, output){
		ChatOpenRPG.incoming(output);
		ChatOpenRPG.outgoing(input);
	};
	
	return OpenRPG;
})();