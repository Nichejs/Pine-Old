/**
 * App - Main controller
 * This file handles the control of all game dependencies
 * and acts as the coordinator between all files.
 * 
 * https://github.com/Open-RPG/open-rpg
 * 
 * License: GNU GENERAL PUBLIC LICENSE
 */
define(["jquery", "open_rpg", "chat", "map", "tree", "character", "socket"], function($, OpenRPG, ChatOpenRPG, MapOpenRPG, Tree, Character, io){
	
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
		OpenRPG.container = gameContainer;
		OpenRPG.size = size;
		
		if(!OpenRPG.logged()){
			App.displayLogin();
		}else{
			OpenRPG.start();
		}
	};
	
	/**
	 * Displays a login box and handles its events. 
	 */
	App.displayLogin = function(){
		$(OpenRPG.container).append('<h2>Login:</h2><form action="/" method="post" id="loginForm">Usuario: <input type="text" name="user" id="username" /> Contraseña: <input type="password" name="pass" id="pass" /> <input type="submit" value="Login" /><p>Not a user? <a href="/register.html">Register!</a></p></form>');
		
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
		OpenRPG.socket = io.connect(OpenRPG.socketHost, { query: "user="+user+"&pass="+pass });
		
		// Launch game
		OpenRPG.start();
		
		OpenRPG.socket.on('connect', function () {
			console.timeEnd("Socket connected");
			
			// Setup username
			OpenRPG.user.name = user;
			
			// Server notifications
			OpenRPG.socket.emit('subscribe', 'server');
			// Other users position
			OpenRPG.socket.emit('subscribe', 'position');
			
			// Setup map
		 	MapOpenRPG.init();
		 	
		 	// Draw tree
		 	Tree.newTree(-150,-120,40);
		 	
		 	Tree.newTree(80,40,40);
			
			// Main character
			var character = Character.newCharacter({
				position: {x:110,y:0,z:0},
				movable: true
			});
		 	
		 	// Setup chat
		 	ChatOpenRPG.init($('#chatOut').get(0), $('#chatIn').get(0));
		});
		
		// Process ping messages
		OpenRPG.socket.on('ping', function (data) {
			// I divide by two to get one way only
			var ping = ((new Date()).getTime() - data.timestamp)/2;
			$('#server').html("Ping: "+ping+"ms");
		});
		
		// Process server messages
		OpenRPG.socket.on('message', function (data) {
			if(data.room !== 'server') return;
			if(data.type == 'disconnect'){
				// User disconnected
				// Display message on chat:
				ChatOpenRPG.displayMessage(data.user+' left', 'server');
				// Remove from sheetengine
				try{
					App.players[data.user].destroy();
				}catch(e){}
				// Remove from local cache
				App.players.splice(data.user,1);
				// Redraw
				MapOpenRPG.draw();
			}
		});
		
		// Process other players movement
		OpenRPG.socket.on('update', function (data) {
			if(App.players[data.user]){
				// Player is being tracked
				App.players[data.user].moveTo(data.position);
			}else{
				// New player, create and add to array
				App.players[data.user] = Character.newCharacter({
					position : data.position,
					movable : false
				});
			}
		});
		
		var pingInterval = setInterval(function(){
			// Ping measure
			OpenRPG.socket.emit('ping', { timestamp: (new Date()).getTime() });
		},1000);
		
		// Process server messages
		OpenRPG.socket.on('usersOnline', function (data) {
			$('#usersOnline').html(data.count+' online');
		});
		
		OpenRPG.socket.on('error', function (err) {
			window.location = '/';
			console.error("Error de conextion: ",err);
		});
	};
	
	return App;
});