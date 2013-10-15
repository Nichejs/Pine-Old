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

 define(["open-rpg/map_creation-open-rpg","open-rpg/chat-open-rpg" , "open-rpg/character-open-rpg", "socket"],
 	function(MapOpenRPG,ChatOpenRPG, CharacterOpenRPG, io){
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
		 * Start OpenRPG 
		 */
		 OpenRPG.init = function(gameContainer, size){
			OpenRPG.container = gameContainer;
			OpenRPG.size = size;
			if(!OpenRPG.logged()){
				OpenRPG.displayLogin();
			}else{
				OpenRPG.start('','');
			}
		};
		
		/**
		 * Launches Game, it requires the user to be logged in. 
		 */
		OpenRPG.start = function(user, pass){
			$(container).html('<canvas id="game" width="900" height="500"></canvas><textarea id="chatOut" rows="20" cols="50"></textarea><input type="text" id="chatIn" placeholder="Chat...">');
		 	
		 	// Canvas reference
			OpenRPG.canvas.canvasElement=$("#game").get(0);
			OpenRPG.canvas.size=OpenRPG.size;
	
			console.log("OpenRPG started");
			
			// Start socket
			OpenRPG.socketStart(user, pass);
			ChatOpenRPG.init(OpenRPG);
			
			// Launch Chat
			OpenRPG.chat($('#chatIn').get(0), $('#chatOut').get(0));
			
			// Initialize map
			OpenRPG.map();
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
			$(OpenRPG.container).append('<h2>Login to OpenRPG</h2><form action="/" method="post" id="loginForm">Usuario: <input type="text" name="user" id="username" /> Contraseña: <input type="password" name="pass" id="pass" /> <br /><input type="submit" value="Login" /></form>');
			$('#loginForm').submit(function(event){
				event.preventDefault();
				
				// Init OpenRPG
				//TODO Validate user&pass before making the form disappear...
				OpenRPG.start($('#username').val(), $('#pass').val());
			});
		};
		
		
		/**
		 * Create a new connection 
		 */
		OpenRPG.socketStart = function(user, pass){
			console.log("Opening socket connection");
			console.time('Socket connected');
			OpenRPG.socket = io.connect(OpenRPG.socketHost, { query: "user="+user+"&pass="+pass });
			OpenRPG.socket.on('connect', function () {
				console.timeEnd("Socket connected");
			});
			
			// Supongo que funciono
			OpenRPG.user.name = user;
			
			OpenRPG.socket.on('error', function (err) {
				alert("Error de conextion: "+err);
			});
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
	
		return OpenRPG;
});

