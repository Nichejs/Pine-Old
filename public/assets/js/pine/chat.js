/**
 * Chat-Open-RPG
 * Chat System for Main
 * https://github.com/Open-RPG/open-rpg
 * 
 * License: GNU GENERAL PUBLIC LICENSE
 */

define(["jquery", "main"],function($, Main){
 	
 	var Chat = {
 		input : null,
 		output : null
 	};
	
	/**
	 * Start the chat. It sends the server a subscribe message to the room "chat".
	 * By doing this it will start receiving chat messages.
	 * It also sets up the events for the incoming and outgoing messages.
	 * @param {Object} DOM element for incoming messages (textarea or div)
	 * @param {Object} DOM element for outgoing messages (A text input probably)
	 */
	Chat.init = function(incoming, outgoing){
		// Connect to chat room
		Main.socket.emit('subscribe', 'chat');
		
		Chat.input = outgoing;
		Chat.output = incoming;
		
		Chat.incoming();
		Chat.outgoing();
		
		// Assign letter t to chat
		$(document).keypress(function(event) {
			if($('#chatIn').is(":focus")) return;
			if(event.which == 116 || event.which == 13) { // t && enter
 	 			event.preventDefault();
 	 			$(Chat.input).show().focus();
 	 		}
 	 	});
	};
	
	/**
	 * Receive new messages from the server and show them on-screen
 	 * @param {Object} DOM object where the chat messages should be appended
 	 */
 	 Chat.incoming = function(){
 	 	
 	 	Chat.displayMessage("Welcome!", 'server');
 	 	
 	 	Main.socket.on('message', function (data) {
 	 		
 	 		if(data.room = 'chat'){
 	 			
 	 			if(data.message) {
 	 				// If it's a user message, add some color to it
 	 				if(data.user !== undefined){
 	 					if(data.user == Main.user.name){
 	 						data.user = '[<span style="color:red">'+data.user+'</span>]';
 	 					}else{
 	 						data.user = '[<span style="color:blue">'+data.user+'</span>]';
 	 					}
 	 					data.message = data.user+' '+data.message;
 	 				}
 	 				
	 				Chat.displayMessage(data.message, data.type);
	 			}
 	 		}
		});
 	 };
 	 
 	/**
 	 * Write a message to the chat output
 	 */
	Chat.displayMessage = function(message, type){
		if(type!==undefined){
			switch(type){
				case 'server':
					message = '<span style="background:rgba(250,250,250,0.4); color:#222"> &raquo; '+message+' </span>';
					break;
			}
		}
 	 	$(Chat.output).append(message+"<br />");
	 	$(Chat.output).scrollTop($(Chat.output)[0].scrollHeight);
 	};

	/**
	 * Get new messages from the user and send them to the server
	 * They are then broadcasted from the server to the other clients.
 	 * @param {Object} DOM object where the chat should listen for messages (On enter key)
 	 */
 	 Chat.outgoing = function(){
 	 	
 	 	$(Chat.input).keypress(function(event) {
 	 		if(event.which == 13) {
 	 			event.preventDefault();
 	 			event.stopPropagation();
 	 			Main.socket.emit('send', { room: 'chat', message: $(Chat.input).val() });
 	 			$(Chat.input).val('').blur().hide();
 	 			$(Main.canvas.canvasElement).focus();
 	 		}
 	 	});
 	 };

 	 return Chat;
 });
