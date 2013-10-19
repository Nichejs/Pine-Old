/**
 * Chat-Open-RPG
 * Chat System for OpenRPG
 * https://github.com/Open-RPG/open-rpg
 * 
 * License: GNU GENERAL PUBLIC LICENSE
 */

define(["jquery", "open_rpg"],function($, OpenRPG){
 	
 	var ChatOpenRPG = {
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
	ChatOpenRPG.init = function(incoming, outgoing){
		// Connect to chat room
		OpenRPG.socket.emit('subscribe', 'chat');
		
		ChatOpenRPG.input = outgoing;
		ChatOpenRPG.output = incoming;
		
		ChatOpenRPG.incoming();
		ChatOpenRPG.outgoing();
		
		// Assign letter t to chat
		$(document).keypress(function(event) {
			if(event.which == 116) { // t
 	 			event.preventDefault();
 	 			$(ChatOpenRPG.input).focus();
 	 		}
 	 	});
	};
	
	/**
	 * Receive new messages from the server and show them on-screen
 	 * @param {Object} DOM object where the chat messages should be appended
 	 */
 	 ChatOpenRPG.incoming = function(){
 	 	
 	 	$(ChatOpenRPG.output).append('<span style="background:#ccc; color:#222"> &raquo; Conectado </span><br />');
 	 	
 	 	OpenRPG.socket.on('message', function (data) {
 	 		
 	 		if(data.room = 'chat'){
 	 			
 	 			if(data.message) {
 	 				if(data.type !== undefined){
 	 					data.message = '<span style="background:#ccc; color:#222"> &raquo; '+data.message+' </span>';
 	 				}
 	 				if(data.user !== undefined){
 	 					if(data.user == OpenRPG.user.name){
 	 						data.user = '[<span style="color:red">'+data.user+'</span>]';
 	 					}else{
 	 						data.user = '[<span style="color:green">'+data.user+'</span>]';
 	 					}
 	 					data.message = data.user+' '+data.message;
 	 				}
 	 				
	 				ChatOpenRPG.displayMessage(data.message);
	 				
	 			}
 	 		}
		});
 	 };
 	 
 	/**
 	 * Write a message to the chat output
 	 */
	ChatOpenRPG.displayMessage = function(message){
 	 	$(ChatOpenRPG.output).append(message+"<br />");
	 	$(ChatOpenRPG.output).scrollTop($(ChatOpenRPG.output)[0].scrollHeight);
 	};

	/**
	 * Get new messages from the user and send them to the server
	 * They are then broadcasted from the server to the other clients.
 	 * @param {Object} DOM object where the chat should listen for messages (On enter key)
 	 */
 	 ChatOpenRPG.outgoing = function(){
 	 	
 	 	$(ChatOpenRPG.input).keypress(function(event) {
 	 		if(event.which == 13) {
 	 			event.preventDefault();
 	 			OpenRPG.socket.emit('send', { room: 'chat', message: $(ChatOpenRPG.input).val() });
 	 			$(ChatOpenRPG.input).val('').blur();
 	 			$(OpenRPG.canvas.canvasElement).focus();
 	 		}
 	 	});
 	 };

 	 return ChatOpenRPG;
 });
