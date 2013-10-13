/**
 * Open-RPG
 * Open source massive online multiplayer sandbox game
 * https://github.com/Open-RPG/open-rpg
 * 
 * License: GNU GENERAL PUBLIC LICENSE
 */

 requirejs.config({
 	baseUrl: 'assets/js'
 });

 define(["open-rpg/map_creation-open-rpg","open-rpg/chat-open-rpg" ,"socket"],
 	function(MapOpenRPG,ChatOpenRPG ,io){
		console.log('Loaded OpenRPG');
 		var OpenRPG = {
 			character : null,
 			map : null,
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
		 * Start OpenRPG 
		 */
		 OpenRPG.init = function(canvasElement, size){
	
			//Store canvas information
			OpenRPG.canvas.canvasElement=canvasElement;
			OpenRPG.canvas.size=size;
	
			console.log("OpenRPG started");
			
			if(!OpenRPG.logged()){
				OpenRPG.displayLogin();
			}
			
			// Start socket
			OpenRPG.socketStart();
			ChatOpenRPG.init(OpenRPG);
		};
		
		/**
		 * Check if current user is logged in
		 * @return boolean 
		 */
		OpenRPG.logged = function(){
			if(OpenRPG.user.id !== null && OpenRPG.user.id > 0) return true;
			return false;
		};
		
		
		/**
		 * Displays a login box and handles its events. 
		 */
		OpenRPG.displayLogin = function(){
			//TODO Usar un estilo mas guapo para el login
			var user = prompt("Nombre de usuario"),
				pass = prompt("Contraseña");
			
			// Now we will check against the database
			$.post("/api/db", { type : "login", user : user, pass: pass }, function( data ){
				alert( data );
			}).done(function() {
				alert( "second success" );
			}).fail(function() {
				alert( "error" );
			}).always(function() {
				alert( "finished" );
			}, 'json'); 
		};
		
		
		/**
		 * Create a new connection 
		 */
		OpenRPG.socketStart = function(){
			OpenRPG.socket = io.connect(OpenRPG.socketHost);
			console.log("Socket connected");
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
	
		 OpenRPG.map = function(){
		 	MapOpenRPG.drawBaseSheet(OpenRPG.canvas.canvasElement, OpenRPG.canvas.size);
		 };
	
		 
		console.log("Devuelvo OpenRPG");
		return OpenRPG;
});