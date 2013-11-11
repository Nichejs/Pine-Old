/**
 * App - Main controller
 * This file handles the control of all game dependencies
 * and acts as the coordinator between all files.
 * 
 * https://github.com/Open-RPG/open-rpg
 * 
 * License: GNU GENERAL PUBLIC LICENSE
 */
define(["jquery", "main", "chat", "map", "tree", "character", "socket", "gui"], function($, Main, Chat, Map, Tree, Character, io, GUI){
	
	var App = {
		lastTimestamp : 0,	// Used for measuring ping
		players : []		// Tracked players
	};
	
	/**
	 * Start setting up the game
	 * @param {Object} DOM object where the game will live (A div element normally)
	 * @param {Object} Size of the container in {w:_,h:_} format 
	 */
	App.init = function(gameContainer, size){
		Main.container = gameContainer;
		Main.size = size;
		
		if(!Main.logged()){
			App.displayLogin();
		}else{
			Main.start();
		}
	};
	
	/**
	 * Displays a login box and handles its events. 
	 */
	App.displayLogin = function(){
		$('#loading').remove();
		$(Main.container).append('<h2>Login:</h2><form action="/" method="post" id="loginForm">Usuario: <input type="text" name="user" id="username" /> Contraseña: <input type="password" name="pass" id="pass" /> <input type="submit" value="Login" /><p>Not a user? <a href="/register.html">Register!</a></p></form>');
		
		// Set focus on login
		$('#username').focus();
		
		// Process the form
		$('#loginForm').submit(function(event){
			event.preventDefault();
			
			App.socketStart($('#username').val(), $('#pass').val());
		});
	};
	
	
	/**
	 * Create a new socket connection with the serve.
	 * The username and password are required for the handshake authorization.
	 * @param {String} User name
	 * @param {String} Password 
	 */
	App.socketStart = function(user, pass){
		console.log("Opening socket connection");
		console.time('Socket connected');
		Main.socket = io.connect(Main.socketHost, { query: "user="+user+"&pass="+pass });
		
		// Display a loading message
		$('form').html('<i class="fa fa-spinner fa-spin"></i> Loading...');
		
		Main.socket.on('connect', function () {
			// Launch game
			Main.start();
			
			// Launch GUI
			GUI.init();
			GUI.setHealth(100);
			
			// Add bottom stats
				// Online users
				GUI.addBotomInfo('online', '<i class="fa fa-user"></i> 1 online');
				
				// Ping
				GUI.addBotomInfo('ping', '<i class="fa fa-laptop"></i> Ping: 1ms');
				
				// Get version number from Github:
				$.get("https://api.github.com/repos/open-rpg/open-rpg/tags", function(data){
					GUI.addBotomInfo('version', 'Build: '+data[data.length-1].name);
				});
			// -------------
			
			console.timeEnd("Socket connected");
			
			// Setup username
			Main.user.name = user;
			
			// Server notifications
			Main.socket.emit('subscribe', 'server');
			// Other users position
			Main.socket.emit('subscribe', 'position');
			
			// Setup map
		 	Map.init();
		 	
		 	// Draw tree
		 	Tree.newTree(-150,-120,0,80);
		 	
		 	Tree.newTree(80,40,0,60);
		 	
		 	Tree.newTree(20,500,0,120);
		 	
		 	Tree.newTree(-450,-90,0,110);
		 	
		 	Tree.newTree(-110,400,0,70);
		 	
		 	Tree.newTree(-30,-50,0,90);
			
			// Main character
			Main.character = Character.newCharacter({
				position: {x:110,y:0,z:0},
				movable: true,
				name: Main.user.name,
				colors : {
					legs : Main.randColor(),
					body : Main.randColor()
				}
			});
			
			// Circle around character test
			Main.character.addCircle(3,'rgba(255,255,255,0.1)');
		 	
		 	// Setup chat
		 	Chat.init($('#chatOut').get(0), $('#chatIn').get(0));
		 	
		 	// Send ping messages
			var pingInterval = setInterval(function(){
				// Ping measure
				Main.socket.emit('ping', { timestamp: (new Date()).getTime() });
			},1000);
			
		});
		
		// Process ping messages
		Main.socket.on('ping', function (data) {
			// I divide by two to get one way only
			var ping = ((new Date()).getTime() - data.timestamp)/2;
			GUI.updateBottomInfo('ping', '<i class="fa fa-laptop"></i> Ping: '+ping+"ms");
		});
		
		// Process server messages
		Main.socket.on('usersOnline', function (data) {
			GUI.updateBottomInfo('online', '<i class="fa fa-user"></i> '+data.count+' online');
		});
		
		// Process server messages
		Main.socket.on('message', function (data) {
			if(data.room !== 'server') return;
			
			if(data.type == 'connect'){
				// User connected
				// We will allow only one connection, so if the user
				// is the same, bye bye!
				if(Main.user.name.toLowerCase() == data.user.toLowerCase()){
					// They are the same, bye bye to one of them
					Chat.displayMessage(data.user+' logged in twice', 'server');
					Main.socket.disconnect();
					window.location = '/';
				}else{
					// Display message on chat:
					Chat.displayMessage(data.user+' joined', 'server');
				}
				
			}
			
			if(data.type == 'disconnect'){
				// User disconnected
				// Display message on chat:
				Chat.displayMessage(data.user+' left', 'server');
				// Remove from sheetengine
				try{
					Map.densityMap.remove(App.players[data.user]);
					App.players[data.user].destroy();
				}catch(e){}
				// Remove from local cache
				delete App.players[data.user];
				// Remove from static queue
				if(data.user !== Main.user.name) Map.removeFromStaticQueue(data.user);
				
				Map.redraw();
			}
		});
		
		// Process other players movement
		Main.socket.on('update', function (data) {
			if(App.players[data.user]){
				// Player is being tracked
				App.players[data.user].moveTo(data.position);
			}else{
				// New player, create and add to array
				App.players[data.user] = Character.newCharacter({
					position : data.position,
					movable : false,
					name : data.user,
					colors : {
						legs : Main.randColor(),
						body : Main.randColor()
					}
				});
			}
		});
		
		Main.socket.on('error', function (err) {
			//window.location = '/';
			console.error("Error de conextion: ",err);
		});
	};
	
	return App;
});